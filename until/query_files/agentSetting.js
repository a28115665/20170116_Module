module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectCompyAgent":
			_SQLCommand += "SELECT COD.COD_PRINCIPAL, \
								   COD.COD_CODE, \
								   CO.CO_NAME, \
								   AS_AGENT \
							FROM COMPY_DISTRIBUTION COD \
							LEFT JOIN COMPY_INFO CO ON COD.COD_CODE = CO.CO_CODE \
							LEFT JOIN AGENT_SETTING ON COD.COD_CODE = AS_CODE  ";

			if(pParams["COD_DEPT"] !== undefined){
				_SQLCommand += " AND AS_DEPT = @COD_DEPT ";
			}

			_SQLCommand += "WHERE 1=1 ";
											
			if(pParams["COD_CR_USER"] !== undefined){
				_SQLCommand += " AND COD.COD_CR_USER = @COD_CR_USER";
			}
			if(pParams["COD_DEPT"] !== undefined){
				_SQLCommand += " AND COD.COD_DEPT = @COD_DEPT";
			}

			_SQLCommand += " ORDER BY COD_CR_DATETIME DESC, COD_PRINCIPAL ASC ";

			break;

		case "SelectUserInfoByCompyDistribution":
			_SQLCommand += "SELECT COD_PRINCIPAL, \
								   U_NAME, \
								   COD_DEPT, \
								   SUD_NAME \
							FROM COMPY_DISTRIBUTION \
							JOIN SYS_USER_DEPT ON SUD_DEPT = COD_DEPT \
							LEFT JOIN USER_INFO ON U_ID = COD_PRINCIPAL \
							WHERE 1=1 ";
											
			if(pParams["COD_CR_USER"] !== undefined){
				_SQLCommand += " AND COD_CR_USER = @COD_CR_USER";
			}
			if(pParams["COD_DEPT"] !== undefined){
				_SQLCommand += " AND COD_DEPT = @COD_DEPT";
			}

			break;
	}

	return _SQLCommand;
};