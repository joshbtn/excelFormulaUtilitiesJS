# Excel Formula Utilities for JavaScript

##Basic usage
	var formatFormula = excelFormulaUtilities.parser.formatFormula,
		formula2Csharp = excelFormulaUtilities.convert.formula2CSharp,
		formula = 'IF("pigs"="fly", "just another day", "pigs are flying!")';
	
	//this will output the c# statement - "pigs"=="fly?"just another day":"pigs are flying!"
	var convertedFormula1 = formula2Csharp(formula); 
	
	//This will beautify the excel formula using the default settings
	formula = 'IF(MAX(10, 30)>20,1,0)'
	var beautified = formatFormula( formula );