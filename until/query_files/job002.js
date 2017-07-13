module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectFlightItemList":
			_SQLCommand += "SELECT *, \
								   CASE WHEN DI.IL_BAGNO IS NULL THEN 0 ELSE 1 END AS BAGNO_MATCH, \
							FROM FLIGHT_ITEM_LIST \
							LEFT JOIN ( \
								SELECT DISTINCT(IL_BAGNO) \
								FROM ITEM_LIST \
								WHERE IL_SEQ = @FLL_SEQ \
								AND IL_BAGNO != '' \
							) DI ON IL_BAGNO = FLL_BAGNO \
							WHERE 1=1 AND FLL_SEQ = @FLL_SEQ \
							ORDER BY cast(FLL_ITEM as int) ASC";

			break;
	}

	return _SQLCommand;
};