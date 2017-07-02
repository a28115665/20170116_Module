module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectItemList":
			_SQLCommand += "SELECT BLFO_TRACK, \
									CASE WHEN PG_SEQ IS NULL THEN 0 ELSE 1 END AS 'PG_PULLGOODS', \
									CASE WHEN SPG_SEQ IS NULL OR SPG_TYPE IS NULL THEN 0 ELSE SPG_TYPE END AS 'SPG_SPECIALGOODS', \
									PG_MOVED, \
									ITEM_LIST.* \
							FROM ITEM_LIST \
							LEFT JOIN BLACK_LIST_FROM_OP ON \
							IL_SEQ = BLFO_SEQ AND \
							IL_NEWBAGNO = BLFO_NEWBAGNO AND \
							IL_NEWSMALLNO = BLFO_NEWSMALLNO AND \
							IL_ORDERINDEX = BLFO_ORDERINDEX \
							LEFT JOIN PULL_GOODS ON \
							IL_SEQ = PG_SEQ AND \
							IL_BAGNO = PG_BAGNO \
							LEFT JOIN SPECIAL_GOODS ON \
							IL_SEQ = SPG_SEQ AND \
							IL_NEWBAGNO = SPG_NEWBAGNO AND \
							IL_NEWSMALLNO = SPG_NEWSMALLNO AND \
							IL_ORDERINDEX = SPG_ORDERINDEX \
							WHERE 1=1";
							
			if(pParams["IL_SEQ"] !== undefined){
				_SQLCommand += " AND IL_SEQ = @IL_SEQ";
			}

			_SQLCommand += " ORDER BY IL_BAGNO ";
		
			break;
		case "SelectRepeatName":
			_SQLCommand += "SELECT ITEM_LIST.* \
							FROM ITEM_LIST \
							JOIN ( \
								SELECT IL_GETNAME \
								FROM ITEM_LIST \
								WHERE IL_SEQ = @IL_SEQ \
								GROUP BY IL_GETNAME \
								HAVING COUNT(*) > 1 \
							) REPEAT_NAME ON REPEAT_NAME.IL_GETNAME = ITEM_LIST.IL_GETNAME \
							WHERE ITEM_LIST.IL_SEQ = @IL_SEQ";

			_SQLCommand += " ORDER BY IL_BAGNO ";
			
			break;
		case "SelectItemListForFlight":
			_SQLCommand += "SELECT BLFO_TRACK, \
									CASE WHEN PG_SEQ IS NULL THEN 0 ELSE 1 END AS 'PG_PULLGOODS', \
									CASE WHEN SPG_SEQ IS NULL OR SPG_TYPE IS NULL THEN NULL ELSE \
										CASE WHEN SPG_TYPE = 1 THEN '普特貨'\
										ELSE '特特貨' END \
									END AS 'SPG_SPECIALGOODS', \
									CASE WHEN IL_G1 = 'X3' THEN '併X3-' + MERGENO + '-' + CONVERT(VARCHAR, IL_MERGENO_COUNT) + '袋' ELSE IL_G1 END AS 'IL_G1EX', \
									PG_MOVED, \
									ITEM_LIST.* \
							FROM ITEM_LIST \
							LEFT JOIN ( \
								SELECT IL_MERGENO AS MERGENO, COUNT(IL_BAGNO) AS IL_MERGENO_COUNT \
								FROM ( \
									SELECT DISTINCT IL_MERGENO, IL_BAGNO \
									FROM ITEM_LIST \
									WHERE IL_SEQ = @IL_SEQ \
									AND IL_MERGENO IS NOT NULL \
									AND IL_G1 = 'X3' \
								) MERGENO \
								GROUP BY IL_MERGENO \
							) ITEM_LIST2 ON ITEM_LIST2.MERGENO = ITEM_LIST.IL_MERGENO \
							LEFT JOIN BLACK_LIST_FROM_OP ON \
							IL_SEQ = BLFO_SEQ AND \
							IL_NEWBAGNO = BLFO_NEWBAGNO AND \
							IL_NEWSMALLNO = BLFO_NEWSMALLNO AND \
							IL_ORDERINDEX = BLFO_ORDERINDEX \
							LEFT JOIN PULL_GOODS ON \
							IL_SEQ = PG_SEQ AND \
							IL_BAGNO = PG_BAGNO \
							LEFT JOIN SPECIAL_GOODS ON \
							IL_SEQ = SPG_SEQ AND \
							IL_NEWBAGNO = SPG_NEWBAGNO AND \
							IL_NEWSMALLNO = SPG_NEWSMALLNO AND \
							IL_ORDERINDEX = SPG_ORDERINDEX \
							WHERE 1=1 \
							/*拉貨不匯出*/ \
							AND PG_SEQ IS NULL \
							AND IL_SEQ = @IL_SEQ \
							ORDER BY IL_BAGNO";
		
			break;

		case "SelectItemListForEx0":
			_SQLCommand += "SELECT BLFO_TRACK, \
									CASE WHEN PG_SEQ IS NULL THEN 0 ELSE 1 END AS 'PG_PULLGOODS', \
									CASE WHEN SPG_SEQ IS NULL OR SPG_TYPE IS NULL THEN NULL ELSE \
										CASE WHEN SPG_TYPE = 1 THEN '普特貨'\
										ELSE '特特貨' END \
									END AS 'SPG_SPECIALGOODS', \
									PG_MOVED, \
									ITEM_LIST.*, \
									/*報關*/ \
									'' AS 'CUSTOMS_CLEARANCE' \
							FROM ITEM_LIST \
							LEFT JOIN BLACK_LIST_FROM_OP ON \
							IL_SEQ = BLFO_SEQ AND \
							IL_NEWBAGNO = BLFO_NEWBAGNO AND \
							IL_NEWSMALLNO = BLFO_NEWSMALLNO AND \
							IL_ORDERINDEX = BLFO_ORDERINDEX \
							LEFT JOIN PULL_GOODS ON \
							IL_SEQ = PG_SEQ AND \
							IL_BAGNO = PG_BAGNO \
							LEFT JOIN SPECIAL_GOODS ON \
							IL_SEQ = SPG_SEQ AND \
							IL_NEWBAGNO = SPG_NEWBAGNO AND \
							IL_NEWSMALLNO = SPG_NEWSMALLNO AND \
							IL_ORDERINDEX = SPG_ORDERINDEX \
							WHERE 1=1 \
							/*拉貨不匯出*/ \
							AND PG_SEQ IS NULL \
							/*匯出X2*/ \
							AND IL_G1 = '' ";
							
			if(pParams["IL_SEQ"] !== undefined){
				_SQLCommand += " AND IL_SEQ = @IL_SEQ";
			}

			_SQLCommand += " ORDER BY IL_BAGNO ";
		
			break;

		case "SelectItemListForEx8":
			_SQLCommand += "SELECT BLFO_TRACK, \
									CASE WHEN PG_SEQ IS NULL THEN 0 ELSE 1 END AS 'PG_PULLGOODS', \
									CASE WHEN SPG_SEQ IS NULL OR SPG_TYPE IS NULL THEN NULL ELSE \
										CASE WHEN SPG_TYPE = 1 THEN '普特貨' \
										ELSE '特特貨' END \
									END AS 'SPG_SPECIALGOODS', \
									PG_MOVED, \
									ITEM_LIST.*, \
									/*淨重 ROUND(IF(G5-0.5>0,G5-0.5,G5-0.1),2)*/ \
									CASE WHEN ITEM_LIST.IL_WEIGHT_NEW - 0.5 > 0 THEN ROUND(ITEM_LIST.IL_WEIGHT_NEW - 0.5, 2) ELSE ROUND(ITEM_LIST.IL_WEIGHT_NEW - 0.1, 2) END AS 'NW', \
									/*稅別辦法*/ \
									'31' AS 'TAX_METHOD', \
									/*小號*/ \
									CASE WHEN LEN(ITEM_LIST.IL_SMALLNO) > 13 THEN 'X' ELSE '' END AS 'SMALLNO', \
									/*地址 IF(LENB($P5)>32,\"X\",\"\")*/ \
									CASE WHEN DATALENGTH(ITEM_LIST.IL_GETADDRESS) > 32 THEN 'X' ELSE '' END AS 'ADDRESS' \
							FROM ITEM_LIST \
							LEFT JOIN BLACK_LIST_FROM_OP ON \
							IL_SEQ = BLFO_SEQ AND \
							IL_NEWBAGNO = BLFO_NEWBAGNO AND \
							IL_NEWSMALLNO = BLFO_NEWSMALLNO AND \
							IL_ORDERINDEX = BLFO_ORDERINDEX \
							LEFT JOIN PULL_GOODS ON \
							IL_SEQ = PG_SEQ AND \
							IL_BAGNO = PG_BAGNO \
							LEFT JOIN SPECIAL_GOODS ON \
							IL_SEQ = SPG_SEQ AND \
							IL_NEWBAGNO = SPG_NEWBAGNO AND \
							IL_NEWSMALLNO = SPG_NEWSMALLNO AND \
							IL_ORDERINDEX = SPG_ORDERINDEX \
							WHERE 1=1 \
							/*拉貨不匯出*/ \
							AND PG_SEQ IS NULL \
							/*匯出X2*/ \
							AND IL_G1 = '' ";
							
			if(pParams["IL_SEQ"] !== undefined){
				_SQLCommand += " AND IL_SEQ = @IL_SEQ";
			}

			_SQLCommand += " ORDER BY IL_BAGNO ";
		
			break;
		case "SelectOverSixFirst":
			_SQLCommand += "SELECT ITEM_LIST.*, \
								   GETNAME_COUNT, \
								   GETADDRESS_COUNT, \
								   GETTEL_COUNT \
							FROM ITEM_LIST \
							LEFT JOIN V_FIRST_HALF_YEAR_NAME VFHYN ON VFHYN.IL_GETNAME = ITEM_LIST.IL_GETNAME \
							LEFT JOIN V_FIRST_HALF_YEAR_ADDRESS VFHYA ON VFHYA.IL_GETADDRESS = ITEM_LIST.IL_GETADDRESS \
							LEFT JOIN V_FIRST_HALF_YEAR_TEL VFHYT ON VFHYT.IL_GETTEL = ITEM_LIST.IL_GETTEL \
							WHERE 1=1 ";
							
			if(pParams["IL_SEQ"] !== undefined){
				_SQLCommand += " AND IL_SEQ = @IL_SEQ";
			}

			_SQLCommand += " AND ( GETADDRESS_COUNT IS NOT NULL \
							OR GETNAME_COUNT IS NOT NULL \
							OR GETTEL_COUNT IS NOT NULL ) ";
			
			break;
		case "SelectOverSixSecond":
			_SQLCommand += "SELECT ITEM_LIST.*, \
								   GETNAME_COUNT, \
								   GETADDRESS_COUNT, \
								   GETTEL_COUNT \
							FROM ITEM_LIST \
							LEFT JOIN V_SECOND_HALF_YEAR_NAME VSHYN ON VSHYN.IL_GETNAME = ITEM_LIST.IL_GETNAME \
							LEFT JOIN V_SECOND_HALF_YEAR_ADDRESS VSHYA ON VSHYA.IL_GETADDRESS = ITEM_LIST.IL_GETADDRESS \
							LEFT JOIN V_SECOND_HALF_YEAR_TEL VSHYT ON VSHYT.IL_GETTEL = ITEM_LIST.IL_GETTEL \
							WHERE 1=1 ";
							
			if(pParams["IL_SEQ"] !== undefined){
				_SQLCommand += " AND IL_SEQ = @IL_SEQ";
			}

			_SQLCommand += " AND ( GETADDRESS_COUNT IS NOT NULL \
							OR GETNAME_COUNT IS NOT NULL \
							OR GETTEL_COUNT IS NOT NULL ) ";
			
			break;
	}

	return _SQLCommand;
};