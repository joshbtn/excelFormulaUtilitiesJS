QUnit.module("base26");

window.excelFormulaUtilities.isEu = false;

test("fromBase26", function(){
    var input = 'AAA';
    var expected = '702';
    
    equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
    input = 'BAA';
    expected = '1378';
    equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
    input = 'ZZ';
    expected = '701';
    equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
    input = 'A';
    expected = '0';
    equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
    input = 'Z';
    expected = '25';
    equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
    input = 'AA';
    expected = '26';
    equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
    input = 'AC';
    expected = '28';
    equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
    input = 'BA';
    expected = '52';
    equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
});


QUnit.module("ExcelFormulaUtilities")
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
  var expected = 'IF(\n\t"foo" = "foo",\n\t"foo",\n\t"bar"\n)';
  
  equal(window.excelFormulaUtilities.formatFormula(inputFormula), expected, "Simple formating example.");
  
  inputFormula = 'IF(A1="yes", "yes", "no")';
  expected = 'IF(\n\tA1 = "yes",\n\t"yes",\n\t"no"\n)';
  equal(excelFormulaUtilities.formatFormula(inputFormula), expected, "advanced example.");
  
  inputFormula = '(AC6+AD6+IF(H6="Yes",1,IF(J6="Yes",1,0)))+IF(X6="Yes",1,0)'
  expected = '(\n\tAC6 + AD6 +\n\tIF(\n\t\tH6 = \"Yes\",\n\t\t1,\n\t\tIF(\n\t\t\tJ6 = \"Yes\",\n\t\t\t1,\n\t\t\t0\n\t\t)\n\t)\n) +\nIF(\n\tX6 = \"Yes\",\n\t1,\n\t0\n)';
  equal(excelFormulaUtilities.formatFormula(inputFormula), expected, "Encapsulation spacing.");
  
  inputFormula = 'TEST(1,,,1)';
  expected = 'TEST(\n\t1,\n\t,\n\t,\n\t1\n)';
  equal(excelFormulaUtilities.formatFormula(inputFormula), expected, "multiple commas.");
  
  window.excelFormulaUtilities.isEu = true;
  inputFormula = 'IF(A1="yes"; "yes"; "no")';
  expected = 'IF(\n\tA1 = "yes";\n\t"yes";\n\t"no"\n)';
  equal(excelFormulaUtilities.formatFormula(inputFormula), expected, "Test with ; instead of ,");
  window.excelFormulaUtilities.isEu = false;
 
});

test("Issue #28", function() {
    inputFormula = "'Data Sheet'!$D3";
    expected = "'Data Sheet'!$D3";
    equal(excelFormulaUtilities.formatFormula(inputFormula), expected, "Data sheet ref to stay intact.");
    
})

/*test("formatFormulaHTML", function() {
  
});*/

test("formula2CSharp", function() {
	var inputFormula = 'IF("foo" = "foo", "foo", "bar")',
		expected = '("foo"=="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), expected, "Simple if example.");
  
	inputFormula = 'IF(IF(true, "foo", "bar") = "foo", "foo", "bar")';
	expected = '((true?"foo":"bar")=="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), expected, "Nested If Test.");
	
	inputFormula = 'IF(IF(MAX(1, -10)>0, "foo", "bar") = "foo", "foo", "bar")';
	expected = '((Math.Max(1,-10)>0?"foo":"bar")=="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), expected, "Nested If Test with a nested function.");
	
	inputFormula = 'SUM(1,1)';
	expected = '(1+1)';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), expected, "SUM(1,1)");
	
	inputFormula = 'SUM(1,1,1,1)';
	expected = '(1+1+1+1)';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), expected, "SUM(1,1,1,1)");
	
	inputFormula = 'IF(FOO_BAR = "foo bar", "THIS WORKED", "THIS ISN\'T WORKING")';
	expected = '(FOO_BAR=="foo bar"?"THIS WORKED":"THIS ISN\'T WORKING")';
	equal(excelFormulaUtilities.formula2CSharp(inputFormula), expected, "Test that strings keep correct spaces. See issue #2. https://github.com/joshatjben/excelFormulaUtilitiesJS/issues/2");
});

test("Make sure lines don't wrap  after 44 indents. Issue #29", function(){
    var inputFormula = '=IF(SUM( IF(FOO = BAR, IF(SUM( IF(FOO = BAR, IF(SUM( IF(FOO = BAR, IF(SUM( IF(FOO = BAR, IF(SUM( IF(FOO = BAR, IF(SUM( IF(FOO = BAR, IF(SUM( IF(FOO = BAR, IF(SUM( IF(FOO = BAR, IF(SUM( IF(FOO = BAR, IF(SUM( IF(FOO = BAR, IF(SUM( IF(FOO = BAR, 10, 0), 10 ) = 20 , "FOO", "BAR"), 0), 10 ) = 20 , "FOO", "BAR"), 0), 10 ) = 20 , "FOO", "BAR"), 0), 10 ) = 20 , "FOO", "BAR"), 0), 10 ) = 20 , "FOO", "BAR"), 0), 10 ) = 20 , "FOO", "BAR"), 0), 10 ) = 20 , "FOO", "BAR"), 0), 10 ) = 20 , "FOO", "BAR"), 0), 10 ) = 20 , "FOO", "BAR"), 0), 10 ) = 20 , "FOO", "BAR"), 0), 10 ) = 20 , "FOO", "BAR")',
        expected = 'IF(\n	SUM(\n		IF(\n			FOO = BAR,\n			IF(\n				SUM(\n					IF(\n						FOO = BAR,\n						IF(\n							SUM(\n								IF(\n									FOO = BAR,\n									IF(\n										SUM(\n											IF(\n												FOO = BAR,\n												IF(\n													SUM(\n														IF(\n															FOO = BAR,\n															IF(\n																SUM(\n																	IF(\n																		FOO = BAR,\n																		IF(\n																			SUM(\n																				IF(\n																					FOO = BAR,\n																					IF(\n																						SUM(\n																							IF(\n																								FOO = BAR,\n																								IF(\n																									SUM(\n																										IF(\n																											FOO = BAR,\n																											IF(\n																												SUM(\n																													IF(\n																														FOO = BAR,\n																														IF(\n																															SUM(\n																																IF(\n																																	FOO = BAR,\n																																	10,\n																																	0\n																																),\n																																10\n																															) = 20,\n																															\"FOO\",\n																															\"BAR\"\n																														),\n																														0\n																													),\n																													10\n																												) = 20,\n																												\"FOO\",\n																												\"BAR\"\n																											),\n																											0\n																										),\n																										10\n																									) = 20,\n																									\"FOO\",\n																									\"BAR\"\n																								),\n																								0\n																							),\n																							10\n																						) = 20,\n																						\"FOO\",\n																						\"BAR\"\n																					),\n																					0\n																				),\n																				10\n																			) = 20,\n																			\"FOO\",\n																			\"BAR\"\n																		),\n																		0\n																	),\n																	10\n																) = 20,\n																\"FOO\",\n																\"BAR\"\n															),\n															0\n														),\n														10\n													) = 20,\n													\"FOO\",\n													\"BAR\"\n												),\n												0\n											),\n											10\n										) = 20,\n										\"FOO\",\n										\"BAR\"\n									),\n									0\n								),\n								10\n							) = 20,\n							\"FOO\",\n							\"BAR\"\n						),\n						0\n					),\n					10\n				) = 20,\n				\"FOO\",\n				\"BAR\"\n			),\n			0\n		),\n		10\n	) = 20,\n	\"FOO\",\n	\"BAR\"\n)',
        actual = excelFormulaUtilities.formatFormula(inputFormula);
    
    equal(actual, expected);
})

test("formula2JavaScript", function() {
	var inputFormula = 'IF("foo" = "foo", "foo", "bar")',
		expected = '("foo"==="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), expected, inputFormula + " -- Simple if example.");
  
	inputFormula = 'IF(IF(true, "foo", "bar") = "foo", "foo", "bar")';
	expected = '((true?"foo":"bar")==="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), expected, inputFormula + " -- Nested If Test.");
	
	inputFormula = 'IF(IF(MAX(1, -10)>0, "foo", "bar") = "foo", "foo", "bar")';
	expected = '((Math.Max(1,-10)>0?"foo":"bar")==="foo"?"foo":"bar")';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), expected, inputFormula + " -- Nested If Test with a nested function.");
	
	inputFormula = 'IF(FOO_BAR = "foo bar", "THIS WORKED", "THIS ISN\'T WORKING")';
	expected = '(FOO_BAR==="foo bar"?"THIS WORKED":"THIS ISN\'T WORKING")';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), expected, inputFormula + " -- Test that strings keep correct spaces. See issue #2. https://github.com/joshatjben/excelFormulaUtilitiesJS/issues/2");
    
    inputFormula = 'SUM(A1:C3)';
	expected = '(A1+B1+C1+A2+B2+C2+A3+B3+C3)';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), expected, inputFormula + " -- Make sure the sum of ranges break out, See issue #6 https://github.com/joshatjben/excelFormulaUtilitiesJS/issues/6");
    
    inputFormula = 'SUM(AA1:BA3)';
    expected = '(AA1+AB1+AC1+AD1+AE1+AF1+AG1+AH1+AI1+AJ1+AK1+AL1+AM1+AN1+AO1+AP1+AQ1+AR1+AS1+AT1+AU1+AV1+AW1+AX1+AY1+AZ1+BA1+AA2+AB2+AC2+AD2+AE2+AF2+AG2+AH2+AI2+AJ2+AK2+AL2+AM2+AN2+AO2+AP2+AQ2+AR2+AS2+AT2+AU2+AV2+AW2+AX2+AY2+AZ2+BA2+AA3+AB3+AC3+AD3+AE3+AF3+AG3+AH3+AI3+AJ3+AK3+AL3+AM3+AN3+AO3+AP3+AQ3+AR3+AS3+AT3+AU3+AV3+AW3+AX3+AY3+AZ3+BA3)';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), expected, inputFormula + " -- Make sure the sum of ranges break out, See issue #6 https://github.com/joshatjben/excelFormulaUtilitiesJS/issues/6");
    
    
    inputFormula = 'SUM(AG39:AG49)';
    expected = '(AG39+AG40+AG41+AG42+AG43+AG44+AG45+AG46+AG47+AG48+AG49)';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), expected, inputFormula + " -- Test for @sblommers comment on issue #6 https://github.com/joshatjben/excelFormulaUtilitiesJS/issues/6");
    
    inputFormula = 'SUM(AA1:BB2)';
    expected = '(AA1+AB1+AC1+AD1+AE1+AF1+AG1+AH1+AI1+AJ1+AK1+AL1+AM1+AN1+AO1+AP1+AQ1+AR1+AS1+AT1+AU1+AV1+AW1+AX1+AY1+AZ1+BA1+BB1+AA2+AB2+AC2+AD2+AE2+AF2+AG2+AH2+AI2+AJ2+AK2+AL2+AM2+AN2+AO2+AP2+AQ2+AR2+AS2+AT2+AU2+AV2+AW2+AX2+AY2+AZ2+BA2+BB2)';
    equal(excelFormulaUtilities.formula2JavaScript(inputFormula), expected, inputFormula + " -- Test for issue #6 https://github.com/joshatjben/excelFormulaUtilitiesJS/issues/6");

    
    inputFormula = '=FOO(A1:B3)';
    expected = 'FOO([A1,B1,A2,B2,A3,B3])';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), expected, "FOO(A1:B3) = Make sure the sum of ranges break out, for non sum function");
	
	inputFormula = '=VLOOKUP(A1, {1,11 ; 2, 20 ; 3, 34 ; 4, 45}, 2, 0)';
	expected = '=VLOOKUP (A1, [[1,11], [2, 20], [3, 34], [4, 45]], 2, 0)';
	equal(excelFormulaUtilities.formula2JavaScript(inputFormula), expected, "VLOOKUP(A1, {1,11 ; 2, 20 ; 3, 34 ; 4, 45}, 2, 0) - make sure arrays are converted properly");
});

test("space after =", function() {
    inputFormula = '= A1 + B2';
    expected = 'A1 + B2';
	equal(excelFormulaUtilities.formatFormula(inputFormula), expected, "space after =");
});

test("Logical operands TRUE and FALSE should not break formatting - found in issue 26", function(){
    
    /*
    ISSUE:
        subtype: "logical"
        type: "operand"
        value: "TRUE"
    */
    
    var inputFormula='=IF(True,TRUE,FALSE)',
        expected = 'IF(\n\tTrue,\n\tTRUE,\n\tFALSE\n)',
        actual = excelFormulaUtilities.formatFormula(inputFormula);
        
    equal(actual, expected);
    
})