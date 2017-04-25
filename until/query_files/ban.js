module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectBLFL":
			_SQLCommand += "SELECT * \
						    FROM BLACK_LIST_FROM_LEADER \
						    WHERE 1=1 ";
			if(pParams["UG_GROUP"] !== undefined){
				_SQLCommand += " AND UG_GROUP = @UG_GROUP ";
			}
			_SQLCommand += " ORDER BY BLFL_CR_DATETIME DESC ";
			break;
	}

	return _SQLCommand;
};