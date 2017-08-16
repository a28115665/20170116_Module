module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectFMAF":

			_SQLCommand += "SELECT FMAF_ID, \
								   FMAF_O_FILENAME, \
								   FMAF_R_FILENAME, \
								   FMAF_FILESIZE, \
								   FMAF_FILEPATH \
							FROM FLIGHT_MAIL_ATTACHED_FILE \
							WHERE FMAF_SOFT_DELETE = 0";

			if(pParams["FMAF_CR_USER"] !== undefined){
				_SQLCommand += " AND FMAF_CR_USER = @FMAF_CR_USER ";
			}
			if(pParams["FMAF_CR_DATETIME"] !== undefined){
				_SQLCommand += " AND FMAF_CR_DATETIME = @FMAF_CR_DATETIME ";
			}
							
			break;
	}

	return _SQLCommand;
};