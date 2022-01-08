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

  describe("#arrayliterals", () => {
    it("Test parsing a formula that contains array literals. From Issue #89", () => {
      let inputFormula='={A1:C2,B2:C3}';
      let expected = '={&nbsp;A1:C2,<br /><span class="tabbed">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabbed">&nbsp;&nbsp;&nbsp;&nbsp;</span>B2:C3}';
      let actual = formula.formatFormulaHTML(inputFormula);
      assert.equal(actual, expected);
    })
  }) 
  
  describe("#arrayliterals", () => {
    it("Test parsing a formula that contains array literals. From Issue #83", () => {
      let inputFormula='=SORT($B$3:$F$20,{2,1},{-1,1})';
      let expected = '=<span class="function">SORT</span><span class="function_start">(</span><br /><span class="tabbed">&nbsp;&nbsp;&nbsp;&nbsp;</span>$B$3:$F$20,<br />{&nbsp;2,<br /><span class="tabbed">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabbed">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabbed">&nbsp;&nbsp;&nbsp;&nbsp;</span>1},<br />{-&nbsp;1,<br /><span class="tabbed">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabbed">&nbsp;&nbsp;&nbsp;&nbsp;</span><span class="tabbed">&nbsp;&nbsp;&nbsp;&nbsp;</span>1}<br /><span class="function_stop">)</span>';
      let actual = formula.formatFormulaHTML(inputFormula);
      assert.equal(actual, expected);
    })
  })

})
