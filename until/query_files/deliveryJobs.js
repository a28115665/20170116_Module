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
									FA_SCHEDL_ARRIVALTIME, \
									FA_ACTL_ARRIVALTIME, \
									FA_ARRIVAL_REMK, \
									( \
										SELECT ISNULL(COUNT(1), 0) \
										FROM APACCS_MASTER_LIST \
										WHERE AML_SEQ = OL_SEQ \
									) AS 'AML_DELIVERY', \
									( \
										SELECT TOP 1 AML_TOTAL_NUM \
										FROM APACCS_MASTER_LIST \
										WHERE AML_SEQ = OL_SEQ \
									) AS 'AML_TOTAL_NUM', \
									( \
 										SELECT CASE WHEN AML_TOTAL_NUM2 = 0 THEN 1 \
										WHEN AML_TOTAL_NUM = AML_TOTAL_NUM2 THEN 1 \
										WHEN AML_TOTAL_NUM <> AML_TOTAL_NUM2 THEN 2 \
										ELSE NULL END \
										FROM ( \
											SELECT AML_SEQ, AML_TOTAL_NUM, SUM(AML_DELIVERY_NUM) AS 'AML_TOTAL_NUM2' \
											FROM APACCS_MASTER_LIST \
											WHERE AML_TOTAL_NUM IS NOT NULL \
											GROUP BY AML_SEQ, AML_TOTAL_NUM \
										) APACCS_MASTER_LIST \
										WHERE AML_SEQ = OL_SEQ \
									) AS 'AML_DELIVERY_COMPLETE' \
							FROM ORDER_LIST \
							/*報機單*/ \
							LEFT JOIN V_ORDER_EDITOR_BY_R W2_OE ON W2_OE.OE_SEQ = ORDER_LIST.OL_SEQ \
							/*銷艙單只有完成時間*/ \
							LEFT JOIN V_ORDER_EDITOR_BY_W W3_OE ON W3_OE.OE_SEQ = ORDER_LIST.OL_SEQ \
							/*派送單*/ \
							LEFT JOIN V_ORDER_EDITOR_BY_D W1_OE ON W1_OE.OE_SEQ = ORDER_LIST.OL_SEQ \
							/*航班資訊*/ \
							LEFT JOIN FLIGHT_ARRIVAL ON FA_AIR_LINEID + ' ' + REPLICATE('0',4-LEN(FA_FLIGHTNUM)) + RTRIM(CAST(FA_FLIGHTNUM AS CHAR)) = ORDER_LIST.OL_FLIGHTNO AND FA_FLIGHTDATE = ORDER_LIST.OL_IMPORTDT ";
							
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

			_SQLCommand += " WHERE OL_FDATETIME IS NULL \
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