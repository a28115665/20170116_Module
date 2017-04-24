module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectFlightItemList":
			_SQLCommand += "SELECT * \
							FROM FLIGHT_ITEM_LIST \
							WHERE 1=1";
							
			if(pParams["FLL_SEQ"] !== undefined){
				_SQLCommand += " AND FLL_SEQ = @FLL_SEQ";
			}
		
			break;
	}

	return _SQLCommand;
};