# ExcelFormulaBeautifier.com

This lives under the gh-pages branch.
To submit pull requests for [ExcelFormulaBeautifier.com](http://ExcelFormulaBeautifier.com) please use this branch.
Changes to the core js library live in the master branch.

# Excel Formula Utilities for JavaScript

##Installation
  1. Save excelFormulaUtilities-[version].js(For dev) or excelFormulaUtilities-[version].js.min (For prod).
  2. Save excelFormulaUtilities.css if you'd like basic styling when outputting formulas to html.
  3. Drop these files into your project.

Check out the examples below or if you'd like to use the beautifier online click here http://excelformulabeautifier.com/
    
##Basic usage

This will return a formated formula in plain text.  

    excelFormulaUtilities.formatFormula('IF(1+1=2,"true","false")'); //Returns a string containing the formatted formula.

##Example

To see this example check out ./examples/basic_example1/index.html

###The JavaScript
	window.onload = function(){
		//Beautify an Excel formula output to text
        var formula_1 = 'SUM((A1:A10>=5)*(A1:A10<=10)*A1:A10)';
		document.getElementById('fomatFormula_1').innerHTML = formula_1;
		document.getElementById('fomatFormula_1_out').innerHTML = excelFormulaUtilities.formatFormula(formula_1);
		
        //Beautify an Excel formula output to html.
        var formula_2 = '=RIGHT(A2,LEN(A2)-FIND("*",SUBSTITUTE(A2," ","*",LEN(A2)-LEN(SUBSTITUTE(A2," ","")))))';
		document.getElementById('fomatFormula_2').innerHTML = formula_2;
		document.getElementById('fomatFormula_2_out').innerHTML = excelFormulaUtilities.formatFormulaHTML(formula_2);
		
        //Convert an Excel formula to C#
        var formula_3 = '=IF(A2:A3="YES","A2 equals yes", "A2 does not equal yes")';
		document.getElementById('fomatFormula_3').innerHTML = formula_3;
		document.getElementById('fomatFormula_3_out').innerHTML = excelFormulaUtilities.formula2CSharp(formula_3);
		
        //Convert an Excel formula to JavaScript
        var formula_4 = 'ADDRESS(ROW(DataRange2),COLUMN(DataRange2),4)&":"&ADDRESS(MAX((DataRange2<>"")*ROW(DataRange2)),COLUMN(DataRange2)+COLUMNS(DataRange2)-1,4)';
		document.getElementById('fomatFormula_4').innerHTML = formula_4;
		document.getElementById('fomatFormula_4_out').innerHTML = excelFormulaUtilities.formula2JavaScript(formula_4);
	}

###The HTML
	<div class="formula">
		<h2>excelFormulaUtilities.formatFormula( "<span id="fomatFormula_1"></span>" );</h2>
		<pre id="fomatFormula_1_out"></pre>
	</div>
	
	<div class="formula">
		<h2>excelFormulaUtilities.formatFormulaHTML( "<span id="fomatFormula_2"></span>" );</h2>
		<pre id="fomatFormula_2_out"></pre>
	</div>
	
	<div class="formula">
		<h2>excelFormulaUtilities.formula2CSharp( "<span id="fomatFormula_3"></span>" );</h2>
		<div id="fomatFormula_3_out"></div>
	</div>
	
	<div class="formula">
		<h2>excelFormulaUtilities.formula2Javascript( "<span id="fomatFormula_4"></span>" );</h2>
		<pre id="fomatFormula_4_out"></pre>
	</div>