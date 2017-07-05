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
		case "SelectMailAccount":

			_SQLCommand += "EXEC OpenKeys;";
			_SQLCommand += "SELECT MA_USER, \
								   dbo.Decrypt(MA_PASS) AS 'MA_PASS' \
							FROM MAIL_ACCOUNT \
							WHERE MA_STS = 0 ";

			if(pParams["MA_USER"] !== undefined){
				_SQLCommand += " AND MA_USER = @MA_USER";
			}
							
			break;
	}

	return _SQLCommand;
};