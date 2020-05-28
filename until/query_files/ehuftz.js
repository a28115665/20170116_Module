module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectUnfinishedMaster":
			_SQLCommand += "SELECT OL_SEQ, \
								OL_MASTER, \
								( \
									SELECT TOP 1 SUBSTRING(IL_BAGNO, 1, 3) \
									FROM ITEM_LIST \
									WHERE IL_SEQ = OL_SEQ \
									AND IL_BAGNO <> '' \
									ORDER BY IL_BAGNO ASC \
								) AS IL_BAGNO \
							FROM ORDER_LIST \
							WHERE OL_FDATETIME2 IS NULL \
							AND OL_MASTER IS NOT NULL \
							AND OL_MASTER <> '' \
							UNION \
							SELECT OL_SEQ, \
								OL_MASTER, \
								( \
									SELECT TOP 1 SUBSTRING(IL_BAGNO, 1, 3) \
									FROM ITEM_LIST \
									WHERE IL_SEQ = OL_SEQ \
									AND IL_BAGNO <> '' \
									ORDER BY IL_BAGNO DESC  \
								) AS IL_BAGNO \
							FROM ORDER_LIST \
							WHERE OL_FDATETIME2 IS NULL \
							AND OL_MASTER IS NOT NULL \
							AND OL_MASTER <> '' ";
		break;
	}

	return _SQLCommand;
};