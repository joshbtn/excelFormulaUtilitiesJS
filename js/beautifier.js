//Beautifier.js
//
//Copywrite 2011 Josh Benentt
//License - https://raw.github.com/joshatjben/excelFormulaUtilitiesJS/master/LICENSE.txt
//[on github](https://github.com/joshatjben/excelFormulaUtilitiesJS/tree/master/examples/basic_example1 "github")
//
(function (window, undefiend) {
    "use strict";
	
    //Check and setup name spaces.
	window.excelFormulaBeautifier = window.excelFormulaBeautifier || {};
    window.excelFormulaBeautifier.examples = window.excelFormulaBeautifier.examples || {};
	
	//Configuration
    //-------------------------------
	var config = {
		//The ID for the formula Input input/textarea
		INPUT_ID: 'formula_input',
		
		//The ID for the formula title area. in this example it spits out the function call;
		FORMULA_TITLE_ID: 'fomatFormula_2',
		
		//THE ID for the area to contain the beautified excel formula.
		FORMULA_BODY_ID:'fomatFormula_2_out',
		
		//Use this to set the inital textare/input text area.
		DEFAULT_FORMULA: ''
	},
	

    //Beautifier Page functionality
    //-------------------------------
	beautifier = window.excelFormulaBeautifier.examples.beautifier = 
		(function () {
			var oldFormula;
			
			return {
				formula: '',
				input: null,
				formulaTitle: null,
				formulaBody: null,
				update: function () {
					this.formula = this.input.value;

					//Test to see if the formula has changed, if it hasn't don't do anything
					if (oldFormula === this.formula) {
						return;
					}

					this.formulaTitle.innerHTML = this.formula;
					try{
						this.formulaBody.innerHTML = window.excelFormulaUtilities.formatFormulaHTML(this.formula);
					}catch(exception){
						//Do nothing, why? because this will only throw an error when the formula is improperly formed, however shouldn't effect perf.
					}
				}
			};
		}());

	//On Page Load
	//-------------------
	window.onload = function () {
		beautifier.input = document.getElementById(config.INPUT_ID);
		beautifier.formulaTitle = document.getElementById(config.FORMULA_TITLE_ID);
		beautifier.formulaBody = document.getElementById(config.FORMULA_BODY_ID);

		beautifier.input.value = beautifier.formula;
		
		//add beautifier.update(); here if if you have set an inital DEFAULT_FORMULA and would like it to render on page load.
	};
	
}(window));
