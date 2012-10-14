(function(){
	
	window.onload = function(){
    	
        //Beautify an Excel formula, output as text
        var formula_1 = 'SUM((A1:A10>=5)*(A1:A10<=10)*A1:A10)';
		document.getElementById('fomatFormula_1').innerHTML = formula_1;
		document.getElementById('fomatFormula_1_out').innerHTML = excelFormulaUtilities.formatFormula(formula_1);
		
        //Beautify an Excel formula, output as html.
        var formula_2 = '=RIGHT(A2,LEN(A2)-FIND("*",SUBSTITUTE(A2," ","*",LEN(A2)-LEN(SUBSTITUTE(A2," ","")))))';
		document.getElementById('fomatFormula_2').innerHTML = formula_2;
		document.getElementById('fomatFormula_2_out').innerHTML = excelFormulaUtilities.formatFormulaHTML(formula_2);
		
        //Convert an Excel formula to C#
        var formula_3 = '=IF(A2:A3="YES","A2 equals yes", "A2 does not equal yes")';
		document.getElementById('fomatFormula_3').innerHTML = formula_3;
		document.getElementById('fomatFormula_3_out').innerHTML = excelFormulaUtilities.formula2CSharp(formula_3);
		
        //Convert an Excel formula to Javascript
        var formula_4 = 'ADDRESS(ROW(DataRange2),COLUMN(DataRange2),4)&":"&ADDRESS(MAX((DataRange2<>"")*ROW(DataRange2)),COLUMN(DataRange2)+COLUMNS(DataRange2)-1,4)';
		document.getElementById('fomatFormula_4').innerHTML = formula_4;
		document.getElementById('fomatFormula_4_out').innerHTML = excelFormulaUtilities.formula2JavaScript(formula_4);
	
	}

}())