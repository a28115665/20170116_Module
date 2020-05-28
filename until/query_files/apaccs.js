module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectUnfinishedMaster":
			_SQLCommand += "SELECT OL_SEQ, \
								OL_MASTER \
							FROM ORDER_LIST \
							WHERE OL_FDATETIME2 IS NULL \
							AND OL_MASTER IS NOT NULL\
							AND OL_MASTER <> '' \
							ORDER BY OL_CR_DATETIME DESC";
		break;
	}

	return _SQLCommand;
};