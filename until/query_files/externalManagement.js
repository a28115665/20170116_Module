module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectCustInfo":
			_SQLCommand += "EXEC OpenKeys;";
			_SQLCommand += "SELECT CI_ID, \
								   CI_COMPY, \
								   CI_NAME, \
								   dbo.Decrypt(CI_PW) AS 'CI_PW', \
								   CI_STS \
							FROM CUST_INFO \
							ORDER BY CI_CR_DATETIME DESC";
		
			break;
		case "SelectCompyInfo":
			_SQLCommand += "SELECT CO_CODE, \
								   CO_NUMBER, \
								   CO_NAME, \
								   CO_ADDR, \
								   CO_STS \
							FROM COMPY_INFO \
							WHERE 1=1 ";
							
			if(pParams["CO_STS"] !== undefined){
				_SQLCommand += " AND CO_STS = @CO_STS";
			}
			_SQLCommand += " ORDER BY CO_CR_DATETIME DESC ";
			break;
	}

	return _SQLCommand;
};