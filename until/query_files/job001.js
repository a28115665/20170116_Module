module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectItemList":
			_SQLCommand += "SELECT BLFO.BLFO_TRACK, \
								   IL.* \
							FROM ITEM_LIST IL \
							LEFT JOIN BLACK_LIST_FROM_OP BLFO ON \
							IL.IL_SEQ = BLFO.BLFO_SEQ AND \
							IL.IL_NEWBAGNO = BLFO.BLFO_NEWBAGNO AND \
							IL.IL_NEWSMALLNO = BLFO.BLFO_NEWSMALLNO AND \
							IL.IL_ORDERINDEX = BLFO.BLFO_ORDERINDEX \
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