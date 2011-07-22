(function () {
    "use strict";
    window.excelFormulaBeautifier = window.excelFormulaBeautifier || {};
    window.excelFormulaBeautifier.examples = window.excelFormulaBeautifier.examples || {};

    var beautifier = window.excelFormulaBeautifier.examples.beautifier = {},
		formula, 
		input, 
		formulaTitle, 
		formulaBody,
		update = beautifier.update = function () {
            formula = input.value;
            formulaTitle.innerHTML = formula;
            formulaBody.innerHTML = window.excelFormulaUtilities.formatFormulaHTML(formula);
        };

    window.onload = function () {
        formula = '';
        input = document.getElementById('formula_input');
        formulaTitle = document.getElementById('fomatFormula_2');
        formulaBody = document.getElementById('fomatFormula_2_out');

        input.value = formula;

        update();
    };
}());