module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectOrderList":
			_SQLCommand += "SELECT OL_SEQ, \
								   OL_CO_CODE, \
								   OL_MASTER, \
								   OL_FLIGHTNO, \
								   OL_IMPORTDT, \
								   OL_COUNTRY \
							FROM ORDER_LIST \
							ORDER BY OL_CR_DATETIME DESC";
		
			break;
		case "WhoPrincipal":
			_SQLCommand += "SELECT CO_NAME, \
								   COD_CODE, \
								   COD_PRINCIPAL, \
								   DL_IS_LEAVE, \
								   AS_AGENT, \
								   AS_IS_LEAVE, \
								   CASE WHEN DL_IS_LEAVE = 0 THEN COD_PRINCIPAL \
								   WHEN AS_IS_LEAVE = 0 THEN AS_AGENT \
								   ELSE NULL END AS 'WHO_PRINCIPAL' \
							FROM ( \
								/*負責人是否有請假*/ \
								SELECT CO_NAME, \
									   COD_CODE, \
									   COD_PRINCIPAL, \
									   CASE WHEN DL_ID IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS 'DL_IS_LEAVE', \
									   A.AS_AGENT, \
									   A.AS_IS_LEAVE \
								FROM COMPY_DISTRIBUTION \
								LEFT JOIN DAILY_LEAVE ON DL_ID = COD_PRINCIPAL \
								LEFT JOIN COMPY_INFO ON COD_CODE = CO_CODE \
								LEFT JOIN ( \
									/*代理人是否有請假*/ \
									SELECT AS_CODE, \
										   AS_AGENT, \
										   CASE WHEN DL_ID IS NOT NULL THEN CAST(1 AS BIT) ELSE CAST(0 AS BIT) END AS 'AS_IS_LEAVE' \
									FROM AGENT_SETTING \
									LEFT JOIN DAILY_LEAVE ON DL_ID = AS_AGENT AND AS_DEPT = @AS_DEPT \
								) A ON COD_CODE = A.AS_CODE \
								WHERE COD_DEPT = @AS_DEPT \
							) B"; 
			break;
	}

	return _SQLCommand;
};