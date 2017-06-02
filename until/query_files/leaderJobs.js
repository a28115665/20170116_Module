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
									OL_CR_USER, \
									( \
										CASE WHEN ( \
											/*表示已有完成者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W2' AND OP_FDATETIME IS NOT NULL \
										) > 0 THEN '3' \
										WHEN ( \
											/*表示未有完成者，但有編輯者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W2' AND OP_EDATETIME IS NOT NULL \
										) > 0 THEN '2' \
										WHEN ( \
											/*表示未有完成者，未有編輯者，但有負責人(已派單)*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
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
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W3' AND OP_FDATETIME IS NOT NULL \
										) > 0 THEN '3' \
										WHEN ( \
											/*表示未有完成者，但有編輯者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W3' AND OP_EDATETIME IS NOT NULL \
										) > 0 THEN '2' \
										WHEN ( \
											/*表示未有完成者，未有編輯者，但有負責人(已派單)*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
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
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' AND OP_FDATETIME IS NOT NULL \
										) > 0 THEN '3' \
										WHEN ( \
											/*表示未有完成者，但有編輯者*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' AND OP_EDATETIME IS NOT NULL \
										) > 0 THEN '2' \
										WHEN ( \
											/*表示未有完成者，未有編輯者，但有負責人(已派單)*/ \
											SELECT COUNT(1) \
											FROM ORDER_PRINPL \
											WHERE OP_SEQ = OL_SEQ AND OP_DEPT = 'W1' \
										) > 0 THEN '1' \
										/*表示尚未派單*/ \
										ELSE '0' END \
									) AS 'W1_STATUS' \
							FROM ORDER_LIST \
							ORDER BY OL_CR_DATETIME DESC";
			break;

		case "SelectOrderPrinpl":
			_SQLCommand += "SELECT OP_SEQ, \
								   OP_DEPT, \
								   OP_TYPE, \
								   OP_PRINCIPAL, \
								   OP_EDATETIME \
							FROM ORDER_PRINPL \
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
								) AS 'W2_COUNT', \
								( \
									SELECT COUNT(1) \
									FROM FLIGHT_ITEM_LIST \
									JOIN ORDER_LIST ON OL_SEQ = FLL_SEQ AND OL_CO_CODE = CO_CODE \
								) AS 'W3_COUNT', \
								( \
									SELECT COUNT(1) \
									FROM Delivery_Item_List \
									JOIN ORDER_LIST ON OL_SEQ = DIL_SEQ AND OL_CO_CODE = CO_CODE \
								) AS 'W1_COUNT' \
							FROM COMPY_INFO";
			break;
	}

	return _SQLCommand;
};