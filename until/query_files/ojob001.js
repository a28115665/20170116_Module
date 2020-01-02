module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectOItemList":
			_SQLCommand += "SELECT CASE WHEN O_PG_SEQ IS NULL THEN 0 ELSE 1 END AS 'O_PG_PULLGOODS', \
									CASE WHEN O_SPG_SEQ IS NULL OR O_SPG_TYPE IS NULL THEN 0 ELSE O_SPG_TYPE END AS 'O_SPG_SPECIALGOODS', \
									O_PG_MOVED, \
									CAST(0 AS BIT) AS isSelected, \
									O_ITEM_LIST.* \
							FROM O_ITEM_LIST \
							LEFT JOIN O_PULL_GOODS ON \
							O_IL_SEQ = O_PG_SEQ AND \
							O_IL_SMALLNO = O_PG_SMALLNO AND\
							O_IL_NEWSMALLNO = O_PG_NEWSMALLNO \
							LEFT JOIN O_SPECIAL_GOODS ON \
							O_IL_SEQ = O_SPG_SEQ AND \
							O_IL_SMALLNO = O_SPG_SMALLNO AND \
							O_IL_NEWSMALLNO = O_SPG_NEWSMALLNO \
							WHERE 1=1 \
							AND O_IL_SEQ = @O_IL_SEQ \
							ORDER BY O_IL_NEWSMALLNO";
		
			break;

		case "SelectOItemListForFlight":
			_SQLCommand += "SELECT * \
							FROM ( \
								SELECT CASE WHEN O_PG_SEQ IS NULL THEN 0 ELSE 1 END AS 'O_PG_PULLGOODS', \
										CASE WHEN O_SPG_SEQ IS NULL OR O_SPG_TYPE IS NULL THEN NULL ELSE \
											CASE WHEN O_SPG_TYPE = 1 THEN '普特貨' \
											ELSE '特特貨' END \
										END AS 'SPG_SPECIALGOODS', \
										O_PG_MOVED, \
										O_ITEM_LIST.*, \
										CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
										THEN O_IL_SMALLNO ELSE NULL END AS 'O_IL_SMALLNOEX_NOREPEAT', \
										O_PG_SEQ \
								FROM O_ITEM_LIST \
								LEFT JOIN O_PULL_GOODS ON \
								O_IL_SEQ = O_PG_SEQ AND \
								O_IL_SMALLNO = O_PG_SMALLNO AND \
								O_IL_NEWSMALLNO = O_PG_NEWSMALLNO \
								LEFT JOIN O_SPECIAL_GOODS ON \
								O_IL_SEQ = O_SPG_SEQ AND \
								O_IL_SMALLNO = O_SPG_SMALLNO AND \
								O_IL_NEWSMALLNO = O_SPG_NEWSMALLNO \
							) O_ITEM_LIST\
							WHERE 1=1 \
							/*拉貨不匯出*/ \
							AND O_PG_SEQ IS NULL \
							/*銷艙單只匯出小號標頭第一筆*/ \
							AND O_IL_SMALLNOEX_NOREPEAT IS NOT NULL \
							AND O_IL_SEQ = @O_IL_SEQ \
							ORDER BY O_IL_NEWSMALLNO";
			break;

		case "SelectOItemListForEx0":
			_SQLCommand += "SELECT CASE WHEN O_PG_SEQ IS NULL THEN 0 ELSE 1 END AS 'O_PG_PULLGOODS', \
									CASE WHEN O_SPG_SEQ IS NULL OR O_SPG_TYPE IS NULL THEN NULL ELSE \
										CASE WHEN O_SPG_TYPE = 1 THEN '普特貨'\
										ELSE '特特貨' END \
									END AS 'SPG_SPECIALGOODS', \
									O_PG_MOVED, \
									O_ITEM_LIST.*, \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_SMALLNO ELSE NULL END AS 'O_IL_SMALLNOEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_POSTNO ELSE NULL END AS 'O_IL_POSTNOEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_CUSTID ELSE NULL END AS 'O_IL_CUSTIDEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_PRICECONDITON ELSE NULL END AS 'O_IL_PRICECONDITONEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_CURRENCY ELSE NULL END AS 'O_IL_CURRENCYEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_NEWCROSSWEIGHT ELSE NULL END AS 'O_IL_NEWCROSSWEIGHTEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_NEWCTN ELSE NULL END AS 'O_IL_NEWCTNEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_CTNUNIT ELSE NULL END AS 'O_IL_CTNUNITEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_MARK ELSE NULL END AS 'O_IL_MARKEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_NEWSENDENAME ELSE NULL END AS 'O_IL_NEWSENDENAMEEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_NEWCOUNTRYID ELSE NULL END AS 'O_IL_NEWCOUNTRYIDEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_NEWSENDADDRESS ELSE NULL END AS 'O_IL_NEWSENDADDRESSEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_GETID ELSE NULL END AS 'O_IL_GETIDEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_GETNO ELSE NULL END AS 'O_IL_GETNOEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_GETENAME ELSE NULL END AS 'O_IL_GETENAMEEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_GETPHONE ELSE NULL END AS 'O_IL_GETPHONEEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_GETADDRESS ELSE NULL END AS 'O_IL_GETADDRESSEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_DECLAREMEMO2 ELSE NULL END AS 'O_IL_DECLAREMEMO2EX_NOREPEAT' \
							FROM O_ITEM_LIST \
							LEFT JOIN O_PULL_GOODS ON \
							O_IL_SEQ = O_PG_SEQ AND \
							O_IL_SMALLNO = O_PG_SMALLNO AND\
							O_IL_NEWSMALLNO = O_PG_NEWSMALLNO \
							LEFT JOIN O_SPECIAL_GOODS ON \
							O_IL_SEQ = O_SPG_SEQ AND \
							O_IL_SMALLNO = O_SPG_SMALLNO AND \
							O_IL_NEWSMALLNO = O_SPG_NEWSMALLNO \
							WHERE 1=1 \
							/*拉貨不匯出*/ \
							AND O_PG_SEQ IS NULL ";
			
			if(pParams["O_IL_G1"] !== undefined){
				_SQLCommand += " AND O_IL_G1 IN ("+pParams["O_IL_G1"]+")";
				delete pParams["O_IL_G1"];
			}
			
			// if(pParams["IL_MERGENO"] !== undefined && pParams["IL_MERGENO"] == null){
			// 	_SQLCommand += " AND IL_MERGENO IS NULL";
			// }

			if(pParams["O_IL_SEQ"] !== undefined){
				_SQLCommand += " AND O_IL_SEQ = @O_IL_SEQ";
			}
							
			if(pParams["NewSmallNo"] !== undefined){
				_SQLCommand += " AND O_IL_NEWSMALLNO IN ("+pParams["NewSmallNo"]+") ";
				delete pParams["NewSmallNo"];
			}

			_SQLCommand += " ORDER BY O_IL_NEWSMALLNO ";
		
			break;

		case "SelectOItemListForEx12":
			_SQLCommand += "SELECT CASE WHEN O_PG_SEQ IS NULL THEN 0 ELSE 1 END AS 'O_PG_PULLGOODS', \
									CASE WHEN O_SPG_SEQ IS NULL OR O_SPG_TYPE IS NULL THEN NULL ELSE \
										CASE WHEN O_SPG_TYPE = 1 THEN '普特貨'\
										ELSE '特特貨' END \
									END AS 'SPG_SPECIALGOODS', \
									O_PG_MOVED, \
									O_ITEM_LIST.*, \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_SMALLNO ELSE NULL END AS 'O_IL_SMALLNOEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_POSTNO ELSE NULL END AS 'O_IL_POSTNOEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_CUSTID ELSE NULL END AS 'O_IL_CUSTIDEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_PRICECONDITON ELSE NULL END AS 'O_IL_PRICECONDITONEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_CURRENCY ELSE NULL END AS 'O_IL_CURRENCYEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_NEWCROSSWEIGHT ELSE NULL END AS 'O_IL_NEWCROSSWEIGHTEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_NEWCTN ELSE NULL END AS 'O_IL_NEWCTNEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_CTNUNIT ELSE NULL END AS 'O_IL_CTNUNITEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_MARK ELSE NULL END AS 'O_IL_MARKEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_NEWSENDENAME ELSE NULL END AS 'O_IL_NEWSENDENAMEEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_NEWCOUNTRYID ELSE NULL END AS 'O_IL_NEWCOUNTRYIDEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_NEWSENDADDRESS ELSE NULL END AS 'O_IL_NEWSENDADDRESSEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_GETID ELSE NULL END AS 'O_IL_GETIDEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_GETNO ELSE NULL END AS 'O_IL_GETNOEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_GETENAME ELSE NULL END AS 'O_IL_GETENAMEEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_GETPHONE ELSE NULL END AS 'O_IL_GETPHONEEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_GETADDRESS ELSE NULL END AS 'O_IL_GETADDRESSEX_NOREPEAT', \
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
									THEN O_IL_DECLAREMEMO2 ELSE NULL END AS 'O_IL_DECLAREMEMO2EX_NOREPEAT' \
							FROM O_ITEM_LIST \
							LEFT JOIN O_PULL_GOODS ON \
							O_IL_SEQ = O_PG_SEQ AND \
							O_IL_SMALLNO = O_PG_SMALLNO AND\
							O_IL_NEWSMALLNO = O_PG_NEWSMALLNO \
							LEFT JOIN O_SPECIAL_GOODS ON \
							O_IL_SEQ = O_SPG_SEQ AND \
							O_IL_SMALLNO = O_SPG_SMALLNO AND \
							O_IL_NEWSMALLNO = O_SPG_NEWSMALLNO \
							WHERE 1=1 \
							/*拉貨不匯出*/ \
							AND O_PG_SEQ IS NULL ";
			
			if(pParams["O_IL_G1"] !== undefined){
				_SQLCommand += " AND O_IL_G1 IN ("+pParams["O_IL_G1"]+")";
				delete pParams["O_IL_G1"];
			}
			
			// if(pParams["IL_MERGENO"] !== undefined && pParams["IL_MERGENO"] == null){
			// 	_SQLCommand += " AND IL_MERGENO IS NULL";
			// }

			if(pParams["O_IL_SEQ"] !== undefined){
				_SQLCommand += " AND O_IL_SEQ = @O_IL_SEQ";
			}
							
			if(pParams["NewSmallNo"] !== undefined){
				_SQLCommand += " AND O_IL_NEWSMALLNO IN ("+pParams["NewSmallNo"]+") ";
				delete pParams["NewSmallNo"];
			}

			_SQLCommand += " ORDER BY O_IL_NEWSMALLNO ";

			break;

		case "CalculateCrossWieghtBalance":
			_SQLCommand += "DECLARE	@return_value decimal \
							EXEC	@return_value = [dbo].[CrossWeightBalance] \
									@Seq = @O_IL_SEQ \
							SELECT	'ReturnValue' = @return_value ";
		
			break;

		case "CalculateNetWieghtBalance":
			_SQLCommand += "DECLARE	@return_value decimal \
							EXEC	@return_value = [dbo].[NetWeightBalance] \
									@Seq = @O_IL_SEQ \
							SELECT	'ReturnValue' = @return_value ";
		
			break;

		case "RepeatGet":
			_SQLCommand += "EXEC	dbo.RepeatGet \
							@Seq = @O_IL_SEQ";
			break;

		case "PeopleNotTheSameGetNo":
			_SQLCommand += "EXEC	dbo.PeopleNotTheSameGetNo \
							@Seq = @O_IL_SEQ";
			break;

		case "GetNoIsValid":
			_SQLCommand += "EXEC	dbo.GetNoIsValid \
							@Seq = @O_IL_SEQ";
			break;

		case "PhoneWithSameNameButDifferentCode":			 				
			 	_SQLCommand += "EXEC	dbo.PhoneWithSameNameButDifferentCode \
								@Seq = @O_IL_SEQ";
			break;
	}

	return _SQLCommand;
};