module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectPullGoods":
			_SQLCommand += "SELECT OL_CO_CODE, \
								   OL_MASTER, \
								   OL_FLIGHTNO, \
								   OL_IMPORTDT, \
								   OL_COUNTRY, \
								   PG_SEQ, \
								   PG_BAGNO, \
								   PG_MOVED, \
								   PG_MASTER, \
								   PG_FLIGHTNO, \
								   PG_REASON, \
								   CONVERT(varchar, OL_IMPORTDT, 23 ) AS 'OL_IMPORTDT_EX', \
								   CO_NAME \
							FROM ( \
								SELECT * \
								FROM ORDER_LIST \
								OUTTER JOIN COMPY_INFO ON CO_CODE = OL_CO_CODE \
							) ORDER_LIST \
							JOIN PULL_GOODS ON \
							PG_SEQ = OL_SEQ \
						    WHERE 1=1";
							
			if(pParams["Seq"] !== undefined){
				_SQLCommand += " AND PG_SEQ IN ("+pParams["Seq"]+") ";
				delete pParams["Seq"];
			}
							
			if(pParams["Bagno"] !== undefined){
				_SQLCommand += " AND PG_BAGNO IN ("+pParams["Bagno"]+") ";
				delete pParams["Bagno"];
			}

			break;

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
											SELECT FLL_BAGNO \
											FROM FLIGHT_ITEM_LIST \
											WHERE FLL_SEQ = OL_SEQ \
											AND FLL_BAGNO IS NOT NULL AND FLL_BAGNO != '' \
											GROUP BY FLL_BAGNO \
										) A \
									) AS 'OL_COUNT', \
									W2_OE.OE_PRINCIPAL AS 'W2_PRINCIPAL', \
									W2_OE.OE_EDATETIME AS 'W2_EDATETIME', \
									W2_OE.OE_FDATETIME AS 'W2_FDATETIME', \
									W3_OE.OE_PRINCIPAL AS 'W3_PRINCIPAL', \
									W3_OE.OE_EDATETIME AS 'W3_EDATETIME', \
									W3_OE.OE_FDATETIME AS 'W3_FDATETIME', \
									W1_OE.OE_PRINCIPAL AS 'W1_PRINCIPAL', \
									W1_OE.OE_EDATETIME AS 'W1_EDATETIME', \
									W1_OE.OE_FDATETIME AS 'W1_FDATETIME', \
									FA_SCHEDL_ARRIVALTIME, \
									FA_ACTL_DEPARTTIME, \
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
							 AND ( SELECT COUNT(1) \
								FROM ( \
									SELECT FLL_BAGNO \
									FROM FLIGHT_ITEM_LIST \
									WHERE FLL_SEQ = OL_SEQ \
									AND FLL_BAGNO IS NOT NULL AND FLL_BAGNO != '' \
									GROUP BY FLL_BAGNO \
								) A ) > 0 \
							 ORDER BY CASE WHEN FA_SCHEDL_ARRIVALTIME IS NULL THEN 1 ELSE 0 END, FA_SCHEDL_ARRIVALTIME ";

			break;

		case "SelectMasterToBeFilled":
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
									) AS 'OL_COUNT' \
							FROM ORDER_LIST ";
							
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
							 AND OL_MASTER IN ('', NULL) ";

			break;

		case "SelectFlightArrival":
			_SQLCommand += "SELECT * \
							FROM FLIGHT_ARRIVAL \
						    WHERE 1=1";

			if(pParams["FA_FLIGHTDATE"] !== undefined){
				_SQLCommand += " AND FA_FLIGHTDATE = @FA_FLIGHTDATE ";
			}

			_SQLCommand += " ORDER BY FA_SCHEDL_ARRIVALTIME ";

			break;
	}

	return _SQLCommand;
};