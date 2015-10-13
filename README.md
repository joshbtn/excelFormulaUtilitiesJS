# ExcelFormulaBeautifier.com

This lives under the gh-pages branch.
To submit pull requests for [ExcelFormulaBeautifier.com](http://ExcelFormulaBeautifier.com) please use this branch.
Changes to the core js library live in the master branch.

# Excel Formula Utilities for JavaScript

##Install using npm
npm install excel-formula

## Installation for web
Grab the latest js files in the dist folder.

## Basic usage for web
    <script src="excel-formula.js" />
    <script>
        var formattedFormula = excelFormulaUtilities.formatFormula('IF(1+1=2,"true","false")');
        alert(formattedFormula)
    </script>

## Basic Usage for Node
    var formula = require('excel-formula');
    var formattedFormula = formula.formatFormula('IF(1+1=2,"true","false")');
    console.log(formatFormula);

## Node methods
See basic usage above.

    formula.getTokens (formula);
    formula.formatFormula (formula, [opts])
    formula.toJavaScript(formula)
    formula.toCSharp(formula)

## Web methods
excelFormulaUtilities is a global variable.

    excelFormulaUtilities.getTokens (formula);
    excelFormulaUtilities.formatFormula (formula, [opts])
    excelFormulaUtilities.formula2JavaScript(formula)
    excelFormulaUtilities.formula2CSharp(formula)
