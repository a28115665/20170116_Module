module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectBLFL":
			_SQLCommand += "SELECT * \
						    FROM BLACK_LIST_FROM_LEADER \
						    WHERE 1=1 ";

			_SQLCommand += " ORDER BY BLFL_CR_DATETIME DESC ";
			break;
		case "SelectBLFO":
			_SQLCommand += "SELECT * \
						    FROM BLACK_LIST_FROM_OP \
						    WHERE 1=1 ";

			_SQLCommand += " ORDER BY BLFO_CR_DATETIME DESC ";
			break;
	}

	return _SQLCommand;
};