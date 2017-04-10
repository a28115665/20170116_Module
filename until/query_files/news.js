module.exports = function(pQueryname, pParams){
	var _SQLCommand = "";

	switch(pQueryname){
		case "SelectSysGroup":
			_SQLCommand += "SELECT SG_GCODE AS 'CODE', \
					     		   SG_TITLE AS 'NAME', \
					     		   'In' AS 'IO_TYPE' \
			     		    FROM SYS_GROUP WHERE SG_STS = 0 ";
			break;
		case "SelectCompyInfo":
			_SQLCommand += "SELECT CO_CODE AS 'CODE', \
								   CO_NAME AS 'NAME', \
								   'Out' AS 'IO_TYPE' \
						    FROM COMPY_INFO WHERE CO_STS = 0 ";
			break;
		case "SelectSysGroupUnionCompyInfo":
			_SQLCommand += "SELECT SG_GCODE AS 'CODE', \
					     		   SG_TITLE AS 'NAME', \
					     		   'In' AS 'IO_TYPE' \
			     		    FROM SYS_GROUP WHERE SG_STS = 0 ";
			_SQLCommand += " Union All ";
			_SQLCommand += "SELECT CO_CODE AS 'CODE', \
								   CO_NAME AS 'NAME', \
								   'Out' AS 'IO_TYPE' \
						    FROM COMPY_INFO WHERE CO_STS = 0 ";
			break;

	}

	return _SQLCommand;
};