QUnit.module("parser");
/*
test("Test formatFormula ()", function() {
	var inputFormula = "IF('foo' = 'foo', 'foo', 'bar')";
	var formattedFormula = 'IF(\n\t"foo" = "foo",\n\t"foo",\n\t"bar"\n)';
	console.log(formattedFormula);
	console.log(excelFormulaUtilities.formatFormula(inputFormula))
	//equal(excelFormulaUtilities.formatFormula(inputFormula),  "Simple formating example.");
	equal(typeof {}, "object", "foo exsits");
});*/

test("formatFormula", function() {
  var inputFormula = 'IF("foo" = "foo", "foo", "bar")';
  var excpected = 'IF(\n\t"foo" = "foo",\n\t"foo",\n\t"bar"\n)';
  
  equal(window.excelFormulaUtilities.formatFormula(inputFormula), excpected, "Simple formating example.");
  
  inputFormula = 'IF(A1="yes", "yes", "no")';
  excpected = 'IF(\n\tA1 = "yes",\n\t"yes",\n\t"no"\n)';
  equal(excelFormulaUtilities.formatFormula(inputFormula), excpected, "advanced example.");
  
  inputFormula = '(AC6+AD6+IF(H6="Yes",1,IF(J6="Yes",1,0)))+IF(X6="Yes",1,0)'
  excpected = '(\n\tAC6 + AD6 +\n\tIF(\n\t\tH6 = \"Yes\",\n\t\t1,\n\t\tIF(\n\t\t\tJ6 = \"Yes\",\n\t\t\t1,\n\t\t\t0\n\t\t)\n\t)\n) +\nIF(\n\tX6 = \"Yes\",\n\t1,\n\t0\n)';
  equal(excelFormulaUtilities.formatFormula(inputFormula), excpected, "Encapsulation spacing.");
  
  inputFormula = 'TEST(1,,,1)';
  excpected = 'TEST(\n\t1,\n\t,\n\t,\n\t1\n)';
  equal(excelFormulaUtilities.formatFormula(inputFormula), excpected, "multiple commas.");
 
});

/*test("formatFormulaHTML", function() {
  
});*/

QUnit.module("convert");

test("formula2CSharp", function() {
	var inputFormula = 'IF("foo" = "foo", "foo", "bar")',
		excpected = '("foo"=="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), excpected, "Simple if example.");
  
	inputFormula = 'IF(IF(true, "foo", "bar") = "foo", "foo", "bar")';
	excpected = '((true?"foo":"bar")=="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), excpected, "Nested If Test.");
	
	inputFormula = 'IF(IF(MAX(1, -10)>0, "foo", "bar") = "foo", "foo", "bar")';
	excpected = '((Math.Max(1,-10)>0?"foo":"bar")=="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), excpected, "Nested If Test with a nested function.");
	
	inputFormula = 'SUM(1,1)';
	excpected = '(1+1)';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), excpected, "SUM(1,1)");
	
	inputFormula = 'SUM(1,1,1,1)';
	excpected = '(1+1+1+1)';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), excpected, "SUM(1,1,1,1)");
	
	inputFormula = 'IF(FOO_BAR = "foo bar", "THIS WORKED", "THIS ISN\'T WORKING")';
	excpected = '(FOO_BAR=="foo bar"?"THIS WORKED":"THIS ISN\'T WORKING")';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), excpected, "Test that strings keep correct spaces. See issue #2. https://github.com/joshatjben/excelFormulaUtilitiesJS/issues/2");
});

test("formula2JavaScript", function() {
	var inputFormula = 'IF("foo" = "foo", "foo", "bar")',
		excpected = '("foo"==="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), excpected, "Simple if example.");
  
	inputFormula = 'IF(IF(true, "foo", "bar") = "foo", "foo", "bar")';
	excpected = '((true?"foo":"bar")==="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), excpected, "Nested If Test.");
	
	inputFormula = 'IF(IF(MAX(1, -10)>0, "foo", "bar") = "foo", "foo", "bar")';
	excpected = '((Math.Max(1,-10)>0?"foo":"bar")==="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), excpected, "Nested If Test with a nested function.");
	
	inputFormula = 'IF(FOO_BAR = "foo bar", "THIS WORKED", "THIS ISN\'T WORKING")';
	excpected = '(FOO_BAR==="foo bar"?"THIS WORKED":"THIS ISN\'T WORKING")';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), excpected, "Test that strings keep correct spaces. See issue #2. https://github.com/joshatjben/excelFormulaUtilitiesJS/issues/2");
    
    inputFormula = 'SUM(A1:C3)';
	excpected = '(A1+A2+A3+B1+B2+B3+C1+C2+C3)';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), excpected, "Make sure the sum of ranges break out, See issue #6 https://github.com/joshatjben/excelFormulaUtilitiesJS/issues/6");
    
    inputFormula = '=SUM(A1:B3)';
    excpected = '[A1,B1,A2,B2,A3,B3]';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), excpected, "Make sure the sum of ranges break out, for non sum function");
});
