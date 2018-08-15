"use strict";

const assert = require('assert');
const formula = require('../index.js');

describe("ExcelFormulaUtilities", () => {

  describe("#formatFormula", () => {

    it("should parse a formula that doesn't start with a function. Tests fix for Issue #46.", () => {
      let inputFormula='=A1+B1';
      let expected = 'A1 + B1';
      let actual = formula.formatFormula(inputFormula);
      assert.equal(actual, expected);
    });

  });

  describe("#formatFormulaHTML", () => {

    it("should replace < or > signs in a formula with &lt; and &gt;.  Tests fix for Issue #58.", () => {
      let inputFormula = '"<h1>foo</h1>"';
      let expected = '=<span class="quote_mark">"</span><span class="text">&lt;h1&gt;foo&lt;/h1&gt;</span><span class="quote_mark">"</span>';
      let actual = formula.formatFormulaHTML(inputFormula);
      assert.equal(actual, expected);
    });
  });

  describe("#toCSharp", () => {
    it("should parse a formula that doesn't start with a function. Tests fix for Issue #46.", () => {
      let inputFormula='=A5';
      let expected = 'A5';
      let actual = formula.toCSharp(inputFormula);
      assert.equal(actual, expected);
    });
  });

  describe("#toJavaScript", () => {
    it("should parse a formula that doesn't start with a function. Tests fix for Issue #46.", () => {
      let inputFormula='=A1+B1';
      let expected = 'A1+B1';
      let actual = formula.toJavaScript(inputFormula);
      assert.equal(actual, expected);
    })
  })

  describe("#toPython", () => {
    it("Test parsing a formula that does not start with a function. From Issue #46", () => {
      let inputFormula='=A1+B1';
      let expected = 'A1+B1';
      let actual = formula.toPython(inputFormula);
      assert.equal(actual, expected);
    })
  })
  
  describe("#fromBase26", ()=>{
    
    it("Various base26 to base10 conversions to work", () =>{
      var input = 'AAA';
      var expected = '702';
    
      assert.equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);

      input = 'BAA';
      expected = '1378';
      assert.equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);

    asdf
      input = 'ZZ';
      expected = '701';
      assert.equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
      input = 'A';
      expected = '0';
      assert.equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
      input = 'Z';
      expected = '25';
      assert.equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
      input = 'AA';
      expected = '26';
      assert.equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
      input = 'AC';
      expected = '28';
      assert.equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    
      input = 'BA';
      expected = '52';
      assert.equal(excelFormulaUtilities.fromBase26(input), expected, input + " = " + expected);
    })

  });

})
