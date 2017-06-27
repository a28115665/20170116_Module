module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectFlightMail":

			_SQLCommand += "SELECT FM_ID, \
								   FM_TARGET, \
								   FM_MAIL, \
								   FM_TITLE, \
								   FM_CONTENT \
							FROM FLIGHT_MAIL \
							ORDER BY FM_ID DESC ";
							
			break;
	}

	return _SQLCommand;
};