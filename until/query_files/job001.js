module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectItemList":
			_SQLCommand += "SELECT * \
							FROM ITEM_LIST \
							WHERE 1=1";
							
			if(pParams["IL_SEQ"] !== undefined){
				_SQLCommand += " AND IL_SEQ = @IL_SEQ";
			}
		
			break;
	}

	return _SQLCommand;
};