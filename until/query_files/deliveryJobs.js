module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectDeliveryItem":

			_SQLCommand += "SELECT OL_SEQ, \
								OL_CO_CODE, \
								OL_MASTER, \
								OL_FLIGHTNO, \
								OL_IMPORTDT, \
								OL_REAL_IMPORTDT, \
								OL_COUNTRY, \
								OL_REASON, \
								OL_CR_USER, \
								OL_CR_DATETIME, \
								W2_OE.OE_PRINCIPAL AS 'W2_PRINCIPAL', \
								W2_OE.OE_EDATETIME AS 'W2_EDATETIME', \
								W2_OE.OE_FDATETIME AS 'W2_FDATETIME', \
								W3_OE.OE_PRINCIPAL AS 'W3_PRINCIPAL', \
								W3_OE.OE_EDATETIME AS 'W3_EDATETIME', \
								W3_OE.OE_FDATETIME AS 'W3_FDATETIME', \
								W1_OE.OE_PRINCIPAL AS 'W1_PRINCIPAL', \
								W1_OE.OE_EDATETIME AS 'W1_EDATETIME', \
								W1_OE.OE_FDATETIME AS 'W1_FDATETIME', \
								( \
									SELECT CO_NAME \
									FROM COMPY_INFO \
									WHERE OL_CO_CODE = CO_CODE \
								) AS 'CO_NAME', \
								AML_SCHEDL_ARRIVALTIME, \
								AML_ACTL_ARRIVALTIME, \
								( \
									SELECT ISNULL(COUNT(1), 0) \
									FROM APACCS_MASTER_LIST \
									WHERE AML_SEQ = OL_SEQ \
								) AS 'AML_DELIVERY', \
								( \
									SELECT COUNT(A.IL_BAGNO) \
									FROM ( \
										SELECT IL_BAGNO, COUNT(1) AS COUNT \
										FROM ( \
											SELECT * \
											FROM ITEM_LIST \
											WHERE IL_SEQ = OL_SEQ \
										) ITEM_LIST \
										LEFT JOIN (  \
											SELECT *  \
											FROM PULL_GOODS  \
											WHERE PG_SEQ = OL_SEQ  \
										) PULL_GOODS ON  \
										IL_SEQ = PG_SEQ AND  \
										IL_BAGNO = PG_BAGNO \
										WHERE /*沒被拉貨的*/ PG_SEQ IS NULL  \
										GROUP BY IL_BAGNO \
									) A \
								) AS 'AML_TOTAL_NUM', \
								( \
						 			SELECT CASE WHEN AML_TOTAL_NUM2 = 0 THEN 1 \
									WHEN AML_TOTAL_NUM = AML_TOTAL_NUM2 THEN 1 \
									WHEN AML_TOTAL_NUM <> AML_TOTAL_NUM2 THEN 2 \
									ELSE NULL END \
									FROM ( \
										SELECT AML_SEQ, MAX(AML_TOTAL_NUM) AS 'AML_TOTAL_NUM', SUM(AML_DELIVERY_NUM) AS 'AML_TOTAL_NUM2' \
										FROM APACCS_MASTER_LIST \
										WHERE AML_TOTAL_NUM IS NOT NULL \
										GROUP BY AML_SEQ  \
									) APACCS_MASTER_LIST \
									WHERE AML_SEQ = OL_SEQ \
								) AS 'AML_DELIVERY_COMPLETE', \
								/* 類型為C1的袋號 */ \
								( \
									SELECT ISNULL(SUM(A.EML_DIFF_PIECE_C1_NOREPEAT), 0) \
									FROM (\
										SELECT IL_SEQ, \
											IL_BAGNO2, \
											CASE WHEN IL_BAGNO2Index = 1 THEN EML_DIFF_PIECE_C1 ELSE NULL END AS EML_DIFF_PIECE_C1_NOREPEAT \
										FROM ( \
											SELECT *, \
												CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END AS IL_BAGNO2_OR_MERGENO, \
												ROW_NUMBER() OVER(PARTITION BY CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END ORDER BY IL_BAGNO2) AS IL_BAGNO2Index \
											FROM V_ITEM_LIST_FOR_D \
											WHERE IL_SEQ = OL_SEQ \
										) ITEM_LIST \
										LEFT JOIN ( \
											SELECT * \
											FROM PULL_GOODS \
											WHERE PG_SEQ = OL_SEQ \
										) PULL_GOODS ON  \
										IL_SEQ = PG_SEQ AND  \
										IL_BAGNO = PG_BAGNO \
										INNER JOIN EHUFTZ_MASTER_LIST ON EHUFTZ_MASTER_LIST.EML_SEQ = IL_SEQ  \
										AND EHUFTZ_MASTER_LIST.EML_HWB = IL_BAGNO2_OR_MERGENO  \
										WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
										UNION \
										SELECT IL_SEQ, \
											IL_BAGNO2, \
											CASE WHEN IL_BAGNO2Index = 1 THEN EML_DIFF_PIECE_C1 ELSE NULL END AS EML_DIFF_PIECE_C1_NOREPEAT \
										FROM ( \
											SELECT *, \
												CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END AS IL_BAGNO2_OR_MERGENO, \
												ROW_NUMBER() OVER(PARTITION BY CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END ORDER BY IL_BAGNO2) AS IL_BAGNO2Index \
											FROM V_ITEM_LIST_FOR_D \
											WHERE IL_SEQ = OL_SEQ \
										) ITEM_LIST \
										LEFT JOIN (\
											SELECT *\
											FROM PULL_GOODS\
											WHERE PG_SEQ = OL_SEQ \
										) PULL_GOODS ON  \
										IL_SEQ = PG_SEQ AND  \
										IL_BAGNO = PG_BAGNO \
										INNER JOIN EHUFTZ_MASTER_LIST ON EHUFTZ_MASTER_LIST.EML_SEQ = IL_SEQ \
										AND EHUFTZ_MASTER_LIST.EML_EXP_BAGNO = IL_BAGNO2_OR_MERGENO \
										AND EHUFTZ_MASTER_LIST.EML_HWB = IL_SMALLNO2\
										WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
									) A\
								)  AS 'C1', \
								/* 類型為C3的袋號 */ \
								( \
									SELECT ISNULL(SUM(A.EML_DIFF_PIECE_NOTC1_NOREPEAT), 0) \
									FROM ( \
										SELECT IL_SEQ, \
											IL_BAGNO2, \
											CASE WHEN IL_BAGNO2Index = 1 THEN EML_DIFF_PIECE_NOTC1 ELSE NULL END AS EML_DIFF_PIECE_NOTC1_NOREPEAT\
										FROM ( \
											SELECT *, \
												CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END AS IL_BAGNO2_OR_MERGENO, \
												ROW_NUMBER() OVER(PARTITION BY CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END ORDER BY IL_BAGNO2) AS IL_BAGNO2Index \
											FROM V_ITEM_LIST_FOR_D \
											WHERE IL_SEQ = OL_SEQ \
										) ITEM_LIST \
										LEFT JOIN ( \
											SELECT * \
											FROM PULL_GOODS \
											WHERE PG_SEQ = OL_SEQ \
										) PULL_GOODS ON  \
										IL_SEQ = PG_SEQ AND  \
										IL_BAGNO = PG_BAGNO \
										INNER JOIN EHUFTZ_MASTER_LIST ON EHUFTZ_MASTER_LIST.EML_SEQ = IL_SEQ  \
										AND EHUFTZ_MASTER_LIST.EML_HWB = IL_BAGNO2_OR_MERGENO  \
										WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
										UNION \
										SELECT IL_SEQ, \
											IL_BAGNO2, \
											CASE WHEN IL_BAGNO2Index = 1 THEN EML_DIFF_PIECE_NOTC1 ELSE NULL END AS EML_DIFF_PIECE_NOTC1_NOREPEAT\
										FROM ( \
											SELECT *, \
												CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END AS IL_BAGNO2_OR_MERGENO, \
												ROW_NUMBER() OVER(PARTITION BY CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END ORDER BY IL_BAGNO2) AS IL_BAGNO2Index \
											FROM V_ITEM_LIST_FOR_D \
											WHERE IL_SEQ = OL_SEQ \
										) ITEM_LIST \
										LEFT JOIN ( \
											SELECT * \
											FROM PULL_GOODS \
											WHERE PG_SEQ = OL_SEQ \
										) PULL_GOODS ON  \
										IL_SEQ = PG_SEQ AND  \
										IL_BAGNO = PG_BAGNO \
										INNER JOIN EHUFTZ_MASTER_LIST ON EHUFTZ_MASTER_LIST.EML_SEQ = IL_SEQ \
										AND EHUFTZ_MASTER_LIST.EML_EXP_BAGNO = IL_BAGNO2_OR_MERGENO \
										AND EHUFTZ_MASTER_LIST.EML_HWB = IL_SMALLNO2 \
										WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
									) A \
								)  AS 'OtherC1' \
							FROM ORDER_LIST \
							/*報機單*/ \
							LEFT JOIN V_ORDER_EDITOR_BY_R W2_OE ON W2_OE.OE_SEQ = ORDER_LIST.OL_SEQ \
							/*銷艙單只有完成時間*/ \
							LEFT JOIN V_ORDER_EDITOR_BY_W W3_OE ON W3_OE.OE_SEQ = ORDER_LIST.OL_SEQ \
							/*派送單*/ \
							LEFT JOIN V_ORDER_EDITOR_BY_D W1_OE ON W1_OE.OE_SEQ = ORDER_LIST.OL_SEQ \
							/*航班資訊*/ \
							LEFT JOIN ( \
								SELECT * \
								FROM APACCS_MASTER_LIST \
								WHERE AML_NO = '1.' \
							) APACCS_MASTER_LIST ON AML_SEQ = OL_SEQ AND AML_FLIGHTNO = OL_FLIGHTNO ";
							
			if(pParams["U_ID"] !== undefined && pParams["U_GRADE"] !== undefined){

				// 早中晚班員工的Grade
				var _OpGrade = 11;

				// Grade等於11表示員工 則需要組SQL
				if(pParams["U_GRADE"] == 11){
					_SQLCommand += "/*負責人(owner)*/ \
									JOIN ( \
										SELECT * \
										FROM ORDER_PRINPL \
										WHERE OP_PRINCIPAL = @U_ID \
										AND OP_TYPE = 'D' \
									) ORDER_PRINPL ON OP_SEQ = ORDER_LIST.OL_SEQ ";
				}
			}

			_SQLCommand += " WHERE OL_FDATETIME2 IS NULL \
							 AND ( SELECT COUNT(1) \
								FROM ( \
									SELECT IL_BAGNO \
									FROM ITEM_LIST \
									WHERE IL_SEQ = OL_SEQ \
									AND IL_BAGNO IS NOT NULL AND IL_BAGNO != '' \
									GROUP BY IL_BAGNO \
								) A ) > 0 \
							 ORDER BY OL_CR_DATETIME DESC ";
		
			break;
		case "SelectApaccsDetail":

			_SQLCommand += "SELECT * \
							FROM APACCS_MASTER_LIST \
							WHERE AML_SEQ = @AML_SEQ ";

			break;
		// case "SelectOrderEditor":
		// 	_SQLCommand += "SELECT * \
		// 					FROM ORDER_EDITOR \
		// 					WHERE 1=1 ";

		// 	if(pParams["OE_SEQ"] !== undefined){
		// 		_SQLCommand += " AND OE_SEQ = @OE_SEQ ";
		// 	}
		// 	if(pParams["OE_TYPE"] !== undefined){
		// 		_SQLCommand += " AND OE_TYPE = @OE_TYPE ";
		// 	}

		// 	break;
	}

	return _SQLCommand;
};