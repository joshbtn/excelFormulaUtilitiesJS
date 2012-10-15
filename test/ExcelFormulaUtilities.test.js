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
  var excpected = '=IF(\n\t"foo" = "foo",\n\t"foo",\n\t"bar"\n)';
  
  equal(window.excelFormulaUtilities.formatFormula(inputFormula), excpected, "Simple formating example.");
  
  inputFormula = 'IF(A1="yes", "yes", "no")'
  excpected = '=IF(\n\tA1 = "yes",\n\t"yes",\n\t"no"\n)';
  equal(excelFormulaUtilities.formatFormula(inputFormula), excpected, "advanced example.");
  
  inputFormula = '(AC6+AD6+IF(H6="Yes",1,IF(J6="Yes",1,0)))+IF(X6="Yes",1,0)'
  excpected = '';
  equal(excelFormulaUtilities.formatFormula(inputFormula), excpected, "Encapsulation spacing.");
 
});

test("formatFormulaHTML", function() {
  var inputFormula = 'IF("foo" = "foo", "foo", "bar")';
  var excpected = '<span class="function">IF</span><br /><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="quote_mark">"</span><span class="text">foo</span><span class="quote_mark">"</span> =&nbsp;<span class="quote_mark">"</span><span class="text">foo</span><span class="quote_mark">"</span>,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="quote_mark">"</span><span class="text">foo</span><span class="quote_mark">"</span>,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="quote_mark">"</span><span class="text">bar</span><span class="quote_mark">"</span><br /><span class="function_stop">)</span>';
  
  equal(window.excelFormulaUtilities.formatFormulaHTML(inputFormula), excpected, "Simple formating example.");
  
  inputFormula = 'IF(R[39]C[11]>65,R[25]C[42],ROUND((R[11]C[11]*IF(OR(AND(R[39]C[11]>=55, R[40]C[11]>=20),AND(R[40]C[11]>=20,R11C3="YES")),R[44]C[11],R[43]C[11]))+(R[14]C[11] *IF(OR(AND(R[39]C[11]>=55,R[40]C[11]>=20),AND(R[40]C[11]>=20,R11C3="YES")), R[45]C[11],R[43]C[11])),0))'
  excpected = '<span class="function">IF</span><br /><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[39]C[11] >&nbsp;65,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[25]C[42],<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function">ROUND</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>(&nbsp;R[11]C[11] *<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function">IF</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function">OR</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function">AND</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[39]C[11] >=&nbsp;55,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[40]C[11] >=&nbsp;20<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_stop">)</span>,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function">AND</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[40]C[11] >=&nbsp;20,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R11C3 =&nbsp;<span class="quote_mark">"</span><span class="text">YES</span><span class="quote_mark">"</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_stop">)</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_stop">)</span>,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[44]C[11],<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[43]C[11]<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_stop">)</span> ) +&nbsp;(&nbsp;R[14]C[11] *<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function">IF</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function">OR</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function">AND</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[39]C[11] >=&nbsp;55,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[40]C[11] >=&nbsp;20<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_stop">)</span>,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function">AND</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_start">(</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[40]C[11] >=&nbsp;20,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R11C3 =&nbsp;<span class="quote_mark">"</span><span class="text">YES</span><span class="quote_mark">"</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_stop">)</span><br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_stop">)</span>,<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[45]C[11],<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>R[43]C[11]<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_stop">)</span> ),<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span>0<br /><span class="tabs">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="function_stop">)</span><br /><span class="function_stop">)</span>';
  equal(excelFormulaUtilities.formatFormulaHTML(inputFormula), excpected, "advanced example.");
 
});

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
});
