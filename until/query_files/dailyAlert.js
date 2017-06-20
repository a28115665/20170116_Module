module.exports = function(pQueryname, pParams){
	var _SQLCommand = "",
		/**
		 * 組合A
		 * 收件人或公司
		 * 收件人地址
		 */
		_CaseA = "SELECT '通報' AS BAN_TYPE, \
						   IL.* \
					FROM V_BLFO_JOIN_IL \
					JOIN ( \
						SELECT * \
						FROM ITEM_LIST \
						/*只抓今天*/ \
						WHERE CONVERT(varchar(100), IL_CR_DATETIME, 23) = CONVERT(varchar(100), GetDate(), 23) \
					) IL ON \
					IL.IL_GETNAME = V_BLFO_JOIN_IL.IL_GETNAME AND \
					IL.IL_GETADDRESS = V_BLFO_JOIN_IL.IL_GETADDRESS \
					\
					UNION ALL \
					\
					SELECT '自訂' AS BAN_TYPE, \
						   IL.* \
					FROM BLACK_LIST_FROM_LEADER BLFL \
					JOIN ( \
						SELECT * \
						FROM ITEM_LIST \
						/*只抓今天*/ \
						WHERE CONVERT(varchar(100), IL_CR_DATETIME, 23) = CONVERT(varchar(100), GetDate(), 23) \
					) IL ON \
					IL.IL_GETNAME = BLFL.BLFL_GETNAME AND \
					IL.IL_GETADDRESS = BLFL.BLFL_GETADDRESS \
					WHERE BLFL.BLFL_TRACK = 1 ",
		/**
		 * 組合B
		 * 收件人地址
		 * 收件人電話
		 */
		_CaseB = "SELECT '通報' AS BAN_TYPE, \
						   IL.* \
					FROM V_BLFO_JOIN_IL \
					JOIN ( \
						SELECT * \
						FROM ITEM_LIST \
						/*只抓今天*/ \
						WHERE CONVERT(varchar(100), IL_CR_DATETIME, 23) = CONVERT(varchar(100), GetDate(), 23) \
					) IL ON \
					IL.IL_GETADDRESS = V_BLFO_JOIN_IL.IL_GETADDRESS AND \
					IL.IL_GETTEL = V_BLFO_JOIN_IL.IL_GETTEL \
					\
					UNION ALL \
					\
					SELECT '自訂' AS BAN_TYPE, \
						   IL.* \
					FROM BLACK_LIST_FROM_LEADER BLFL \
					JOIN ( \
						SELECT * \
						FROM ITEM_LIST \
						/*只抓今天*/ \
						WHERE CONVERT(varchar(100), IL_CR_DATETIME, 23) = CONVERT(varchar(100), GetDate(), 23) \
					) IL ON \
					IL.IL_GETADDRESS = BLFL.BLFL_GETADDRESS AND \
					IL.IL_GETTEL = BLFL.BLFL_GETTEL \
					WHERE BLFL.BLFL_TRACK = 1 ",
		/**
		 * 組合C
		 * 收件人或公司
		 * 收件人電話
		 */
		_CaseC = "SELECT '通報' AS BAN_TYPE, \
						   IL.* \
					FROM V_BLFO_JOIN_IL \
					JOIN ( \
						SELECT * \
						FROM ITEM_LIST \
						/*只抓今天*/ \
						WHERE CONVERT(varchar(100), IL_CR_DATETIME, 23) = CONVERT(varchar(100), GetDate(), 23) \
					) IL ON \
					IL.IL_GETNAME = V_BLFO_JOIN_IL.IL_GETNAME AND \
					IL.IL_GETTEL = V_BLFO_JOIN_IL.IL_GETTEL \
					\
					UNION ALL \
					\
					SELECT '自訂' AS BAN_TYPE, \
						   IL.* \
					FROM BLACK_LIST_FROM_LEADER BLFL \
					JOIN ( \
						SELECT * \
						FROM ITEM_LIST \
						/*只抓今天*/ \
						WHERE CONVERT(varchar(100), IL_CR_DATETIME, 23) = CONVERT(varchar(100), GetDate(), 23) \
					) IL ON \
					IL.IL_GETNAME = BLFL.BLFL_GETNAME AND \
					IL.IL_GETTEL = BLFL.BLFL_GETTEL \
					WHERE BLFL.BLFL_TRACK = 1 ",
		/**
		 * 組合D
		 * 收件人或公司
		 * 收件人地址
		 * 收件人電話
		 */
		_CaseD = "SELECT '通報' AS BAN_TYPE, \
						   IL.* \
					FROM V_BLFO_JOIN_IL \
					JOIN ( \
						SELECT * \
						FROM ITEM_LIST \
						/*只抓今天*/ \
						WHERE CONVERT(varchar(100), IL_CR_DATETIME, 23) = CONVERT(varchar(100), GetDate(), 23) \
					) IL ON \
					IL.IL_GETNAME = V_BLFO_JOIN_IL.IL_GETNAME AND \
					IL.IL_GETADDRESS = V_BLFO_JOIN_IL.IL_GETADDRESS AND \
					IL.IL_GETTEL = V_BLFO_JOIN_IL.IL_GETTEL \
					\
					UNION ALL \
					\
					SELECT '自訂' AS BAN_TYPE, \
						   IL.* \
					FROM BLACK_LIST_FROM_LEADER BLFL \
					JOIN ( \
						SELECT * \
						FROM ITEM_LIST \
						/*只抓今天*/ \
						WHERE CONVERT(varchar(100), IL_CR_DATETIME, 23) = CONVERT(varchar(100), GetDate(), 23) \
					) IL ON \
					IL.IL_GETNAME = BLFL.BLFL_GETNAME AND \
					IL.IL_GETADDRESS = BLFL.BLFL_GETADDRESS AND \
					IL.IL_GETTEL = BLFL.BLFL_GETTEL \
					WHERE BLFL.BLFL_TRACK = 1 ";

	switch(pQueryname){
		case "SelectCaseACount":
			_SQLCommand += "SELECT COUNT(1) AS COUNT \
							FROM ( "+ _CaseA + " ) A \
							WHERE 1 = 1 ";
			break;
		case "SelectCaseBCount":
			_SQLCommand += "SELECT COUNT(1) AS COUNT \
							FROM ( "+ _CaseB + " ) B \
							WHERE 1 = 1 ";
			break;
		case "SelectCaseCCount":
			_SQLCommand += "SELECT COUNT(1) AS COUNT \
							FROM ( "+ _CaseC + " ) C \
							WHERE 1 = 1 ";
			break;
		case "SelectCaseDCount":
			_SQLCommand += "SELECT COUNT(1) AS COUNT \
							FROM ( "+ _CaseD + " ) D \
							WHERE 1 = 1 ";
			break;
		case "SelectILCount":
			_SQLCommand += "SELECT COUNT(1) AS COUNT \
							FROM ITEM_LIST \
							WHERE CONVERT(varchar(100), IL_CR_DATETIME, 23) = CONVERT(varchar(100), GetDate(), 23) ";
			break;
		case "SelectCaseA":
			_SQLCommand += "SELECT \
									( \
										SELECT COUNT(1) \
										FROM ITEM_LIST IN_IL \
										WHERE IN_IL.IL_GETNAME = OUT_IL.IL_GETNAME AND IN_IL.IL_GETADDRESS = OUT_IL.IL_GETADDRESS \
										/*不包含今天*/ \
										AND CONVERT(varchar(100), IN_IL.IL_CR_DATETIME, 23) NOT IN (CONVERT(varchar(100), GetDate(), 23)) \
									) AS 'IL_COUNT', \
									OUT_IL.* \
							FROM ( " + _CaseA + " ) OUT_IL \
							ORDER BY OUT_IL.IL_GETNAME DESC ";
			break;
		case "SelectCaseB":
			_SQLCommand += "SELECT \
									( \
										SELECT COUNT(1) \
										FROM ITEM_LIST IN_IL \
										WHERE IN_IL.IL_GETADDRESS = OUT_IL.IL_GETADDRESS AND IN_IL.IL_GETTEL = OUT_IL.IL_GETTEL \
										/*不包含今天*/ \
										AND CONVERT(varchar(100), IN_IL.IL_CR_DATETIME, 23) NOT IN (CONVERT(varchar(100), GetDate(), 23)) \
									) AS 'IL_COUNT', \
									OUT_IL.* \
							FROM ( " + _CaseB + " ) OUT_IL \
							ORDER BY OUT_IL.IL_GETNAME DESC ";
			break;
		case "SelectCaseC":
			_SQLCommand += "SELECT \
									( \
										SELECT COUNT(1) \
										FROM ITEM_LIST IN_IL \
										WHERE IN_IL.IL_GETNAME = OUT_IL.IL_GETNAME AND IN_IL.IL_GETTEL = OUT_IL.IL_GETTEL \
										/*不包含今天*/ \
										AND CONVERT(varchar(100), IN_IL.IL_CR_DATETIME, 23) NOT IN (CONVERT(varchar(100), GetDate(), 23)) \
									) AS 'IL_COUNT', \
									OUT_IL.* \
							FROM ( " + _CaseC + " ) OUT_IL \
							ORDER BY OUT_IL.IL_GETNAME DESC ";
			break;
		case "SelectCaseD":
			_SQLCommand += "SELECT \
									( \
										SELECT COUNT(1) \
										FROM ITEM_LIST IN_IL \
										WHERE IN_IL.IL_GETNAME = OUT_IL.IL_GETNAME AND IN_IL.IL_GETADDRESS = OUT_IL.IL_GETADDRESS AND IN_IL.IL_GETTEL = OUT_IL.IL_GETTEL \
										/*不包含今天*/ \
										AND CONVERT(varchar(100), IN_IL.IL_CR_DATETIME, 23) NOT IN (CONVERT(varchar(100), GetDate(), 23)) \
									) AS 'IL_COUNT', \
									OUT_IL.* \
							FROM ( " + _CaseD + " ) OUT_IL \
							ORDER BY OUT_IL.IL_GETNAME DESC ";
			break;
		case "SelectItemList":
			_SQLCommand += "SELECT * \
							FROM ITEM_LIST \
							WHERE CONVERT(varchar(100), IL_CR_DATETIME, 23) NOT IN (CONVERT(varchar(100), GetDate(), 23)) ";
							
			if(pParams["IL_GETADDRESS"] !== undefined){
				_SQLCommand += " AND IL_GETADDRESS = @IL_GETADDRESS";
			}
			if(pParams["IL_GETTEL"] !== undefined){
				_SQLCommand += " AND IL_GETTEL = @IL_GETTEL";
			}
			if(pParams["IL_GETNAME"] !== undefined){
				_SQLCommand += " AND IL_GETNAME = @IL_GETNAME";
			}

			_SQLCommand += " ORDER BY IL_GETNAME DESC ";

			break;
			
	}

	return _SQLCommand;
};