# Excel Formula Utilities for JavaScript

##Basic usage
	var formatFormula = excelFormulaUtilities.parser.formatFormula,
		formula2Csharp = excelFormulaUtilities.convert.formula2CSharp;
	
	//this will output the c# statement - "pigs"=="fly?"just another day":"pigs are flying!"
	var convertedFormula1 = formula2Csharp('IF("pigs"="fly", "just another day", "pigs are flying!")'); 
	
	//This will beautify the excel formula using the default settings
	var beautified = formatFormula( 'IF(MAX(10, 30)>20,1,0)' );