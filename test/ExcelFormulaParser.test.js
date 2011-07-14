module("ExcelFormulaParser");

test("Test beautifyFormula()", function() {
	var inputFormula = "IF('foo' = 'foo', 'foo', 'bar')";
	var formattedFormula = "IF(\n\t'foo' = 'foo',\n\t'foo',\n\t'bar'\n)";
	console.log(excelFormulaUtilities.beautifyFormula(inputFormula))
	//equals(excelFormulaUtilities.beautifyFormula(inputFormula), formattedFormula, "simple if formatting works.");
});