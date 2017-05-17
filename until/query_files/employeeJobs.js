module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectOrderList":
			_SQLCommand += "SELECT OL_SEQ, \
								   OL_CO_CODE, \
								   OL_MASTER, \
								   OL_FLIGHTNO, \
								   OL_IMPORTDT, \
								   OL_COUNTRY, \
								   OL_CR_USER, \
								   OL_W2_PRINCIPAL AS 'W2', \
								   OL_W2_EDIT_DATETIME, \
								   OL_W2_OK_DATETIME, \
								   OL_W3_PRINCIPAL AS 'W3', \
								   OL_W3_EDIT_DATETIME, \
								   OL_W3_OK_DATETIME, \
								   OL_W1_PRINCIPAL AS 'W1', \
								   OL_W1_EDIT_DATETIME, \
								   OL_W1_OK_DATETIME, \
								   ( \
										SELECT COUNT(1) \
										FROM ITEM_LIST \
										WHERE IL_SEQ = OL_SEQ \
									) AS 'OL_COUNT' \
							FROM ORDER_LIST \
							WHERE 1=1 ";
							
			if(pParams["DEPTS"] !== undefined && pParams["U_ID"] !== undefined){
				var _Content = [],
					// 早中晚班的Level
					_Lvl = 4,
					// 如果小於早中晚班的部門層級都可以看到資料
					_isSupervisor = false;

				for(var i in pParams["DEPTS"]){
					if(pParams["DEPTS"][i].SUD_DLVL < _Lvl){
						_isSupervisor = true;
					}
					_Content.push("OL_"+pParams["DEPTS"][i].SUD_DEPT+"_PRINCIPAL = '" + pParams["U_ID"] + "'");
				}

				// 不是主管則組SQL
				if(!_isSupervisor){
					_SQLCommand += " AND ( "+_Content.join(" OR ")+" ) ";
				}

				// 避免PrepareStatement載入非DB裡的Schema
				delete pParams["DEPTS"];
			}

			_SQLCommand += " ORDER BY OL_CR_DATETIME DESC ";
		
			break;
	}

	return _SQLCommand;
};