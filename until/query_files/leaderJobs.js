module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectOrderList":
			_SQLCommand += "SELECT OL_SEQ, \
									OL_CO_CODE, \
									OL_MASTER, \
									OL_FLIGHTNO, \
									OL_IMPORTDT, \
									OL_COUNTRY, \
									OL_REASON, \
									OL_ILSTATUS, \
									OL_FLLSTATUS, \
									OL_DILSTATUS, \
									( \
										SELECT COUNT(1) \
										FROM ( \
											SELECT IL_BAGNO \
											FROM ITEM_LIST \
											LEFT JOIN PULL_GOODS ON \
											IL_SEQ = PG_SEQ AND \
											IL_BAGNO = PG_BAGNO \
											WHERE IL_SEQ = OL_SEQ \
											AND IL_BAGNO IS NOT NULL AND IL_BAGNO != '' \
											AND PG_SEQ IS NULL \
											GROUP BY IL_BAGNO \
										) A \
									) AS 'OL_COUNT', \
									( \
										SELECT COUNT(1) \
										FROM PULL_GOODS \
										WHERE PG_SEQ = OL_SEQ \
									) AS 'OL_PULL_COUNT', \
									( \
										SELECT COUNT(1) \
										FROM ( \
											SELECT FLL_IL_NEWBAGNO \
											FROM FLIGHT_ITEM_LIST \
											WHERE FLL_SEQ = OL_SEQ \
										) A \
									) AS 'OL_FLL_COUNT', \
									( \
										SELECT MAX(IL_SUPPLEMENT_COUNT) \
										FROM ITEM_LIST \
										WHERE IL_SEQ = OL_SEQ \
									) AS 'OL_SUPPLEMENT_COUNT', \
									OL_CR_USER, \
									( \
										CASE WHEN ( \
											/*表示已有完成者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W2' AND OE_FDATETIME IS NOT NULL AND OP_PRINCIPAL = OE_PRINCIPAL \
										) > 0 THEN '3' \
										WHEN ( \
											/*表示已有完成者，但非作業員*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W2' AND OE_FDATETIME IS NOT NULL \
										) > 0 OR W2_OE.OE_FDATETIME IS NOT NULL THEN '4' \
										WHEN ( \
											/*表示未有完成者，但有編輯者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W2' AND OE_EDATETIME IS NOT NULL \
										) > 0 THEN '2' \
										WHEN ( \
											/*表示未有完成者，未有編輯者，但有負責人(已派單)*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W2' \
										) > 0 THEN '1' \
										/*表示尚未派單*/ \
										ELSE '0' END \
									) AS 'W2_STATUS', \
									( \
										CASE WHEN ( \
											/*表示已有完成者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W3' AND OE_FDATETIME IS NOT NULL AND OP_PRINCIPAL = OE_PRINCIPAL \
										) > 0 THEN '3' \
										WHEN ( \
											/*表示已有完成者，但非作業員*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W3' AND OE_FDATETIME IS NOT NULL \
										) > 0 OR W3_OE.OE_FDATETIME IS NOT NULL THEN '4' \
										WHEN ( \
											/*表示未有完成者，但有編輯者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W3' AND OE_EDATETIME IS NOT NULL \
										) > 0 THEN '2' \
										WHEN ( \
											/*表示未有完成者，未有編輯者，但有負責人(已派單)*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W3' \
										) > 0 THEN '1' \
										/*表示尚未派單*/ \
										ELSE '0' END \
									) AS 'W3_STATUS', \
									( \
										CASE WHEN ( \
											/*表示已有完成者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' AND OE_FDATETIME IS NOT NULL AND OP_PRINCIPAL = OE_PRINCIPAL \
										) > 0 THEN '3' \
										WHEN ( \
											/*表示已有完成者，但非作業員*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' AND OE_FDATETIME IS NOT NULL \
										) > 0 OR W1_OE.OE_FDATETIME IS NOT NULL THEN '4' \
										WHEN ( \
											/*表示未有完成者，但有編輯者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' AND OE_EDATETIME IS NOT NULL \
										) > 0 THEN '2' \
										WHEN ( \
											/*表示未有完成者，未有編輯者，但有負責人(已派單)*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' \
										) > 0 THEN '1' \
										/*表示尚未派單*/ \
										ELSE '0' END \
									) AS 'W1_STATUS', \
									W2_OE.OE_PRINCIPAL AS 'W2_PRINCIPAL', \
									W2_OE.OE_EDATETIME AS 'W2_EDATETIME', \
									W2_OE.OE_FDATETIME AS 'W2_FDATETIME', \
									W3_OE.OE_PRINCIPAL AS 'W3_PRINCIPAL', \
									W3_OE.OE_EDATETIME AS 'W3_EDATETIME', \
									W3_OE.OE_FDATETIME AS 'W3_FDATETIME', \
									W1_OE.OE_PRINCIPAL AS 'W1_PRINCIPAL', \
									W1_OE.OE_EDATETIME AS 'W1_EDATETIME', \
									W1_OE.OE_FDATETIME AS 'W1_FDATETIME' \
							FROM ORDER_LIST \
							/*報機單*/ \
							LEFT JOIN ORDER_EDITOR W2_OE ON W2_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W2_OE.OE_TYPE = 'R' AND (W2_OE.OE_EDATETIME IS NOT NULL OR W2_OE.OE_FDATETIME IS NOT NULL) \
							/*銷艙單只有完成時間*/ \
							LEFT JOIN ORDER_EDITOR W3_OE ON W3_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W3_OE.OE_TYPE = 'W' AND W3_OE.OE_FDATETIME IS NOT NULL \
							/*派送單*/ \
							LEFT JOIN ORDER_EDITOR W1_OE ON W1_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W1_OE.OE_TYPE = 'D' AND (W1_OE.OE_EDATETIME IS NOT NULL OR W1_OE.OE_FDATETIME IS NOT NULL) \
							WHERE OL_FDATETIME IS NULL \
							ORDER BY OL_CR_DATETIME DESC";
			break;

		case "SelectOrderPrinpl":
			_SQLCommand += "SELECT OP_SEQ, \
								   OP_DEPT, \
								   OP_TYPE, \
								   OP_PRINCIPAL, \
								   OE_EDATETIME, \
								   OE_FDATETIME \
							FROM ORDER_PRINPL \
							LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE AND OE_PRINCIPAL = OP_PRINCIPAL \
							WHERE 1=1 ";
							
			if(pParams["OP_DEPT"] !== undefined){
				_SQLCommand += " AND OP_DEPT = @OP_DEPT";
			}
		
			break;

		case "WhoPrincipal":
			_SQLCommand += "SELECT CO_NAME, \
								   COD_CODE, \
								   COD_PRINCIPAL, \
								   DL_IS_LEAVE, \
								   AS_AGENT, \
								   AS_IS_LEAVE, \
								   CASE WHEN DL_IS_LEAVE = 0 THEN COD_PRINCIPAL \
								   WHEN AS_IS_LEAVE = 0 THEN AS_AGENT \
								   ELSE NULL END AS 'WHO_PRINCIPAL' \
							FROM ( \
								/*負責人是否有請假*/ \
								SELECT CO_NAME, \
									   COD_CODE, \
									   COD_PRINCIPAL, \
									   CASE WHEN DL_ID IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS 'DL_IS_LEAVE', \
									   A.AS_AGENT, \
									   A.AS_IS_LEAVE \
								FROM COMPY_DISTRIBUTION \
								LEFT JOIN DAILY_LEAVE ON DL_ID = COD_PRINCIPAL \
								LEFT JOIN COMPY_INFO ON COD_CODE = CO_CODE \
								LEFT JOIN ( \
									/*代理人是否有請假*/ \
									SELECT AS_PRINCIPAL, \
										   AS_CODE, \
										   AS_AGENT, \
										   CASE WHEN DL_ID IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS 'AS_IS_LEAVE' \
									FROM AGENT_SETTING \
									LEFT JOIN DAILY_LEAVE ON DL_ID = AS_AGENT \
									WHERE AS_DEPT = @AS_DEPT \
								) A ON COD_CODE = A.AS_CODE AND COD_PRINCIPAL = A.AS_PRINCIPAL \
								WHERE COD_DEPT = @AS_DEPT \
							) B"; 
			break;
		case "SelectCompyStatistics":
			_SQLCommand += "SELECT CO_NAME, \
								( \
									SELECT COUNT(1) \
									FROM ITEM_LIST \
									JOIN ORDER_LIST ON OL_SEQ = IL_SEQ AND OL_CO_CODE = CO_CODE \
									/*只抓今天*/ \
									WHERE '"+pParams["IMPORTDT_FROM"]+"' <= OL_IMPORTDT AND OL_IMPORTDT <= '"+pParams["IMPORTDT_TOXX"]+"' \
								) AS 'W2_COUNT', \
								( \
									SELECT COUNT(1) \
									FROM ( \
										SELECT IL_BAGNO \
										FROM ITEM_LIST \
										JOIN ORDER_LIST ON OL_SEQ = IL_SEQ AND OL_CO_CODE = CO_CODE \
										WHERE IL_SEQ = OL_SEQ \
										AND IL_BAGNO IS NOT NULL AND IL_BAGNO != '' \
										AND '"+pParams["IMPORTDT_FROM"]+"' <= OL_IMPORTDT AND OL_IMPORTDT <= '"+pParams["IMPORTDT_TOXX"]+"' \
										GROUP BY IL_BAGNO \
									) A \
								) AS 'W2_BAG_COUNT', \
								( \
									SELECT COUNT(1) \
									FROM FLIGHT_ITEM_LIST \
									JOIN ORDER_LIST ON OL_SEQ = FLL_SEQ AND OL_CO_CODE = CO_CODE \
									/*只抓今天*/ \
									WHERE '"+pParams["IMPORTDT_FROM"]+"' <= OL_IMPORTDT AND OL_IMPORTDT <= '"+pParams["IMPORTDT_TOXX"]+"' \
								) AS 'W3_COUNT', \
								( \
									SELECT COUNT(FLL_BAGNO) \
									FROM FLIGHT_ITEM_LIST \
									JOIN ORDER_LIST ON OL_SEQ = FLL_SEQ AND OL_CO_CODE = CO_CODE \
									WHERE FLL_SEQ = OL_SEQ \
									AND FLL_BAGNO IS NOT NULL AND FLL_BAGNO != '' \
									AND '"+pParams["IMPORTDT_FROM"]+"' <= OL_IMPORTDT AND OL_IMPORTDT <= '"+pParams["IMPORTDT_TOXX"]+"' \
								) AS 'W3_BAG_COUNT', \
								( \
									SELECT COUNT(1) \
									FROM Delivery_Item_List \
									JOIN ORDER_LIST ON OL_SEQ = DIL_SEQ AND OL_CO_CODE = CO_CODE \
									/*只抓今天*/ \
									WHERE '"+pParams["IMPORTDT_FROM"]+"' <= OL_IMPORTDT AND OL_IMPORTDT <= '"+pParams["IMPORTDT_TOXX"]+"' \
								) AS 'W1_COUNT', \
								( \
									SELECT COUNT(1) \
									FROM ( \
										SELECT DIL_BAGNO \
										FROM Delivery_Item_List \
										JOIN ORDER_LIST ON OL_SEQ = DIL_SEQ AND OL_CO_CODE = CO_CODE \
										WHERE DIL_SEQ = OL_SEQ \
										AND DIL_BAGNO IS NOT NULL AND DIL_BAGNO != '' \
										AND '"+pParams["IMPORTDT_FROM"]+"' <= OL_IMPORTDT AND OL_IMPORTDT <= '"+pParams["IMPORTDT_TOXX"]+"' \
										GROUP BY DIL_BAGNO \
									) A \
								) AS 'W1_BAG_COUNT' \
							FROM COMPY_INFO";
			
			// delete pParams["IMPORTDT_FROM"];
			// delete pParams["IMPORTDT_TOXX"];
			break;


		case "SelectOrderListForExcel":
			_SQLCommand += "SELECT OL_SEQ, \
									OL_CO_CODE, \
									OL_MASTER, \
									OL_FLIGHTNO, \
									OL_IMPORTDT, \
									OL_COUNTRY, \
									OL_CR_USER, \
									( \
										CASE WHEN ( \
											/*表示已有完成者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W2' AND OE_FDATETIME IS NOT NULL AND OP_PRINCIPAL = OE_PRINCIPAL \
										) > 0 THEN '已完成' \
										WHEN ( \
											/*表示已有完成者，但非作業員*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W2' AND OE_FDATETIME IS NOT NULL \
										) > 0 OR W2_OE.OE_FDATETIME IS NOT NULL THEN '非作業員完成' \
										WHEN ( \
											/*表示未有完成者，但有編輯者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W2' AND OE_EDATETIME IS NOT NULL \
										) > 0 THEN '已編輯' \
										WHEN ( \
											/*表示未有完成者，未有編輯者，但有負責人(已派單)*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W2' \
										) > 0 THEN '已派單' \
										/*表示尚未派單*/ \
										ELSE '' END \
									) AS 'W2_STATUS', \
									( \
										CASE WHEN ( \
											/*表示已有完成者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W3' AND OE_FDATETIME IS NOT NULL AND OP_PRINCIPAL = OE_PRINCIPAL \
										) > 0 THEN '已完成' \
										WHEN ( \
											/*表示已有完成者，但非作業員*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W3' AND OE_FDATETIME IS NOT NULL \
										) > 0 OR W3_OE.OE_FDATETIME IS NOT NULL THEN '非作業員完成' \
										WHEN ( \
											/*表示未有完成者，但有編輯者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W3' AND OE_EDATETIME IS NOT NULL \
										) > 0 THEN '已編輯' \
										WHEN ( \
											/*表示未有完成者，未有編輯者，但有負責人(已派單)*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W3' \
										) > 0 THEN '已派單' \
										/*表示尚未派單*/ \
										ELSE '' END \
									) AS 'W3_STATUS', \
									( \
										CASE WHEN ( \
											/*表示已有完成者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' AND OE_FDATETIME IS NOT NULL AND OP_PRINCIPAL = OE_PRINCIPAL \
										) > 0 THEN '已完成' \
										WHEN ( \
											/*表示已有完成者，但非作業員*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' AND OE_FDATETIME IS NOT NULL \
										) > 0 OR W1_OE.OE_FDATETIME IS NOT NULL THEN '非作業員完成' \
										WHEN ( \
											/*表示未有完成者，但有編輯者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' AND OE_EDATETIME IS NOT NULL \
										) > 0 THEN '已編輯' \
										WHEN ( \
											/*表示未有完成者，未有編輯者，但有負責人(已派單)*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											LEFT JOIN ORDER_EDITOR ON OE_SEQ = OP_SEQ AND OE_TYPE = OP_TYPE \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' \
										) > 0 THEN '已派單' \
										/*表示尚未派單*/ \
										ELSE '' END \
									) AS 'W1_STATUS', \
									CONVERT(varchar, OL_IMPORTDT, 23 ) AS 'OL_IMPORTDT_EX', \
									CO_NAME \
							FROM ( \
								SELECT * \
								FROM ORDER_LIST \
								OUTTER JOIN COMPY_INFO ON CO_CODE = OL_CO_CODE \
							) ORDER_LIST \
							/*報機單*/ \
							LEFT JOIN ORDER_EDITOR W2_OE ON W2_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W2_OE.OE_TYPE = 'R' AND (W2_OE.OE_EDATETIME IS NOT NULL OR W2_OE.OE_FDATETIME IS NOT NULL) \
							/*銷艙單只有完成時間*/ \
							LEFT JOIN ORDER_EDITOR W3_OE ON W3_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W3_OE.OE_TYPE = 'W' AND W3_OE.OE_FDATETIME IS NOT NULL \
							/*派送單*/ \
							LEFT JOIN ORDER_EDITOR W1_OE ON W1_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W1_OE.OE_TYPE = 'D' AND (W1_OE.OE_EDATETIME IS NOT NULL OR W1_OE.OE_FDATETIME IS NOT NULL) \
							WHERE OL_FDATETIME IS NULL \
							ORDER BY OL_CR_DATETIME DESC";
			break;

		case "SelectParm":
			_SQLCommand = "SELECT SPA_AUTOPRIN \
						   FROM SYS_PARM";
			break;

		case "SelectOrderSupplement":
			_SQLCommand += "SELECT * \
							FROM ORDER_LIST_SUPPLEMENT \
							WHERE 1=1 ";
							
			if(pParams["OLS_SEQ"] !== undefined){
				_SQLCommand += " AND OLS_SEQ = @OLS_SEQ";
			}
		
			break;
	}

	return _SQLCommand;
};