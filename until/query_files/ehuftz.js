module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectUnfinishedMaster":
			_SQLCommand += "SELECT OL_SEQ, \
								OL_MASTER, \
								( \
									SELECT TOP 1 IL_BAGNO \
									FROM ITEM_LIST \
									WHERE IL_SEQ = OL_SEQ \
									AND IL_BAGNO <> '' \
								) AS IL_BAGNO \
							FROM ORDER_LIST \
							WHERE OL_FDATETIME IS NULL \
							AND OL_MASTER IS NOT NULL\
							AND OL_MASTER <> '' \
							ORDER BY OL_CR_DATETIME DESC";
		break;
	}

	return _SQLCommand;
};