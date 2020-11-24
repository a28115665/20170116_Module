module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectCns":
			_SQLCommand += "SELECT CUST_INFO.CI_ID, \
								CUST_INFO.CI_NAME, \
								SUM(CNS_QUERY_SEQ.QU_TOTAL_COUNT) AS QU_TOTAL_COUNT, \
								SUM(CNS_QUERY_SEQ.QU_REPEAT_COUNT) AS QU_REPEAT_COUNT, \
								SUM(CNS_QUERY_SEQ.QU_TRADEVAN_COUNT) AS QU_TRADEVAN_COUNT \
							FROM CNS_QUERY_SEQ \
							INNER JOIN CUST_INFO ON CUST_INFO.CI_ID = CNS_QUERY_SEQ.CI_ID \
							WHERE CUST_INFO.CI_ID != 'Admin'  \
							AND CUST_INFO.CI_STS = 0 \
							AND QU_SOURCE = 'CNS'";

			if(pParams["CUSTINFO_QUERY_FROM"] !== undefined){
				_SQLCommand += " AND MODIFY_DT >= '" + pParams["CUSTINFO_QUERY_FROM"] + "'";
			}
			if(pParams["CUSTINFO_QUERY_TOXX"] !== undefined){
				_SQLCommand += " AND MODIFY_DT <= '" + pParams["CUSTINFO_QUERY_TOXX"] + "'";
			}		

			_SQLCommand += " GROUP BY CUST_INFO.CI_ID, CUST_INFO.CI_NAME \
							 ORDER BY CUST_INFO.CI_ID";
			break;
		case "SelectCnsDetail":
			_SQLCommand += "SELECT TOP 3000 QU_SEQ, \
								Name, \
								ID, \
								Tel, \
								result1, \
								result2, \
								result3 \
							FROM CNS_QUERY_LIST \
							WHERE QU_SEQ IN ( \
								SELECT QU_SEQ \
								FROM CNS_QUERY_SEQ \
								WHERE QU_SOURCE = 'CNS' \
								AND CI_ID = @CI_ID \
								AND MODIFY_DT >= '" + pParams["CUSTINFO_QUERY_FROM"] + "' \
								AND MODIFY_DT <= '" + pParams["CUSTINFO_QUERY_TOXX"] + "' \
							)";
			break;
	}

	return _SQLCommand;
};