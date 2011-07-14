module("ExcelFormulaParser");
/*
test("Test formatFormula ()", function() {
	var inputFormula = "IF('foo' = 'foo', 'foo', 'bar')";
	var formattedFormula = 'IF(\n\t"foo" = "foo",\n\t"foo",\n\t"bar"\n)';
	console.log(formattedFormula);
	console.log(excelFormulaUtilities.formatFormula(inputFormula))
	//equals(excelFormulaUtilities.formatFormula(inputFormula),  "Simple formating example.");
	equals(typeof {}, "object", "foo exsits");
});*/

test("Test extend with simple objects", function() {
  var inputFormula = "IF('foo' = 'foo', 'foo', 'bar')";
  var formattedFormula = 'IF(\n\t"foo" = "foo",\n\t"foo",\n\t"bar"\n)';
  ok(true, "test");
  equals(excelFormulaUtilities.formatFormula(inputFormula), formattedFormula, "Simple formating example.");
});