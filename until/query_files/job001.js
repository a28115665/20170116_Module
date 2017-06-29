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
							AND PG_SEQ IS NULL ";
							
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
									/*文件編碼*/ \
									'' AS 'FILE_CODE', \
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
							AND PG_SEQ IS NULL ";
							
			if(pParams["IL_SEQ"] !== undefined){
				_SQLCommand += " AND IL_SEQ = @IL_SEQ";
			}

			_SQLCommand += " ORDER BY IL_BAGNO ";
		
			break;
	}

	return _SQLCommand;
};