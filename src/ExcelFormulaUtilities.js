var Tokenizer = require("excel-formula-tokenizer");
var getTokens = Tokenizer.tokenize,
  types = Tokenizer.TYPES,
  F_tokens = Tokenizer.Tokens,
  F_tokenStack = Tokenizer.TokenStack;

/*
 * excelFormulaUtilitiesJS
 * https://github.com/joshatjben/excelFormulaUtilitiesJS/
 *
 * Copyright 2011, Josh Bennett
 * licensed under the MIT license.
 * https://github.com/joshatjben/excelFormulaUtilitiesJS/blob/master/LICENSE.txt
 *
 * Some functionality based off of the jquery core lib
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Based on Ewbi's Go Calc Prototype Excel Formula Parser. [http://ewbi.blogs.com/develops/2004/12/excel_formula_p.html]
 */
(function (root) {
    var excelFormulaUtilities = root.excelFormulaUtilities = root.excelFormulaUtilities || {},
    core = root.excelFormulaUtilities.core,
        formatStr = root.excelFormulaUtilities.string.formatStr,
        trim = root.excelFormulaUtilities.string.trim;

    root.excelFormulaUtilities.isEu = typeof root.excelFormulaUtilities.isEu === 'boolean' ? root.excelFormulaUtilities.isEu : false;


    /**
     * @class
     */

    function F_token(value, type, subtype) {
        this.value = value;
        this.type = type;
        this.subtype = subtype;
    }

    var parseFormula = excelFormulaUtilities.parseFormula = function (inputID, outputID) {


        var indentCount = 0;

        var indent = function () {
            var s = "|",
                i = 0;
            for (; i < indentCount; i += 1) {
                s += "&nbsp;&nbsp;&nbsp;|";
            }
            return s;
        };

        var formulaControl = document.getElementById(inputID);
        var formula = formulaControl.value;

        var tokens = getTokens(formula, {
            asClass: true,
            language: root.excelFormulaUtilities.isEu ? "en-EU" : "en-US",
            preserveLanguage: true
        });

        var tokensHtml = "";

        tokensHtml += "<table cellspacing='0' style='border-top: 1px #cecece solid; margin-top: 5px; margin-bottom: 5px'>";
        tokensHtml += "<tr>";
        tokensHtml += "<td class='token' style='font-weight: bold; width: 50px'>index</td>";
        tokensHtml += "<td class='token' style='font-weight: bold; width: 125px'>type</td>";
        tokensHtml += "<td class='token' style='font-weight: bold; width: 125px'>subtype</td>";
        tokensHtml += "<td class='token' style='font-weight: bold; width: 150px'>token</td>";
        tokensHtml += "<td class='token' style='font-weight: bold; width: 300px'>token tree</td></tr>";

        while (tokens.moveNext()) {

            var token = tokens.current();

            if (token.subtype === types.TOK_SUBTYPE_STOP) {
                indentCount -= ((indentCount > 0) ? 1 : 0);
            }

            tokensHtml += "<tr>";

            tokensHtml += "<td class='token'>" + (tokens.index + 1) + "</td>";

            tokensHtml += "<td class='token'>" + token.type + "</td>";
            tokensHtml += "<td class='token'>" + ((token.subtype.length === 0) ? "&nbsp;" : token.subtype.toString()) + "</td>";
            tokensHtml += "<td class='token'>" + ((token.value.length === 0) ? "&nbsp;" : token.value).split(" ").join("&nbsp;") + "</td>";
            tokensHtml += "<td class='token'>" + indent() + ((token.value.length === 0) ? "&nbsp;" : token.value).split(" ").join("&nbsp;") + "</td>";

            tokensHtml += "</tr>";

            if (token.subtype === types.TOK_SUBTYPE_START) {
                indentCount += 1;
            }

        }

        tokensHtml += "</table>";

        document.getElementById(outputID).innerHTML = tokensHtml;

        formulaControl.select();
        formulaControl.focus();

    };

    // Pass a range such as A1:B2 along with a
    // delimiter to get back a full list of ranges.
    //
    // Example:
    //    breakOutRanges("A1:B2", "+"); //Returns A1+A2+B1+B2
    function breakOutRanges(rangeStr, delimStr){

        //Quick Check to see if if rangeStr is a valid range
        if ( !RegExp("[a-z]+[0-9]+:[a-z]+[0-9]+","gi").test(rangeStr) ){
            throw "This is not a valid range: " + rangeStr;
        }

        //Make the rangeStr lowercase to deal with looping.
        var range = rangeStr.split(":"),

            startRow = parseInt(range[0].match(/[0-9]+/gi)[0]),
            startCol = range[0].match(/[A-Z]+/gi)[0],
            startColDec = fromBase26(startCol)

            endRow =  parseInt(range[1].match(/[0-9]+/gi)[0]),
            endCol = range[1].match(/[A-Z]+/gi)[0],
            endColDec = fromBase26(endCol),

            // Total rows and cols
            totalRows = endRow - startRow + 1,
            totalCols = fromBase26(endCol) - fromBase26(startCol) + 1,

            // Loop vars
            curCol = 0,
            curRow = 1 ,
            curCell = "",

            //Return String
            retStr = "";

        for(; curRow <= totalRows; curRow+=1){
            for(; curCol < totalCols; curCol+=1){
                // Get the current cell id
                curCell = toBase26(startColDec + curCol) + "" + (startRow+curRow-1) ;
                retStr += curCell + (curRow===totalRows && curCol===totalCols-1 ? "" : delimStr);
            }
            curCol=0;
        }

        return retStr;

    }

    //Modified from function at http://en.wikipedia.org/wiki/Hexavigesimal
    var toBase26 = excelFormulaUtilities.toBase26 = function( value ) {

       value = Math.abs(value);

       var converted = ""
            ,iteration = false
            ,remainder;

       // Repeatedly divide the number by 26 and convert the
       // remainder into the appropriate letter.
       do {
           remainder = value % 26;

           // Compensate for the last letter of the series being corrected on 2 or more iterations.
           if (iteration && value < 25) {
               remainder--;
           }

           converted = String.fromCharCode((remainder + 'A'.charCodeAt(0))) + converted;
           value = Math.floor((value - remainder) / 26);

           iteration = true;
       } while (value > 0);

       return converted;
   }

   // This was Modified from a function at http://en.wikipedia.org/wiki/Hexavigesimal
   // Pass in the base 26 string, get back integer
   var fromBase26 = excelFormulaUtilities.fromBase26 = function (number) {
        number = number.toUpperCase();

        var s = 0
            ,i = 0
            ,dec = 0;

        if (
            number !== null
            && typeof number !== "undefined"
            && number.length > 0
        ) {
            for (; i < number.length; i++) {
                s = number.charCodeAt(number.length - i - 1) - "A".charCodeAt(0);
                dec += (Math.pow(26, i)) * (s+1);
            }
        }

        return dec - 1;
    }

    function applyTokenTemplate(token, options, indent, lineBreak, override) {

        var lastToken = typeof arguments[5] === undefined || arguments[5] === null ? null : arguments[5];

        var replaceTokenTmpl = function (inStr) {
            return inStr.replace(/\{\{token\}\}/gi, "{0}").replace(/\{\{autoindent\}\}/gi, "{1}").replace(/\{\{autolinebreak\}\}/gi, "{2}");
        };

        var tokenString = "";

        if (token.subtype === "text" || token.type === "text") {
            tokenString = token.value.toString();
        } else if ( token.type === 'operand' && token.subtype === 'range') {
            tokenString = token.value.toString() ;
        } else {
            tokenString = ((token.value.length === 0) ? " " : token.value.toString()).split(" ").join("").toString();
        }

        if (typeof override === 'function') {
            var returnVal = override(tokenString, token, indent, lineBreak);

            tokenString = returnVal.tokenString;

            if (!returnVal.useTemplate) {
                return tokenString;
            }
        }

        switch (token.type) {

        case "function":
            //-----------------FUNCTION------------------
            switch (token.value) {
            case "ARRAY":
                if (token.subtype.toString() === "start") {
                    tokenString = formatStr(replaceTokenTmpl(options.tmplFunctionStartArray), tokenString, indent, lineBreak);
                } else {
                    tokenString = formatStr(replaceTokenTmpl(options.tmplFunctionStopArray), tokenString, indent, lineBreak);
                }
                break;
            case "ARRAYROW":
                if (token.subtype.toString() === "start") {
                    tokenString = formatStr(replaceTokenTmpl(options.tmplFunctionStartArrayRow), tokenString, indent, lineBreak);
                } else {
                    tokenString = formatStr(replaceTokenTmpl(options.tmplFunctionStopArrayRow), tokenString, indent, lineBreak);
                }
                break;
            default:
                if (token.subtype.toString() === "start") {
                    tokenString = formatStr(replaceTokenTmpl(options.tmplFunctionStart), tokenString, indent, lineBreak);
                } else {
                    tokenString = formatStr(replaceTokenTmpl(options.tmplFunctionStop), tokenString, indent, lineBreak);
                }
                break;
            }
            break;
        case "operand":
            //-----------------OPERAND------------------
            switch (token.subtype.toString()) {
            case "error":
                tokenString = formatStr(replaceTokenTmpl(options.tmplOperandError), tokenString, indent, lineBreak);
                break;
            case "range":
                tokenString = formatStr(replaceTokenTmpl(options.tmplOperandRange), tokenString, indent, lineBreak);
                break;
            case "logical":
                tokenString = formatStr(replaceTokenTmpl(options.tmplOperandLogical), tokenString, indent, lineBreak);
            break;
            case "number":
                tokenString = formatStr(replaceTokenTmpl(options.tmplOperandNumber), tokenString, indent, lineBreak);
                break;
            case "text":
                tokenString = formatStr(replaceTokenTmpl(options.tmplOperandText), tokenString, indent, lineBreak);
                break;
            case "argument":
                tokenString = formatStr(replaceTokenTmpl(options.tmplArgument), tokenString, indent, lineBreak);
                break;
            default:
                break;
            }
            break;
        case "operator-infix":
            tokenString = formatStr(replaceTokenTmpl(options.tmplOperandOperatorInfix), tokenString, indent, lineBreak);
            break;
        case "logical":
            tokenString = formatStr(replaceTokenTmpl(options.tmplLogical), tokenString, indent, lineBreak);
            break;
        case "argument":
        	if(lastToken.type !== "argument"){
        		tokenString = formatStr(replaceTokenTmpl(options.tmplArgument), tokenString, indent, lineBreak);
            } else  {
            	tokenString = formatStr(replaceTokenTmpl("{{autoindent}}"+options.tmplArgument), tokenString, indent, lineBreak);
            }
            break;
        case "subexpression":
            if (token.subtype.toString() === "start") {
                tokenString = formatStr(replaceTokenTmpl(options.tmplSubexpressionStart), tokenString, indent, lineBreak);
            } else {
                tokenString = formatStr(replaceTokenTmpl(options.tmplSubexpressionStop), tokenString, indent, lineBreak);
            }
            break;
        default:

            break;
        }
        return tokenString;
    };

    /**
     *
     * @memberof excelFormulaUtilities.parser
     * @function
     * @param {string} formula
     * @param {object} options optional param
     *<pre>
     *   TEMPLATE VALUES
     *  {{autoindent}} - apply auto indent based on current tree level
     *  {{token}} - the named token such as FUNCTION_NAME or "string"
     *  {{autolinebreak}} - apply line break automatically. tests for next element only at this point
     *
     * Options include:
     *  tmplFunctionStart           - template for the start of a function, the {{token}} will contain the name of the function.
     *  tmplFunctionStop            - template for when the end of a function has been reached.
     *  tmplOperandError            - template for errors.
     *  tmplOperandRange            - template for ranges and variable names.
     *  tmplOperandLogical          - template for logical operators such as + - = ...
     *  tmplOperandNumber           - template for numbers.
     *  tmplOperandText             - template for text/strings.
     *  tmplArgument				- template for argument separators such as ,.
     *  tmplFunctionStartArray      - template for the start of an array.
     *  tmplFunctionStartArrayRow   - template for the start of an array row.
     *  tmplFunctionStopArrayRow    - template for the end of an array row.
     *  tmplFunctionStopArray       - template for the end of an array.
     *  tmplSubexpressionStart      - template for the sub expression start
     *  tmplSubexpressionStop       - template for the sub expression stop
     *  tmplIndentTab               - template for the tab char.
     *  tmplIndentSpace             - template for space char.
     *  autoLineBreak               - when rendering line breaks automatically which types should it break on. "TOK_SUBTYPE_STOP | TOK_SUBTYPE_START | TOK_TYPE_ARGUMENT"
     *  newLine                     - used for the {{autolinebreak}} replacement as well as some string parsing. if this is not set correctly you may get undesired results. usually \n for text or <br /> for html
     *  trim: true                  - trim the output.
     *	customTokenRender: null     - this is a call back to a custom token function. your call back should look like
     *                                EXAMPLE:
     *
     *                                    customTokenRender: function(tokenString, token, indent, lineBreak){
     *                                        var outStr = token,
     *                                            useTemplate = true;
     *                                        // In the return object "useTemplate" tells formatFormula()
     *                                        // weather or not to apply the template to what your return from the "tokenString".
     *                                        return {tokenString: outStr, useTemplate: useTemplate};
     *                                    }
     *
     *</pre>
     * @returns {string}
     */
    var formatFormula = excelFormulaUtilities.formatFormula = function (formula, options) {
        //Quick fix for trailing space after = sign
        formula = formula.replace(/^\s*=\s+/, "=");

        var isFirstToken = true,
            defaultOptions = {
                tmplFunctionStart: '{{autoindent}}{{token}}(\n',
                tmplFunctionStop: '\n{{autoindent}}{{token}})',
                tmplOperandError: ' {{token}}',
                tmplOperandRange: '{{autoindent}}{{token}}',
                tmplLogical: '{{token}}{{autolinebreak}}',
                tmplOperandLogical: '{{autoindent}}{{token}}',
                tmplOperandNumber: '{{autoindent}}{{token}}',
                tmplOperandText: '{{autoindent}}"{{token}}"',
                tmplArgument: '{{token}}\n',
                tmplOperandOperatorInfix: ' {{token}}{{autolinebreak}}',
                tmplFunctionStartArray: '',
                tmplFunctionStartArrayRow: '{',
                tmplFunctionStopArrayRow: '}',
                tmplFunctionStopArray: '',
                tmplSubexpressionStart: '{{autoindent}}(\n',
                tmplSubexpressionStop: '\n)',
                tmplIndentTab: '\t',
                tmplIndentSpace: ' ',
                autoLineBreak: 'TOK_TYPE_FUNCTION | TOK_TYPE_ARGUMENT | TOK_SUBTYPE_LOGICAL | TOK_TYPE_OP_IN ',
                newLine: '\n',
                //trim: true,
                customTokenRender: null,
                prefix: "",
                postfix: ""
            };

        if (options) {
            options = core.extend(true, defaultOptions, options);
        } else {
            options = defaultOptions;
        }

        var indentCount = 0;

        var indent_f = function () {
            var s = "",
                i = 0;

            for (; i < indentCount; i += 1) {
                s += options.tmplIndentTab;
            }
            return s;
        };

        var tokens = getTokens(formula, {
            asClass: true,
            language: root.excelFormulaUtilities.isEu ? "en-EU" : "en-US",
            preserveLanguage: true
        });

        var outputFormula = "";

        var autoBreakArray = options.autoLineBreak.replace(/\s/gi, "").split("|");

        //Tokens
        var isNewLine = true;

        var testAutoBreak = function (nextToken) {
            var i = 0;
            for (; i < autoBreakArray.length; i += 1) {
                if (nextToken !== null && typeof nextToken !== 'undefined' && (types[autoBreakArray[i]] === nextToken.type.toString() || types[autoBreakArray[i]] === nextToken.subtype.toString())) {
                    return true;
                }
            }
            return false;
        };

        var lastToken = null;

        while (tokens.moveNext()) {

            var token = tokens.current();
            var nextToken = tokens.next();

            if (token.subtype.toString() === types.TOK_SUBTYPE_STOP) {
                indentCount -= ((indentCount > 0) ? 1 : 0);
            }

            var matchBeginNewline = new RegExp('^' + options.newLine, ''),
                matchEndNewLine = new RegExp(options.newLine + '$', ''),
                autoBreak = testAutoBreak(nextToken),
                autoIndent = isNewLine,
                indent = autoIndent ? indent_f() : options.tmplIndentSpace,
                lineBreak = autoBreak ? options.newLine : "";

            // TODO this strips out spaces which breaks part of issue 28.  'Data Sheet' gets changed to DataSheet
            outputFormula += applyTokenTemplate(token, options, indent, lineBreak, options.customTokenRender, lastToken);

            if (token.subtype.toString() === types.TOK_SUBTYPE_START) {
                indentCount += 1;

            }

            isNewLine = autoBreak || matchEndNewLine.test(outputFormula);
            isFirstToken = false;

            lastToken = token;
        }

        outputFormula = options.prefix + trim(outputFormula) + options.postfix;

        return outputFormula;
    };
    /**
     * This function calls {@link excelFormulaUtilities.parser.formatFormula}
     *
     * @memberof excelFormulaUtilities.parser
     * @function
     * @param {string} formula
     * @param {object} options optional param
     */
    var formatFormulaHTML = excelFormulaUtilities.formatFormulaHTML = function (formula, options) {
        var tokRender = function(tokenStr, token, indent, lineBreak){
          var outStr = tokenStr;
          switch (token.type.toString()) {
            case types.TOK_TYPE_OPERAND:
              if(token.subtype === types.TOK_SUBTYPE_TEXT){
                outStr = tokenStr.replace(/</gi,"&lt;").replace(/>/gi,"&gt;");
              }
              break;
          }

          return {
              tokenString: outStr,
              useTemplate: true
          };
        }
        var defaultOptions = {
            tmplFunctionStart: '{{autoindent}}<span class="function">{{token}}</span><span class="function_start">(</span><br />',
            tmplFunctionStop: '<br />{{autoindent}}{{token}}<span class="function_stop">)</span>',
            tmplOperandText: '{{autoindent}}<span class="quote_mark">"</span><span class="text">{{token}}</span><span class="quote_mark">"</span>',
            tmplArgument: '{{token}}<br />',
            tmplSubexpressionStart: '{{autoindent}}(',
            tmplSubexpressionStop: ' )',
            tmplIndentTab: '<span class="tabbed">&nbsp;&nbsp;&nbsp;&nbsp;</span>',
            tmplIndentSpace: '&nbsp;',
            newLine: '<br />',
            autoLineBreak: 'TOK_TYPE_FUNCTION | TOK_TYPE_ARGUMENT | TOK_SUBTYPE_LOGICAL | TOK_TYPE_OP_IN ',
            trim: true,
            prefix: "=",
            customTokenRender: tokRender
        };

        if (options) {
            options = core.extend(true, defaultOptions, options);
        } else {
            options = defaultOptions;
        }

        return formatFormula(formula, options);
    }

    /**
     *
     * @memberof excelFormulaUtilities.convert
     * @function
     * @param {string} formula
     * @returns {string}
     */
    var formula2CSharp = excelFormulaUtilities.formula2CSharp = function (formula, options) {

        //Custom callback to format as c#
        var functionStack = [];

        var tokRender = function (tokenStr, token, indent, lineBreak) {
            var outStr = "",
                /*tokenString = (token.value.length === 0) ? "" : token.value.toString(),*/
                tokenString = tokenStr,
                directConversionMap = {
                    "=": "==",
                    "<>": "!=",
                    "MIN": "Math.min",
                    "MAX": "Math.max",
                    "ABS": "Math.abs",
                    "SUM": "",
                    "IF": "",
                    "&": "+",
                    "AND": "",
                    "OR": ""
                },
                currentFunctionOnStack = functionStack[functionStack.length - 1],
                useTemplate = false;

            switch (token.type.toString()) {

            case types.TOK_TYPE_FUNCTION:

                switch (token.subtype) {

                case types.TOK_SUBTYPE_START:

                    functionStack.push({
                        name: tokenString,
                        argumentNumber: 0
                    });
                    outStr = typeof directConversionMap[tokenString.toUpperCase()] === "string" ? directConversionMap[tokenString.toUpperCase()] : tokenString;
                    useTemplate = true;

                    break;

                case types.TOK_SUBTYPE_STOP:

                    useTemplate = true;
                    switch (currentFunctionOnStack.name.toLowerCase()) {
                    case "if":
                        outStr = currentFunctionOnStack.argumentNumber === 1 ? ":0)" : ")";
                        useTemplate = false;
                        break;
                    default:
                        outStr = typeof directConversionMap[tokenString.toUpperCase()] === "string" ? directConversionMap[tokenString.toUpperCase()] : tokenString;
                        break
                    }
                    functionStack.pop();
                    break;
                }

                break;

            case types.TOK_TYPE_ARGUMENT:
                switch (currentFunctionOnStack.name.toLowerCase()) {
                case "if":
                    switch (currentFunctionOnStack.argumentNumber) {
                    case 0:
                        outStr = "?";
                        break;
                    case 1:
                        outStr = ":";
                        break;
                    }
                    break;
                case "sum":
                    outStr = "+";
                    break;
                case "and":
                    outStr = "&&";
                    break;
                case "or":
                    outStr = "||";
                    break;
                default:
                    outStr = typeof directConversionMap[tokenString.toUpperCase()] === "string" ? directConversionMap[tokenString.toUpperCase()] : tokenString;
                    useTemplate = true;
                    break;
                }

                currentFunctionOnStack.argumentNumber += 1;

                break;

            case types.TOK_TYPE_OPERAND:

                switch (token.subtype) {

                    case types.TOK_SUBTYPE_RANGE:
                        //Assume '=' sign
                        if(!currentFunctionOnStack){
                          break;
                        }
                        switch (currentFunctionOnStack.name.toLowerCase()) {
                        // If in the sum function break out cell names and add
                        case "sum":
                            //TODO make sure this is working
                            if(RegExp(":","gi").test(tokenString)){
                                outStr = breakOutRanges(tokenString, "+");
                            } else {
                                outStr = tokenString;
                            }

                            break;
                        case "and":
                            //TODO make sure this is working
                            if(RegExp(":","gi").test(tokenString)){
                                outStr = breakOutRanges(tokenString, "&&");
                            } else {
                                outStr = tokenString;
                            }

                            break;
                        case "or":
                            //TODO make sure this is working
                            if(RegExp(":","gi").test(tokenString)){
                                outStr = breakOutRanges(tokenString, "||");
                            } else {
                                outStr = tokenString;
                            }

                            break;
                        // By Default return an array containing all cell names in array
                        default:
                            // Create array for ranges
                            if(RegExp(":","gi").test(tokenString)){
                                outStr = "[" + breakOutRanges(tokenString, ",") +"]";
                            } else {
                                outStr = tokenString;
                            }
                            //debugger;
                            break;
                        }

                        break;

                    default:
                        break;
                }

            default:
                if( outStr === "" ){
                    outStr = typeof directConversionMap[tokenString.toUpperCase()] === "string" ? directConversionMap[tokenString.toUpperCase()] : tokenString;
                }
                useTemplate = true;
                break;
            }

            return {
                tokenString: outStr,
                useTemplate: useTemplate
            };
        };

        var defaultOptions = {
            tmplFunctionStart: '{{token}}(',
            tmplFunctionStop: '{{token}})',
            tmplOperandError: '{{token}}',
            tmplOperandRange: '{{token}}',
            tmplOperandLogical: '{{token}}',
            tmplOperandNumber: '{{token}}',
            tmplOperandText: '"{{token}}"',
            tmplArgument: '{{token}}',
            tmplOperandOperatorInfix: '{{token}}',
            tmplFunctionStartArray: "",
            tmplFunctionStartArrayRow: "{",
            tmplFunctionStopArrayRow: "}",
            tmplFunctionStopArray: "",
            tmplSubexpressionStart: "(",
            tmplSubexpressionStop: ")",
            tmplIndentTab: "\t",
            tmplIndentSpace: " ",
            autoLineBreak: "TOK_SUBTYPE_STOP | TOK_SUBTYPE_START | TOK_TYPE_ARGUMENT",
            trim: true,
            customTokenRender: tokRender
        };

        if (options) {
            options = core.extend(true, defaultOptions, options);
        } else {
            options = defaultOptions;
        }

        var cSharpOutput = formatFormula(formula, options);
        return cSharpOutput;
    };

    /**
     * Both the csharp and javascript are the same when converted, this is just an alias for convert2CSharp. there are some subtle differences such as == vrs ===, this will be addressed in a later version.
     * @memberof excelFormulaUtilities.convert
     * @function
     * @param {string} formula
     * @returns {string}
     */
    var formula2JavaScript = excelFormulaUtilities.formula2JavaScript = function (formula, options) {
        return formula2CSharp(formula, options).replace('==', '===');
    }

    /**
     *
     * @memberof excelFormulaUtilities.convert
     * @function
     * @param {string} formula
     * @returns {string}
     */
    var formula2Python = excelFormulaUtilities.formula2Python = function (formula, options) {

        //Custom callback to format as c#
        var functionStack = [];

        var tokRender = function (tokenStr, token, indent, lineBreak) {
            var outStr = "",
                /*tokenString = (token.value.length === 0) ? "" : token.value.toString(),*/
                tokenString = tokenStr,
                directConversionMap = {
                    "=": "==",
                    "<>": "!=",
                    "MIN": "min",
                    "MAX": "max",
                    "ABS": "math.fabs",
                    "SUM": "",
                    "IF": "",
                    "&": "+",
                    "AND": "",
                    "OR": "",
                    "NOT": "!",
                    "TRUE": "True",
                    "FALSE": "False"
                },
                currentFunctionOnStack = functionStack[functionStack.length - 1],
                useTemplate = false;

            switch (token.type.toString()) {

            case types.TOK_TYPE_FUNCTION:

                switch (token.subtype) {

                case types.TOK_SUBTYPE_START:

                    functionStack.push({
                        name: tokenString,
                        argumentNumber: 0
                    });
                    outStr = typeof directConversionMap[tokenString.toUpperCase()] === "string" ? directConversionMap[tokenString.toUpperCase()] : tokenString;
                    useTemplate = true;

                    break;

                case types.TOK_SUBTYPE_STOP:

                    useTemplate = true;
                    switch (currentFunctionOnStack.name.toLowerCase()) {
                    case "if":
                        outStr = ",))[0]";
                        if (currentFunctionOnStack.argumentNumber === 1) {
                          outStr = " or (0" + outStr;
                        }
                        useTemplate = false;
                        break;
                    default:
                        outStr = typeof directConversionMap[tokenString.toUpperCase()] === "string" ? directConversionMap[tokenString.toUpperCase()] : tokenString;
                        break
                    }
                    functionStack.pop();
                    break;
                }

                break;

            case types.TOK_TYPE_ARGUMENT:
                switch (currentFunctionOnStack.name.toLowerCase()) {
                case "if":
                    switch (currentFunctionOnStack.argumentNumber) {
                    case 0:
                        outStr = " and (";
                        break;
                    case 1:
                        outStr = ",) or (";
                        break;
                    }
                    break;
                case "sum":
                    outStr = "+";
                    break;
                case "and":
                    outStr = " and ";
                    break;
                case "or":
                    outStr = " or ";
                    break;
                default:
                    outStr = typeof directConversionMap[tokenString.toUpperCase()] === "string" ? directConversionMap[tokenString.toUpperCase()] : tokenString;
                    useTemplate = true;
                    break;
                }

                currentFunctionOnStack.argumentNumber += 1;

                break;

            case types.TOK_TYPE_OPERAND:

                switch (token.subtype) {

                    case types.TOK_SUBTYPE_RANGE:
                        //Assume '=' sign
                        if(!currentFunctionOnStack){
                          break;
                        }

                        if (RegExp("true|false", "gi").test(tokenString)) {
                          outStr = typeof directConversionMap[tokenString.toUpperCase()] === "string" ? directConversionMap[tokenString.toUpperCase()] : tokenString;
                          break;
                        }

                        switch (currentFunctionOnStack.name.toLowerCase()) {
                        // If in the sum function break out cell names and add
                        case "sum":
                            //TODO make sure this is working
                            if(RegExp(":","gi").test(tokenString)){
                                outStr = breakOutRanges(tokenString, "+");
                            } else {
                                outStr = tokenString;
                            }

                            break;
                        case "and":
                            //TODO make sure this is working
                            if(RegExp(":","gi").test(tokenString)){
                                outStr = breakOutRanges(tokenString, " and ");
                            } else {
                                outStr = tokenString;
                            }

                            break;
                        case "or":
                            //TODO make sure this is working
                            if(RegExp(":","gi").test(tokenString)){
                                outStr = breakOutRanges(tokenString, " or ");
                            } else {
                                outStr = tokenString;
                            }

                            break;
                        // By Default return an array containing all cell names in array
                        default:
                            // Create array for ranges
                            if(RegExp(":","gi").test(tokenString)){
                                outStr = "[" + breakOutRanges(tokenString, ",") +"]";
                            } else {
                                outStr = tokenString;
                            }
                            //debugger;
                            break;
                        }

                        break;

                    default:
                        break;
                }

            default:
                if( outStr === "" ){
                    outStr = typeof directConversionMap[tokenString.toUpperCase()] === "string" ? directConversionMap[tokenString.toUpperCase()] : tokenString;
                }
                useTemplate = true;
                break;
            }

            return {
                tokenString: outStr,
                useTemplate: useTemplate
            };
        };

        var defaultOptions = {
            tmplFunctionStart: '{{token}}(',
            tmplFunctionStop: '{{token}})',
            tmplOperandError: '{{token}}',
            tmplOperandRange: '{{token}}',
            tmplOperandLogical: '{{token}}',
            tmplOperandNumber: '{{token}}',
            tmplOperandText: '"{{token}}"',
            tmplArgument: '{{token}}',
            tmplOperandOperatorInfix: '{{token}}',
            tmplFunctionStartArray: "",
            tmplFunctionStartArrayRow: "{",
            tmplFunctionStopArrayRow: "}",
            tmplFunctionStopArray: "",
            tmplSubexpressionStart: "(",
            tmplSubexpressionStop: ")",
            tmplIndentTab: "\t",
            tmplIndentSpace: " ",
            autoLineBreak: "TOK_SUBTYPE_STOP | TOK_SUBTYPE_START | TOK_TYPE_ARGUMENT",
            trim: true,
            customTokenRender: tokRender
        };

        if (options) {
            options = core.extend(true, defaultOptions, options);
        } else {
            options = defaultOptions;
        }

        var pythonOutput = formatFormula(formula, options);

        return pythonOutput;
    };

    excelFormulaUtilities.getTokens = getTokens;

}(window|| module.exports || {}));
