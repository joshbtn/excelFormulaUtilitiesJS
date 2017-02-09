var assert = require('assert');

var formula = require('../index.js');

describe("Test parsing a formula that does not start with a function. From Issue #46", function(){
  var inputFormula='=A1+B1',
  expected = 'A1 + B1',
  actual = formula.formatFormula(inputFormula);
  assert.equal(actual, expected);

  inputFormula='=A5';
  expected = 'A5';
  actual = formula.toCSharp(inputFormula);

  assert.equal(actual, expected);

  inputFormula='=A1+B1';
  expected = 'A1+B1';
  actual = formula.toJavaScript(inputFormula);

  assert.equal(actual, expected);
})
