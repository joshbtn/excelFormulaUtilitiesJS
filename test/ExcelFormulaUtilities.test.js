"use strict";

const assert = require('assert');
const formula = require('../index.js');

describe("ExcelFormulaUtilities", () => {

  describe("#formatFormula", () => {

    it("should replace < or > signs in a formula with &lt; and &gt;.  Tests fix for Issue #58.", () => {
      assert.equals(true, false)
    });

    it("should parse a formula that doesn't start with a function. Tests fix for Issue #46.", () => {
      let inputFormula='=A1+B1';
      let expected = 'A1 + B1';
      let actual = formula.formatFormula(inputFormula);
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

})
