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
							LEFT JOIN AGENT_SETTING ON COD.COD_CODE = AS_CODE  \
							WHERE 1=1 ";
											
			if(pParams["COD_CR_USER"] !== undefined){
				_SQLCommand += " AND COD.COD_CR_USER = @COD_CR_USER";
			}

			_SQLCommand += " ORDER BY COD_CR_DATETIME DESC, COD_PRINCIPAL ASC ";

			break;

		case "SelectUserInfoByCompyDistribution":
			_SQLCommand += "SELECT DISTINCT COD_PRINCIPAL, \
								   U_NAME \
							FROM COMPY_DISTRIBUTION \
							LEFT JOIN USER_INFO ON U_ID = COD_PRINCIPAL  \
							WHERE 1=1 ";
											
			if(pParams["COD_CR_USER"] !== undefined){
				_SQLCommand += " AND COD_CR_USER = @COD_CR_USER";
			}

			break;
	}

	return _SQLCommand;
};