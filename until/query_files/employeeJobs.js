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
									OL_CR_DATETIME, \
									( \
										SELECT COUNT(1) \
										FROM ( \
											SELECT IL_BAGNO \
											FROM ITEM_LIST \
											WHERE IL_SEQ = OL_SEQ \
											AND IL_BAGNO IS NOT NULL AND IL_BAGNO != '' \
											GROUP BY IL_BAGNO \
										) A \
									) AS 'OL_COUNT', \
									W2_OE.OE_PRINCIPAL AS 'W2_PRINCIPAL', \
									W2_OE.OE_EDATETIME AS 'W2_EDATETIME', \
									W2_OE.OE_FDATETIME AS 'W2_FDATETIME', \
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
										WHEN \
											/*表示已有完成者，但非作業員*/ \
											W2_OE.OE_PRINCIPAL IS NOT NULL THEN '4' \
										/*表示尚未派單*/ \
										ELSE '0' END \
									) AS 'W2_STATUS', \
									W3_OE.OE_PRINCIPAL AS 'W3_PRINCIPAL', \
									W3_OE.OE_EDATETIME AS 'W3_EDATETIME', \
									W3_OE.OE_FDATETIME AS 'W3_FDATETIME', \
									W1_OE.OE_PRINCIPAL AS 'W1_PRINCIPAL', \
									W1_OE.OE_EDATETIME AS 'W1_EDATETIME', \
									W1_OE.OE_FDATETIME AS 'W1_FDATETIME', \
									FA_SCHEDL_ARRIVALTIME, \
									FA_ACTL_ARRIVALTIME, \
									FA_ARRIVAL_REMK \
							FROM ORDER_LIST \
							/*報機單*/ \
							LEFT JOIN ORDER_EDITOR W2_OE ON W2_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W2_OE.OE_TYPE = 'R' AND (W2_OE.OE_EDATETIME IS NOT NULL OR W2_OE.OE_FDATETIME IS NOT NULL) \
							/*銷艙單只有完成時間*/ \
							LEFT JOIN ORDER_EDITOR W3_OE ON W3_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W3_OE.OE_TYPE = 'W' AND W3_OE.OE_FDATETIME IS NOT NULL \
							/*派送單*/ \
							LEFT JOIN ORDER_EDITOR W1_OE ON W1_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W1_OE.OE_TYPE = 'D' AND (W1_OE.OE_EDATETIME IS NOT NULL OR W1_OE.OE_FDATETIME IS NOT NULL) \
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
									) ORDER_PRINPL ON OP_SEQ = ORDER_LIST.OL_SEQ ";
				}
			}

			_SQLCommand += " WHERE OL_FDATETIME IS NULL \
							 ORDER BY CASE WHEN FA_SCHEDL_ARRIVALTIME IS NULL THEN 1 ELSE 0 END, FA_SCHEDL_ARRIVALTIME ";
		
			break;
		case "SelectOrderEditor":
			_SQLCommand += "SELECT * \
							FROM ORDER_EDITOR \
							WHERE 1=1 ";

			if(pParams["OE_SEQ"] !== undefined){
				_SQLCommand += " AND OE_SEQ = @OE_SEQ ";
			}
			if(pParams["OE_TYPE"] !== undefined){
				_SQLCommand += " AND OE_TYPE = @OE_TYPE ";
			}

			break;
	}

	return _SQLCommand;
};