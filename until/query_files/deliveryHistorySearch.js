module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectSearch":
			_SQLCommand += "SELECT TOP 1000 OL_SEQ, \
								OL_CO_CODE, \
								OL_MASTER, \
								OL_FLIGHTNO, \
								OL_IMPORTDT, \
								OL_COUNTRY, \
								OL_REASON, \
								OL_CR_USER, \
								OL_CR_DATETIME, \
								OL_REAL_IMPORTDT, \
								OL_FDATETIME2, \
								W2_PRINCIPAL, \
								W2_EDATETIME, \
								W2_FDATETIME, \
								W3_PRINCIPAL, \
								W3_EDATETIME, \
								W3_FDATETIME, \
								W1_PRINCIPAL, \
								W1_EDATETIME, \
								W1_FDATETIME, \
								CO_NAME, \
								AML_DELIVERY, \
								AML_TOTAL_NUM, \
								AML_DELIVERY_COMPLETE, \
								C1, \
								OtherC1, \
								CCOtherC1ByCount, \
								CCOtherC1ByBagno \
							FROM ( \
								SELECT OL_SEQ, \
									OL_CO_CODE, \
									OL_MASTER, \
									OL_FLIGHTNO, \
									OL_IMPORTDT, \
									OL_REAL_IMPORTDT, \
									OL_COUNTRY, \
									OL_REASON, \
									OL_CR_USER, \
									OL_CR_DATETIME, \
									OL_FDATETIME2, \
									W2_OE.OE_PRINCIPAL AS 'W2_PRINCIPAL', \
									W2_OE.OE_EDATETIME AS 'W2_EDATETIME', \
									W2_OE.OE_FDATETIME AS 'W2_FDATETIME', \
									W3_OE.OE_PRINCIPAL AS 'W3_PRINCIPAL', \
									W3_OE.OE_EDATETIME AS 'W3_EDATETIME', \
									W3_OE.OE_FDATETIME AS 'W3_FDATETIME', \
									W1_OE.OE_PRINCIPAL AS 'W1_PRINCIPAL', \
									W1_OE.OE_EDATETIME AS 'W1_EDATETIME', \
									W1_OE.OE_FDATETIME AS 'W1_FDATETIME', \
									CO_NAME, \
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
										SELECT ISNULL(SUM(EML_DIFF_PIECE_C1), 0) \
										FROM ( \
											/*如果袋子有非清出的則算0*/\
											SELECT IL_BAGNO2_OR_MERGENO, MIN(EML_DIFF_PIECE_C1) AS EML_DIFF_PIECE_C1 \
											FROM ( \
												SELECT *, \
													CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END AS IL_BAGNO2_OR_MERGENO, \
													ROW_NUMBER() OVER(PARTITION BY CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END ORDER BY IL_BAGNO2) AS IL_BAGNO2Index\
												FROM V_ITEM_LIST_FOR_D \
												WHERE IL_SEQ = OL_SEQ \
											) ITEM_LIST \
											LEFT JOIN ( \
												SELECT * \
												FROM PULL_GOODS \
												WHERE PG_SEQ = OL_SEQ  \
											) PULL_GOODS ON  \
											IL_SEQ = PG_SEQ AND  \
											IL_BAGNO = PG_BAGNO \
											INNER JOIN EHUFTZ_MASTER_LIST ON EHUFTZ_MASTER_LIST.EML_SEQ = IL_SEQ \
											AND EHUFTZ_MASTER_LIST.EML_EXP_BAGNO = IL_BAGNO2_OR_MERGENO \
											WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
											AND IL_BAGNO2Index = 1 \
											GROUP BY IL_BAGNO2_OR_MERGENO \
										) A \
									) AS 'C1', \
									/* 類型為C3的袋號 */ \
									( \
										SELECT ISNULL(SUM(EML_DIFF_PIECE_NOTC1), 0) \
										FROM ( \
											/*如果袋子有非清出的則以非清出為主*/\
											SELECT IL_BAGNO2_OR_MERGENO, MAX(EML_DIFF_PIECE_NOTC1) AS EML_DIFF_PIECE_NOTC1 \
											FROM ( \
												SELECT *, \
													CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END AS IL_BAGNO2_OR_MERGENO, \
													ROW_NUMBER() OVER(PARTITION BY CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END ORDER BY IL_BAGNO2) AS IL_BAGNO2Index\
												FROM V_ITEM_LIST_FOR_D \
												WHERE IL_SEQ = OL_SEQ \
											) ITEM_LIST \
											LEFT JOIN ( \
												SELECT * \
												FROM PULL_GOODS \
												WHERE PG_SEQ = OL_SEQ  \
											) PULL_GOODS ON  \
											IL_SEQ = PG_SEQ AND  \
											IL_BAGNO = PG_BAGNO \
											INNER JOIN EHUFTZ_MASTER_LIST ON EHUFTZ_MASTER_LIST.EML_SEQ = IL_SEQ \
											AND EHUFTZ_MASTER_LIST.EML_EXP_BAGNO = IL_BAGNO2_OR_MERGENO \
											WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
											AND IL_BAGNO2Index = 1 \
											GROUP BY IL_BAGNO2_OR_MERGENO \
										) A \
									) AS 'OtherC1',  \
	 								/*行家貨態不為清出的件數*/ \
									( \
										SELECT COUNT(1) \
										FROM CUSTOMS_CLEARANCE  \
										WHERE CC_SEQ = OL_SEQ  \
										AND CC_CUST_CLEARANCE <> 'C1'  \
									) AS 'CCOtherC1ByCount',  \
									/*行家貨態不為清出的袋數*/ \
									( \
										SELECT COUNT(1) \
										FROM ( \
											SELECT IL_BAGNO \
											FROM ( \
												SELECT IL_SEQ, \
													IL_NEWBAGNO, \
													IL_NEWSMALLNO, \
													IL_ORDERINDEX, \
													IL_BAGNO \
												FROM ITEM_LIST \
												WHERE IL_SEQ = OL_SEQ  \
											) ITEM_LIST \
											INNER JOIN ( \
												SELECT CC_SEQ, \
													CC_NEWBAGNO, \
													CC_NEWSMALLNO, \
													CC_ORDERINDEX, \
													CC_CUST_CLEARANCE \
												FROM CUSTOMS_CLEARANCE \
												WHERE CC_SEQ = OL_SEQ \
											) CUSTOMS_CLEARANCE ON CC_SEQ = IL_SEQ  \
											AND CC_NEWBAGNO = IL_NEWBAGNO  \
											AND CC_NEWSMALLNO = IL_NEWSMALLNO  \
											AND CC_ORDERINDEX = IL_ORDERINDEX  \
											AND CC_CUST_CLEARANCE <> 'C1'  \
											GROUP BY IL_BAGNO \
										) A \
									) AS 'CCOtherC1ByBagno' \
								FROM ( \
									SELECT * \
									FROM ORDER_LIST \
									/*行家中文名稱*/ \
									OUTTER JOIN COMPY_INFO ON CO_CODE = OL_CO_CODE \
								) ORDER_LIST \
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
								) APACCS_MASTER_LIST ON AML_SEQ = OL_SEQ AND AML_FLIGHTNO = OL_FLIGHTNO\
								LEFT JOIN (\
									SELECT IL_SEQ, \
										IL_NEWBAGNO, \
										IL_NEWSMALLNO, \
										IL_ORDERINDEX,  \
										IL_BAGNO,\
										IL_BAGNO2, \
										IL_SMALLNO2, \
										EHUFTZ_MASTER_LIST1.*, \
										CC_CUST_CLEARANCE, \
										CC_CUST_CLEARANCE_STR, \
										CC_CUST_DESC, \
										CC_ORI_DESC, \
										CC_CR_USER \
									FROM ( \
										SELECT *, \
											CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END AS IL_BAGNO2_OR_MERGENO \
										FROM V_ITEM_LIST_FOR_D \
									) ITEM_LIST \
									LEFT JOIN PULL_GOODS ON \
									IL_SEQ = PG_SEQ AND \
									IL_BAGNO = PG_BAGNO \
									INNER JOIN ( \
										SELECT *, \
											( \
												SELECT SC_DESC \
												FROM SYS_CODE \
												WHERE SC_TYPE = 'ClearanceType' \
												AND SC_CODE = EML_TRUE_CLEARANCE \
												AND SC_STS = 0 \
											) AS EML_TRUE_CLEARANCE_STR \
										FROM EHUFTZ_MASTER_LIST B \
									) EHUFTZ_MASTER_LIST1 ON EHUFTZ_MASTER_LIST1.EML_SEQ = IL_SEQ AND EHUFTZ_MASTER_LIST1.EML_HWB = IL_BAGNO2_OR_MERGENO \
									LEFT JOIN ( \
										SELECT *, \
											( \
												SELECT SC_DESC \
												FROM SYS_CODE \
												WHERE SC_TYPE = 'ClearanceType' \
												AND SC_CODE = CC_CUST_CLEARANCE \
												AND SC_STS = 0 \
											) AS CC_CUST_CLEARANCE_STR \
										FROM CUSTOMS_CLEARANCE \
									) CUSTOMS_CLEARANCE ON CC_SEQ = IL_SEQ  \
									AND CC_NEWBAGNO = IL_NEWBAGNO  \
									AND CC_NEWSMALLNO = IL_NEWSMALLNO  \
									AND CC_ORDERINDEX = IL_ORDERINDEX  \
									WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
									UNION\
									SELECT IL_SEQ, \
										IL_NEWBAGNO, \
										IL_NEWSMALLNO, \
										IL_ORDERINDEX, \
										IL_BAGNO,\
										IL_BAGNO2, \
										IL_SMALLNO2, \
										EHUFTZ_MASTER_LIST2.*, \
										CC_CUST_CLEARANCE, \
										CC_CUST_CLEARANCE_STR, \
										CC_CUST_DESC, \
										CC_ORI_DESC, \
										CC_CR_USER \
									FROM ( \
										SELECT *, \
											CASE WHEN IL_MERGENO IS NULL THEN IL_BAGNO2 ELSE IL_MERGENO END AS IL_BAGNO2_OR_MERGENO \
										FROM V_ITEM_LIST_FOR_D \
									) ITEM_LIST \
									LEFT JOIN PULL_GOODS ON \
									IL_SEQ = PG_SEQ AND \
									IL_BAGNO = PG_BAGNO \
									INNER JOIN ( \
										SELECT *, \
											( \
												SELECT SC_DESC \
												FROM SYS_CODE \
												WHERE SC_TYPE = 'ClearanceType' \
												AND SC_CODE = EML_TRUE_CLEARANCE \
												AND SC_STS = 0 \
											) AS EML_TRUE_CLEARANCE_STR \
										FROM EHUFTZ_MASTER_LIST B \
									) EHUFTZ_MASTER_LIST2 ON EHUFTZ_MASTER_LIST2.EML_SEQ = IL_SEQ AND EHUFTZ_MASTER_LIST2.EML_EXP_BAGNO = IL_BAGNO2_OR_MERGENO AND EHUFTZ_MASTER_LIST2.EML_HWB = IL_SMALLNO2 \
									LEFT JOIN ( \
										SELECT *, \
											( \
												SELECT SC_DESC \
												FROM SYS_CODE \
												WHERE SC_TYPE = 'ClearanceType' \
												AND SC_CODE = CC_CUST_CLEARANCE \
												AND SC_STS = 0 \
											) AS CC_CUST_CLEARANCE_STR \
										FROM CUSTOMS_CLEARANCE \
									) CUSTOMS_CLEARANCE ON CC_SEQ = IL_SEQ  \
									AND CC_NEWBAGNO = IL_NEWBAGNO  \
									AND CC_NEWSMALLNO = IL_NEWSMALLNO  \
									AND CC_ORDERINDEX = IL_ORDERINDEX  \
									WHERE /*沒被拉貨的*/ PG_SEQ IS NULL \
								) ITEM_LIST ON IL_SEQ = OL_SEQ \
							) A \
							WHERE 1=1 ";
						
			if(pParams["CRDT_FROM"] !== undefined){
				_SQLCommand += " AND OL_CR_DATETIME >= '" + pParams["CRDT_FROM"] + "'";
				delete pParams["CRDT_FROM"];
			}
			if(pParams["CRDT_TOXX"] !== undefined){
				_SQLCommand += " AND OL_CR_DATETIME <= '" + pParams["CRDT_TOXX"] + "'";
				delete pParams["CRDT_TOXX"];
			}						
			if(pParams["IMPORTDT_FROM"] !== undefined){
				_SQLCommand += " AND OL_IMPORTDT >= '" + pParams["IMPORTDT_FROM"] + "'";
				delete pParams["IMPORTDT_FROM"];
			}
			if(pParams["IMPORTDT_TOXX"] !== undefined){
				_SQLCommand += " AND OL_IMPORTDT <= '" + pParams["IMPORTDT_TOXX"] + "'";
				delete pParams["IMPORTDT_TOXX"];
			}
			if(pParams["CO_CODE"] !== undefined){
				pParams["OL_CO_CODE"] = pParams["CO_CODE"];
				_SQLCommand += " AND OL_CO_CODE = @OL_CO_CODE";
				delete pParams["CO_CODE"];
			}
			if(pParams["FLIGHTNO_START"] !== undefined && pParams["FLIGHTNO_END"] !== undefined){
				pParams["OL_FLIGHTNO"] = pParams["FLIGHTNO_START"] + ' ' + pParams["FLIGHTNO_END"];
				_SQLCommand += " AND OL_FLIGHTNO = @OL_FLIGHTNO";
				delete pParams["FLIGHTNO_START"];
				delete pParams["FLIGHTNO_END"];
			}
			if(pParams["MASTER_START"] !== undefined && pParams["MASTER_END"] !== undefined){
				pParams["OL_MASTER"] = pParams["MASTER_START"] + '-' + pParams["MASTER_END"];
				_SQLCommand += " AND OL_MASTER = @OL_MASTER";
				delete pParams["MASTER_START"];
				delete pParams["MASTER_END"];
			}
			if(pParams["COUNTRY"] !== undefined){
				pParams["OL_COUNTRY"] = pParams["COUNTRY"];
				_SQLCommand += " AND OL_COUNTRY = @OL_COUNTRY";
				delete pParams["COUNTRY"];
			}
			if(pParams["FINISH"] !== undefined){
				if(pParams["FINISH"]){
					_SQLCommand += " AND OL_FDATETIME2 IS NOT NULL";
				}else{
					_SQLCommand += " AND OL_FDATETIME2 IS NULL";
				}
				delete pParams["FINISH"];
			}

			_SQLCommand += " GROUP BY OL_SEQ, \
								OL_CO_CODE, \
								OL_MASTER, \
								OL_FLIGHTNO, \
								OL_IMPORTDT, \
								OL_COUNTRY, \
								OL_REASON, \
								OL_CR_USER, \
								OL_CR_DATETIME, \
								OL_REAL_IMPORTDT, \
								OL_FDATETIME2, \
								W2_PRINCIPAL, \
								W2_EDATETIME, \
								W2_FDATETIME, \
								W3_PRINCIPAL, \
								W3_EDATETIME, \
								W3_FDATETIME, \
								W1_PRINCIPAL, \
								W1_EDATETIME, \
								W1_FDATETIME, \
								CO_NAME, \
								AML_DELIVERY, \
								AML_TOTAL_NUM, \
								AML_DELIVERY_COMPLETE, \
								C1, \
								OtherC1, \
								CCOtherC1ByCount, \
								CCOtherC1ByBagno \
							ORDER BY OL_CR_DATETIME DESC ";
			break;
	}

	return _SQLCommand;
};