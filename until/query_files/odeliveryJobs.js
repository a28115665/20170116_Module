module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectODeliveryItem":

			_SQLCommand += "SELECT O_OL_SEQ, \
								O_OL_CO_CODE, \
								O_OL_MASTER, \
								O_OL_IMPORTDT, \
								O_OL_PASSCODE, \
								O_OL_VOYSEQ, \
								O_OL_MVNO, \
								O_OL_COMPID, \
								O_OL_ARRLOCATIONID, \
								O_OL_POST, \
								O_OL_PACKAGELOCATIONID, \
								O_OL_BOATID, \
								O_OL_CR_USER, \
								O_OL_CR_DATETIME, \
								O_OL_REASON, \
								O_OL_ILSTATUS, \
								O_OL_FLIGHT_TOTALCROSSWEIGHT, \
								O_OL_FLIGHT_TOTALNETWEIGHT, \
								W2_OE.O_OE_PRINCIPAL AS 'OW2_PRINCIPAL', \
								W2_OE.O_OE_EDATETIME AS 'OW2_EDATETIME', \
								W2_OE.O_OE_FDATETIME AS 'OW2_FDATETIME', \
								W3_OE.O_OE_PRINCIPAL AS 'OW3_PRINCIPAL', \
								W3_OE.O_OE_EDATETIME AS 'OW3_EDATETIME', \
								W3_OE.O_OE_FDATETIME AS 'OW3_FDATETIME', \
								W1_OE.O_OE_PRINCIPAL AS 'OW1_PRINCIPAL', \
								W1_OE.O_OE_EDATETIME AS 'OW1_EDATETIME', \
								W1_OE.O_OE_FDATETIME AS 'OW1_FDATETIME', \
								( \
									SELECT O_CO_NAME \
									FROM O_COMPY_INFO \
									WHERE O_OL_CO_CODE = O_CO_CODE \
								) AS 'O_CO_NAME', \
								( \
									SELECT ISNULL(SUM(O_IL_NEWCTN), 0) \
									FROM ( \
										SELECT O_ITEM_LIST.* \
										FROM (\
											SELECT *,\
												CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
												THEN O_IL_SMALLNO ELSE NULL END AS 'O_IL_SMALLNOEX_NOREPEAT'\
											FROM O_ITEM_LIST\
											WHERE O_IL_SEQ = O_OL_SEQ \
											/*保留 AND O_IL_G1 <> '移倉'*/ \
										) O_ITEM_LIST \
										LEFT JOIN O_PULL_GOODS ON \
										O_IL_SEQ = O_PG_SEQ AND \
										O_IL_SMALLNO = O_PG_SMALLNO AND \
										O_IL_NEWSMALLNO = O_PG_NEWSMALLNO \
										WHERE 1=1 \
										/*拉貨不算*/ \
										AND O_PG_SEQ IS NULL \
										AND O_IL_SMALLNOEX_NOREPEAT IS NOT NULL \
									) O_ITEM_LIST \
								) AS 'TOTAL_NUM', \
								( \
									SELECT ISNULL(SUM(CONVERT(int, DeclarationQty)), 0) \
									FROM ( \
										SELECT O_ITEM_LIST.*, \
											CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
											THEN O_IL_SMALLNO ELSE NULL END AS 'O_IL_SMALLNOEX_NOREPEAT', \
											IMD.DeclarationQty \
										FROM ( \
											SELECT * \
											FROM O_ITEM_LIST \
											WHERE O_IL_SEQ = O_OL_SEQ \
										) O_ITEM_LIST \
										LEFT JOIN O_PULL_GOODS ON \
										O_IL_SEQ = O_PG_SEQ AND \
										O_IL_SMALLNO = O_PG_SMALLNO AND \
										O_IL_NEWSMALLNO = O_PG_NEWSMALLNO \
										LEFT JOIN IMD ON MainNumber = O_OL_MASTER \
										AND SemicolonNumber = O_IL_SMALLNO \
										WHERE 1=1 \
										/*拉貨不算*/ \
										AND O_PG_SEQ IS NULL \
										AND CustomsWay = 'C1' \
									) O_ITEM_LIST \
									WHERE O_IL_SMALLNOEX_NOREPEAT IS NOT NULL \
								) AS C1, \
								( \
									SELECT ISNULL(SUM(CONVERT(int, DeclarationQty)), 0) \
									FROM ( \
										SELECT O_ITEM_LIST.*, \
											CASE WHEN ROW_NUMBER() OVER(PARTITION BY O_IL_SMALLNO ORDER BY O_IL_SMALLNO) = 1 \
											THEN O_IL_SMALLNO ELSE NULL END AS 'O_IL_SMALLNOEX_NOREPEAT', \
											IMD.DeclarationQty \
										FROM ( \
											SELECT * \
											FROM O_ITEM_LIST \
											WHERE O_IL_SEQ = O_OL_SEQ \
										) O_ITEM_LIST \
										LEFT JOIN O_PULL_GOODS ON \
										O_IL_SEQ = O_PG_SEQ AND \
										O_IL_SMALLNO = O_PG_SMALLNO AND \
										O_IL_NEWSMALLNO = O_PG_NEWSMALLNO \
										LEFT JOIN IMD ON MainNumber = O_OL_MASTER \
										AND SemicolonNumber = O_IL_SMALLNO \
										WHERE 1=1 \
										/*拉貨不算*/ \
										AND O_PG_SEQ IS NULL \
										AND (CustomsWay <> 'C1' OR CustomsWay IS NULL) \
									) O_ITEM_LIST \
									WHERE O_IL_SMALLNOEX_NOREPEAT IS NOT NULL \
								) AS OtherC1 \
							FROM O_ORDER_LIST \
							/*報機單*/ \
							LEFT JOIN V_O_ORDER_EDITOR_BY_R W2_OE ON W2_OE.O_OE_SEQ = O_ORDER_LIST.O_OL_SEQ \
							/*銷艙單只有完成時間*/ \
							LEFT JOIN V_O_ORDER_EDITOR_BY_W W3_OE ON W3_OE.O_OE_SEQ = O_ORDER_LIST.O_OL_SEQ \
							/*派送單*/ \
							LEFT JOIN V_O_ORDER_EDITOR_BY_D W1_OE ON W1_OE.O_OE_SEQ = O_ORDER_LIST.O_OL_SEQ ";
							
			if(pParams["U_ID"] !== undefined && pParams["U_GRADE"] !== undefined){

				// 早中晚班員工的Grade
				var _OpGrade = 11;

				// Grade等於11表示員工 則需要組SQL
				if(pParams["U_GRADE"] == 11){
					_SQLCommand += "/*負責人(owner)*/ \
									JOIN ( \
										SELECT * \
										FROM O_ORDER_PRINPL \
										WHERE O_OP_PRINCIPAL = @U_ID \
									) O_ORDER_PRINPL ON O_OP_SEQ = O_ORDER_LIST.O_OL_SEQ ";
				}
			}

			_SQLCommand += " WHERE O_OL_FDATETIME2 IS NULL \
							AND ( \
								SELECT COUNT(1) \
								FROM O_ITEM_LIST \
								WHERE O_IL_SEQ = O_OL_SEQ \
							) > 0 \
							ORDER BY O_OL_CR_DATETIME DESC ";
		
			break;
	}

	return _SQLCommand;
};