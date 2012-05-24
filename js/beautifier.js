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
				formula: '=IF(SUM( If(FOO = BAR, 10, 0), 10 ) = 20 , "FOO", "BAR")',
				input: null,
				formulaTitle: null,
				formulaBody: null,
                mode: "beautify",
                changeMode: function(mode){
                    window.excelFormulaBeautifier.examples.beautifier.mode = mode;
                    window.excelFormulaBeautifier.examples.beautifier.update.call(window.excelFormulaBeautifier.examples.beautifier);
                },
				update: function () {
					this.formula = this.input.value;

					//Test to see if the formula has changed, if it hasn't don't do anything
					if (oldFormula === this.formula) {
						return;
					}
                    
					// Check to see which mode we're in, render appropriately
					try{
                        
						switch( this.mode ) {
                            case "beautify":
                                this.formulaBody.innerHTML = window.excelFormulaUtilities.formatFormulaHTML(this.formula);
                                break;
                            case "js":
                                this.formulaBody.innerHTML = window.excelFormulaUtilities.formula2JavaScript(this.formula);
                                break;
						}
					}catch(exception){
						//Do nothing, This should throw an error when the formula is improperly formed, which shouldn't blow things up.
					}
				}
			};
		}());

	//On Page Load
	//-------------------
	window.onload = function () {
		beautifier.input = document.getElementById(config.INPUT_ID);
		//beautifier.formulaTitle = document.getElementById(config.FORMULA_TITLE_ID);
		beautifier.formulaBody = document.getElementById(config.FORMULA_BODY_ID);

		beautifier.input.value = beautifier.formula;
		beautifier.update();
		//add beautifier.update(); here if if you have set an inital DEFAULT_FORMULA and would like it to render on page load.
	};
	
}(window));
