module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectUserLeavebyGrade":
			_SQLCommand += "SELECT DISTINCT U.U_ID, \
								   U.U_NAME, \
								   U.U_GRADE, \
								   CASE WHEN DL.DL_ID IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS 'DL_IS_LEAVE' \
							FROM USER_DEPT UD \
							JOIN USER_INFO U ON U.U_ID = UD.UD_ID \
							LEFT JOIN DAILY_LEAVE DL ON DL.DL_ID = UD.UD_ID \
							WHERE U.U_STS = 0 ";
							
			if(pParams["U_ID"] !== undefined){
				_SQLCommand += " AND UD_DEPT IN ( \
									SELECT UD_DEPT \
									FROM USER_DEPT \
									WHERE UD_ID = @U_ID \
								) ";
			}							
			if(pParams["U_GRADE"] !== undefined){
				_SQLCommand += " AND U_GRADE > @U_GRADE";
			}

			_SQLCommand += " GROUP BY U.U_ID, U.U_NAME, U.U_GRADE, DL.DL_ID ";

			break;
	}

	return _SQLCommand;
};