module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectImd":
			_SQLCommand += "SELECT O_IL_SEQ, \
								O_IL_NEWSMALLNO, \
								O_IL_SMALLNO, \
								DeclarationNumber, \
								DeclarationType, \
								IntoWarehouseTotalWeight, \
								WarehouseRental, \
								MainNumber, \
								SemicolonNumber, \
								DeclarationBoxNum, \
								DeclarationQty, \
								DeclarationWeight, \
								IntoWareHouseQty, \
								IntoWarehouseWeight, \
								OutOfWareHouseQty, \
								CustomsReleaseDateTime, \
								FirstIntoWareHouseTime, \
								LastIntoWareHouseTime, \
								FirstOutOfWareHouseTime, \
								LastOutOfWareHouseTime, \
								ImportBoatClassDate, \
								CustomsWay \
							FROM ( \
								SELECT * \
								FROM O_ITEM_LIST \
								WHERE O_IL_SEQ = @O_OL_SEQ \
							) O_ITEM_LIST \
							LEFT JOIN ( \
								SELECT O_PG_SEQ, O_PG_SMALLNO  \
								FROM O_PULL_GOODS \
								WHERE O_PG_SEQ = @O_OL_SEQ \
							) O_PULL_GOODS ON \
							O_IL_SEQ = O_PG_SEQ AND \
							O_IL_SMALLNO = O_PG_SMALLNO \
							LEFT JOIN IMD ON MainNumber = @O_OL_MASTER \
							AND SemicolonNumber = O_IL_SMALLNO \
							WHERE /*沒被拉貨的*/ O_PG_SEQ IS NULL \
							ORDER BY O_IL_NEWSMALLNO";
				
			break;

		case "SelectOriImd":
			_SQLCommand += "SELECT IMD.* \
							FROM ( \
								SELECT * \
								FROM O_ITEM_LIST \
								WHERE O_IL_SEQ = @O_OL_SEQ \
							) O_ITEM_LIST \
							INNER JOIN IMD ON MainNumber = @O_OL_MASTER \
							AND SemicolonNumber = O_IL_SMALLNO \
							ORDER BY DeclarationNumber";
			break;

	}

	return _SQLCommand;
};