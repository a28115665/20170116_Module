module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectCns":
			_SQLCommand += "SELECT O_CUST_INFO.CI_ID, \
								O_CUST_INFO.CI_NAME, \
								SUM(CNS_QUERY_SEQ.QU_TOTAL_COUNT) AS QU_TOTAL_COUNT, \
								SUM(CNS_QUERY_SEQ.QU_REPEAT_COUNT) AS QU_REPEAT_COUNT, \
								SUM(CNS_QUERY_SEQ.QU_TRADEVAN_COUNT) AS QU_TRADEVAN_COUNT \
							FROM CNS_QUERY_SEQ \
							INNER JOIN O_CUST_INFO ON O_CUST_INFO.CI_ID = CNS_QUERY_SEQ.CI_ID \
							WHERE O_CUST_INFO.CI_ID != 'Admin'  \
							AND O_CUST_INFO.CI_STS = 0 \
							AND QU_SOURCE = 'CNS'";

			if(pParams["CUSTINFO_QUERY_FROM"] !== undefined){
				_SQLCommand += " AND MODIFY_DT >= '" + pParams["CUSTINFO_QUERY_FROM"] + "'";
			}
			if(pParams["CUSTINFO_QUERY_TOXX"] !== undefined){
				_SQLCommand += " AND MODIFY_DT <= '" + pParams["CUSTINFO_QUERY_TOXX"] + "'";
			}		

			_SQLCommand += " GROUP BY O_CUST_INFO.CI_ID, O_CUST_INFO.CI_NAME \
							 ORDER BY O_CUST_INFO.CI_ID";
			break;
	}

	return _SQLCommand;
};