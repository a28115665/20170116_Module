module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectItemList":
			_SQLCommand += "SELECT BLFO_TRACK, \
									CASE WHEN PG_SEQ IS NULL THEN 0 ELSE 1 END AS 'PG_PULLGOODS', \
									CASE WHEN SPG_SEQ IS NULL THEN 0 ELSE 1 END AS 'SPG_SPECIALGOODS', \
									PG_MOVED, \
									ITEM_LIST.* \
							FROM ITEM_LIST \
							LEFT JOIN BLACK_LIST_FROM_OP ON \
							IL_SEQ = BLFO_SEQ AND \
							IL_NEWBAGNO = BLFO_NEWBAGNO AND \
							IL_NEWSMALLNO = BLFO_NEWSMALLNO AND \
							IL_ORDERINDEX = BLFO_ORDERINDEX \
							LEFT JOIN PULL_GOODS ON \
							IL_SEQ = PG_SEQ AND \
							IL_BAGNO = PG_BAGNO \
							LEFT JOIN SPECIAL_GOODS ON \
							IL_SEQ = SPG_SEQ AND \
							IL_NEWBAGNO = SPG_NEWBAGNO AND \
							IL_NEWSMALLNO = SPG_NEWSMALLNO AND \
							IL_ORDERINDEX = SPG_ORDERINDEX \
							WHERE 1=1";
							
			if(pParams["IL_SEQ"] !== undefined){
				_SQLCommand += " AND IL_SEQ = @IL_SEQ";
			}
		
			break;
		case "SelectRepeatName":
			_SQLCommand += "SELECT ITEM_LIST.* \
							FROM ITEM_LIST \
							JOIN ( \
								SELECT IL_GETNAME \
								FROM ITEM_LIST \
								WHERE IL_SEQ = @IL_SEQ \
								GROUP BY IL_GETNAME \
								HAVING COUNT(*) > 1 \
							) REPEAT_NAME ON REPEAT_NAME.IL_GETNAME = ITEM_LIST.IL_GETNAME \
							WHERE ITEM_LIST.IL_SEQ = @IL_SEQ";
			break;
	}

	return _SQLCommand;
};