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
								   PG_FLIGHTNO \
							FROM ORDER_LIST \
							JOIN PULL_GOODS ON \
							PG_SEQ = OL_SEQ \
						    WHERE 1=1"

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
									W1_OE.OE_FDATETIME AS 'W1_FDATETIME' \
							FROM ORDER_LIST \
							/*報機單*/ \
							LEFT JOIN ORDER_EDITOR W2_OE ON W2_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W2_OE.OE_TYPE = 'R' AND (W2_OE.OE_EDATETIME IS NOT NULL OR W2_OE.OE_FDATETIME IS NOT NULL) \
							/*銷艙單只有完成時間*/ \
							LEFT JOIN ORDER_EDITOR W3_OE ON W3_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W3_OE.OE_TYPE = 'W' AND W3_OE.OE_FDATETIME IS NOT NULL \
							/*派送單*/ \
							LEFT JOIN ORDER_EDITOR W1_OE ON W1_OE.OE_SEQ = ORDER_LIST.OL_SEQ AND W1_OE.OE_TYPE = 'D' AND (W1_OE.OE_EDATETIME IS NOT NULL OR W1_OE.OE_FDATETIME IS NOT NULL) ";
							
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

			_SQLCommand += " ORDER BY OL_CR_DATETIME DESC ";
	}

	return _SQLCommand;
};