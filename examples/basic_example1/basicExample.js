(function(){
	
	window.onload = function(){
		//excelFormulaUtilities.parser.formatFormula
		//excelFormulaUtilities.parser.formatFormulaHTML
		//excelFormulaUtilities.convert.formula2CSharp
		//excelFormulaUtilities.convert.formula2JavaScript
		
		var formula_1 = 'SUM((A1:A10>=5)*(A1:A10<=10)*A1:A10)',
			formula_2 = '=RIGHT(A2,LEN(A2)-FIND("*",SUBSTITUTE(A2," ","*",LEN(A2)-LEN(SUBSTITUTE(A2," ","")))))',
			formula_3 = '=IF(A2:A3="YES","A2 equals yes", "A2 does not equal yes")';
		
		document.getElementById('fomatFormula_1').innerHTML = formula_1;
		document.getElementById('fomatFormula_1_out').innerHTML = excelFormulaUtilities.formatFormula(formula_1);
		
		document.getElementById('fomatFormula_2').innerHTML = formula_2;
		document.getElementById('fomatFormula_2_out').innerHTML = excelFormulaUtilities.formatFormula(formula_2);
	}

}())