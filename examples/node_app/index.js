var formula = require('excel-formula');

var unFormattedFormula = '=IF(SUM(A1:A5)>1,"YES","NO")';

console.log("Original formula: " + unFormattedFormula);
console.log("Formatted Formula: ");
console.log(formula.formatFormula(unFormattedFormula));
