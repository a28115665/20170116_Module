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
									THEN O_IL_MARK ELSE NULL END AS 'O_IL_MARKEX_NOREPEAT' \
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
									THEN O_IL_MARK ELSE NULL END AS 'O_IL_MARKEX_NOREPEAT' \
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
			_SQLCommand += "SELECT O_ITEM_LIST.* \
							FROM ( \
								SELECT * \
								FROM O_ITEM_LIST \
								WHERE O_IL_SEQ = @O_IL_SEQ \
							) O_ITEM_LIST \
							INNER JOIN ( \
								SELECT O_IL_NEWSENDENAME, \
									O_IL_GETNO \
								FROM ( \
									SELECT * \
									FROM O_ITEM_LIST \
									LEFT JOIN O_PULL_GOODS ON \
									O_IL_SEQ = O_PG_SEQ AND \
									O_IL_SMALLNO = O_PG_SMALLNO AND \
									O_IL_NEWSMALLNO = O_PG_NEWSMALLNO \
									WHERE O_IL_SEQ = @O_IL_SEQ \
									/*拉貨不算*/ \
									AND O_PG_SEQ IS NULL \
									AND O_IL_G1 NOT IN ('G1', 'X3', '移倉') \
								) O_ITEM_LIST \
								GROUP BY O_IL_NEWSENDENAME, O_IL_GETNO \
								HAVING COUNT(1) > 1 \
							) RepeatGet ON RepeatGet.O_IL_NEWSENDENAME = O_ITEM_LIST.O_IL_NEWSENDENAME AND RepeatGet.O_IL_GETNO = O_ITEM_LIST.O_IL_GETNO \
							LEFT JOIN O_PULL_GOODS ON \
							O_IL_SEQ = O_PG_SEQ AND  \
							O_IL_SMALLNO = O_PG_SMALLNO AND \
							O_IL_NEWSMALLNO = O_PG_NEWSMALLNO \
							WHERE 1=1 \
							/*拉貨不算*/ \
							AND O_PG_SEQ IS NULL \
							AND O_IL_G1 NOT IN ('G1', 'X3', '移倉')";
		
			break;

		case "PeopleNotTheSameGetNo":
			_SQLCommand += "SELECT * \
							FROM O_ITEM_LIST \
							WHERE O_IL_SEQ = @O_IL_SEQ \
							AND O_IL_GETNO IN ( \
								SELECT A.O_IL_GETNO \
								FROM ( \
									SELECT O_IL_GETNO, O_IL_GETENAME, COUNT(1) AS Count \
									FROM O_ITEM_LIST \
									WHERE O_IL_GETNO IS NOT NULL  \
									AND O_IL_GETNO != '' \
									AND O_IL_SEQ = @O_IL_SEQ \
									GROUP BY O_IL_GETNO, O_IL_GETENAME \
								) A, \
								( \
									SELECT O_IL_GETNO, COUNT(1) AS Count \
									FROM O_ITEM_LIST \
									WHERE O_IL_GETNO IS NOT NULL \
									AND O_IL_GETNO != '' \
									AND O_IL_SEQ = @O_IL_SEQ \
									GROUP BY O_IL_GETNO \
								) B \
								WHERE A.Count != B.Count \
								AND A.O_IL_GETNO = B.O_IL_GETNO \
								GROUP BY A.O_IL_GETNO \
							) ";
		
			break;

		case "PhoneWithSameNameButDifferentCode":
			_SQLCommand += "SELECT O_ITEM_LIST.* \
							FROM ( \
								SELECT * \
								FROM O_ITEM_LIST \
								WHERE O_IL_SEQ = @O_IL_SEQ \
							) O_ITEM_LIST \
							INNER JOIN ( \
								SELECT A.O_IL_GETENAME, A.O_IL_GETPHONE \
								FROM ( \
									SELECT O_IL_GETNO, O_IL_GETENAME, O_IL_GETPHONE, COUNT(1) AS Count \
									FROM O_ITEM_LIST \
									WHERE O_IL_GETENAME IS NOT NULL \
									AND O_IL_GETENAME != '' \
									AND O_IL_GETPHONE IS NOT NULL \
									AND O_IL_GETPHONE != '' \
									AND O_IL_GETNO IS NOT NULL \
									AND O_IL_GETNO != '' \
									AND O_IL_SEQ = @O_IL_SEQ \
									GROUP BY O_IL_GETNO, O_IL_GETENAME, O_IL_GETPHONE \
								) A, \
								( \
									SELECT O_IL_GETENAME, O_IL_GETPHONE, COUNT(1) AS Count \
									FROM O_ITEM_LIST \
									WHERE O_IL_GETENAME IS NOT NULL \
									AND O_IL_GETENAME != '' \
									AND O_IL_GETPHONE IS NOT NULL \
									AND O_IL_GETPHONE != '' \
									AND O_IL_GETNO IS NOT NULL \
									AND O_IL_GETNO != '' \
									AND O_IL_SEQ = @O_IL_SEQ \
									GROUP BY O_IL_GETENAME, O_IL_GETPHONE \
								) B \
								WHERE A.Count != B.Count \
								AND A.O_IL_GETENAME = B.O_IL_GETENAME \
								AND A.O_IL_GETPHONE = B.O_IL_GETPHONE \
								GROUP BY A.O_IL_GETENAME, A.O_IL_GETPHONE \
							) O_ITEM_LIST2 ON O_ITEM_LIST.O_IL_GETENAME = O_ITEM_LIST2.O_IL_GETENAME \
							AND O_ITEM_LIST.O_IL_GETPHONE = O_ITEM_LIST2.O_IL_GETPHONE";
			break;
	}

	return _SQLCommand;
};