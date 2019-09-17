module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		// case "SelectCustInfo":
		// 	_SQLCommand += "EXEC OpenKeys;";
		// 	_SQLCommand += "SELECT CI_ID, \
		// 						   CI_COMPY, \
		// 						   CI_NAME, \
		// 						   dbo.Decrypt(CI_PW) AS 'CI_PW', \
		// 						   CI_STS \
		// 					FROM CUST_INFO \
		// 					ORDER BY CI_CR_DATETIME DESC";
		
		// 	break;
		// case "SelectCompyInfo":
		// 	_SQLCommand += "SELECT CO_ID, \
		// 						   CO_CODE, \
		// 						   CO_NUMBER, \
		// 						   CO_NAME, \
		// 						   CO_ADDR, \
		// 						   CO_STS, \
		// 						   CO_WEIGHTS, \
		// 						   CO_AREA \
		// 					FROM COMPY_INFO \
		// 					WHERE 1=1 ";
							
		// 	if(pParams["CO_STS"] !== undefined){
		// 		_SQLCommand += " AND CO_STS = @CO_STS";
		// 	}
		// 	_SQLCommand += " ORDER BY CO_CR_DATETIME DESC ";
		// 	break;
		case "SelectOCompyInfo2":
			_SQLCommand += "SELECT O_CO_ID, \
								   O_CO_CODE, \
								   O_CO_NUMBER, \
								   O_CO_NAME, \
								   O_CO_ADDR, \
								   O_CO_STS, \
								   O_CO_WEIGHTS, \
								   O_CO_AREA \
							FROM O_COMPY_INFO \
							WHERE 1=1 ";
							
			if(pParams["O_CO_STS"] !== undefined){
				_SQLCommand += " AND O_CO_STS = @O_CO_STS";
			}
			_SQLCommand += " ORDER BY O_CO_CODE ASC ";
			break;
		// case "SelectMaxCompy":
		// 	_SQLCommand += "SELECT TOP 1 CO_ID+1 AS 'CO_ID' \
		// 					FROM COMPY_INFO \
		// 					ORDER BY CO_ID DESC ";
							
		// 	break;
	}

	return _SQLCommand;
};