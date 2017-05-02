module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectCompy":
			_SQLCommand += "SELECT CO.CO_CODE, \
								   CO.CO_NUMBER, \
								   CO.CO_NAME, \
								   CO.CO_ADDR, \
								   COD.COD_PRINCIPAL \
							FROM COMPY_INFO CO \
							LEFT JOIN COMPY_DISTRIBUTION COD ON COD.COD_CODE = CO.CO_CODE \
							WHERE CO_STS = 0 \
							ORDER BY CO_CR_DATETIME DESC ";

			break;
		case "SelectUserbyGrade":
			_SQLCommand += "SELECT DISTINCT U.U_ID, \
								   U.U_NAME, \
								   U.U_GRADE \
							FROM USER_DEPT UD \
							JOIN USER_INFO U ON U.U_ID = UD.UD_ID \
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

			_SQLCommand += " GROUP BY U.U_ID, U.U_NAME, U.U_GRADE ";

			break;
	}

	return _SQLCommand;
};