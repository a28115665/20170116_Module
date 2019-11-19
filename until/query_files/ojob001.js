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
							AND O_IL_SEQ = @O_IL_SEQ";
		
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
									THEN O_IL_SMALLNO ELSE NULL END AS 'O_IL_SMALLNOEX_NOREPEAT' \
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

			// _SQLCommand += " ORDER BY O_IL_SMALLNO ";
		
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
									THEN O_IL_SMALLNO ELSE NULL END AS 'O_IL_SMALLNOEX_NOREPEAT' \
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

			// _SQLCommand += " ORDER BY IL_BAGNO ";

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
									CASE WHEN ROW_NUMBER() OVER(PARTITION BY IL_BAGNO ORDER BY IL_BAGNO) = 1 \
									THEN IL_BAGNO ELSE NULL END AS 'IL_BAGNOEX_NOREPEAT', \
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
							AND IL_G1 IN ('', 'X2') ";
							
			if(pParams["IL_SEQ"] !== undefined){
				_SQLCommand += " AND IL_SEQ = @IL_SEQ";
			}
							
			if(pParams["NewSmallNo"] !== undefined){
				_SQLCommand += " AND IL_NEWSMALLNO IN ("+pParams["NewSmallNo"]+") ";
				delete pParams["NewSmallNo"];
			}

			_SQLCommand += " ORDER BY IL_BAGNO ";
		
			break;

		case "CalculateCrossWieghtBalance":
			_SQLCommand += "DECLARE	@return_value decimal \
							EXEC	@return_value = [dbo].[CrossWeightBalance] \
									@Seq = @O_IL_SEQ \
							SELECT	'ReturnValue' = @return_value ";
		
			break;
	}

	return _SQLCommand;
};