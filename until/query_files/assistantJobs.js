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
	}

	return _SQLCommand;
};