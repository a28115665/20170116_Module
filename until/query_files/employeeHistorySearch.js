module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectSearch":
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
											GROUP BY IL_BAGNO \
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
									CONVERT(varchar, OL_IMPORTDT, 23 ) AS 'OL_IMPORTDT_EX', \
									CO_NAME \
							FROM ( \
								SELECT * \
								FROM ORDER_LIST \
								/*行家中文名稱*/ \
								OUTTER JOIN COMPY_INFO ON CO_CODE = OL_CO_CODE \
							) ORDER_LIST \
							LEFT JOIN ITEM_LIST ON IL_SEQ = OL_SEQ \
							/*報機單*/ \
							LEFT JOIN ORDER_EDITOR W2_OE ON W2_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W2_OE.OE_TYPE = 'R' AND (W2_OE.OE_EDATETIME IS NOT NULL OR W2_OE.OE_FDATETIME IS NOT NULL) \
							/*銷艙單只有完成時間*/ \
							LEFT JOIN ORDER_EDITOR W3_OE ON W3_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W3_OE.OE_TYPE = 'W' AND W3_OE.OE_FDATETIME IS NOT NULL \
							/*派送單*/ \
							LEFT JOIN ORDER_EDITOR W1_OE ON W1_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W1_OE.OE_TYPE = 'D' AND (W1_OE.OE_EDATETIME IS NOT NULL OR W1_OE.OE_FDATETIME IS NOT NULL) \
							WHERE 1=1 ";
						
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
					_SQLCommand += " AND OL_FDATETIME IS NOT NULL";
				}else{
					_SQLCommand += " AND OL_FDATETIME IS NULL";
				}
				delete pParams["FINISH"];
			}

			if(pParams["BAGNO"] !== undefined){
				_SQLCommand += " AND IL_BAGNO = '" + pParams["BAGNO"] + "'";
				delete pParams["BAGNO"];
			}
			if(pParams["BAGNO_LAST5"] !== undefined){
				_SQLCommand += " AND IL_BAGNO LIKE '%" + pParams["BAGNO_LAST5"] + "'";
				delete pParams["BAGNO_LAST5"];
			}
			if(pParams["BAGNO_RANGE5"] !== undefined && pParams["BAGNO_RANGE3_START"] !== undefined && pParams["BAGNO_RANGE3_END"] !== undefined){
				var _bagnoStart = pParams["BAGNO_RANGE5"] + pParams["BAGNO_RANGE3_START"],
					_bagnoEnd = pParams["BAGNO_RANGE5"] + pParams["BAGNO_RANGE3_END"];

				_SQLCommand += " AND IL_BAGNO BETWEEN '" + _bagnoStart + "' AND '" + _bagnoEnd + "'";
				
				delete pParams["BAGNO_RANGE5"];
				delete pParams["BAGNO_RANGE3_START"];
				delete pParams["BAGNO_RANGE3_END"];
			}
			if(pParams["GETNAME"] !== undefined){
				pParams["IL_GETNAME"] = '%'+pParams["GETNAME"]+'%';
				_SQLCommand += " AND IL_GETNAME LIKE @IL_GETNAME";
				delete pParams["GETNAME"];
				
			}
			if(pParams["GETADDRESS"] !== undefined){
				pParams["IL_GETADDRESS"] = '%'+pParams["GETADDRESS"]+'%';
				_SQLCommand += " AND IL_GETADDRESS LIKE @IL_GETADDRESS";
				delete pParams["GETADDRESS"];
				
			}
			if(pParams["GETTEL"] !== undefined){
				pParams["IL_GETTEL"] = pParams["GETTEL"];
				_SQLCommand += " AND IL_GETTEL = @IL_GETTEL";
				delete pParams["GETTEL"];
			}
			if(pParams["NATURE"] !== undefined){
				pParams["IL_NATURE"] = '%'+pParams["NATURE"]+'%';
				_SQLCommand += " AND IL_NATURE LIKE @IL_NATURE";
				delete pParams["NATURE"];
			}

			_SQLCommand += " GROUP BY OL_SEQ, \
									 OL_CO_CODE, \
									 OL_MASTER, \
									 OL_FLIGHTNO, \
									 OL_IMPORTDT, \
									 OL_COUNTRY, \
									 OL_CR_USER, \
									 OL_CR_DATETIME, \
									 W2_OE.OE_PRINCIPAL, \
									 W2_OE.OE_EDATETIME, \
									 W2_OE.OE_FDATETIME, \
									 W3_OE.OE_PRINCIPAL, \
									 W3_OE.OE_EDATETIME, \
									 W3_OE.OE_FDATETIME, \
									 W1_OE.OE_PRINCIPAL, \
									 W1_OE.OE_EDATETIME, \
									 W1_OE.OE_FDATETIME, \
									 CO_NAME \
							ORDER BY OL_CR_DATETIME DESC ";
			break;
	}

	return _SQLCommand;
};