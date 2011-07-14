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
  equals(excelFormulaUtilities.formatFormula(inputFormula), formattedFormula, "Simple formating example.");
  
  inputFormula = 'IF(R[39]C[11]>65,R[25]C[42],ROUND((R[11]C[11]*IF(OR(AND(R[39]C[11]>=55, R[40]C[11]>=20),AND(R[40]C[11]>=20,R11C3="YES")),R[44]C[11],R[43]C[11]))+(R[14]C[11] *IF(OR(AND(R[39]C[11]>=55,R[40]C[11]>=20),AND(R[40]C[11]>=20,R11C3="YES")), R[45]C[11],R[43]C[11])),0))'
  formattedFormula = '"IF(\n\tR[39]C[11] > 65 ,\n\tR[25]C[42] ,\n\tROUND(\n\t\t R[11]C[11] * IF(\n\t\t\t\tOR(\n\t\t\t\t\tAND(\n\t\t\t\t\t\tR[39]C[11] >= 55 ,\n\t\t\t\t\t\tR[40]C[11] >= 20 \n\t\t\t\t\t)\n\t\t\t\t\t,\n\t\t\t\t\tAND(\n\t\t\t\t\t\tR[40]C[11] >= 20 ,\n\t\t\t\t\t\tR11C3 = YES \n\t\t\t\t\t)\n\t\t\t\t)\n\t\t\t\t,\n\t\t\t\tR[44]C[11] ,\n\t\t\t\tR[43]C[11] \n\t\t\t)\n\t\t +  R[14]C[11] * IF(\n\t\t\t\tOR(\n\t\t\t\t\tAND(\n\t\t\t\t\t\tR[39]C[11] >= 55 ,\n\t\t\t\t\t\tR[40]C[11] >= 20 \n\t\t\t\t\t)\n\t\t\t\t\t,\n\t\t\t\t\tAND(\n\t\t\t\t\t\tR[40]C[11] >= 20 ,\n\t\t\t\t\t\tR11C3 = YES \n\t\t\t\t\t)\n\t\t\t\t\n\t\t\t\t)\n\t\t\t\t,\n\t\t\t\tR[45]C[11] ,\n\t\t\t\tR[43]C[11] \n\t\t\t)\n\t\t ,\n\t\t0 \n\t)\n )"';
  equals(excelFormulaUtilities.formatFormula(inputFormula), formattedFormula, "advanced example.");
  
});

