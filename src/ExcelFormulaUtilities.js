/*
 * This has been based on Ewbi's Go Calc Prototype Excel Formula Parser. [http://ewbi.blogs.com/develops/2004/12/excel_formula_p.html]
 *
 * Copyright 2011, Josh Bennett
 * Licensed under the MIT LICENSE
 * https://github.com/joshatjben/excelFormulaUtilitiesJS/blob/master/LICENSE.txt
 */
(function () {
    var excelFormulaUtilities = window.excelFormulaUtilities = window.excelFormulaUtilities || {},
        parser = excelFormulaUtilities.parser = {},
        // window.excelFormulaUtilities.parser
        convert = excelFormulaUtilities.convert = {},
        core = window.excelFormulaUtilities.core,
        formatStr = window.excelFormulaUtilities.string.formatStr,
        trim = window.excelFormulaUtilities.string.trim,

        types = {},
        TOK_TYPE_NOOP = types.TOK_TYPE_NOOP = "noop",
        TOK_TYPE_OPERAND = types.TOK_TYPE_OPERAND = "operand",
        TOK_TYPE_FUNCTION = types.TOK_TYPE_FUNCTION = "function",
        TOK_TYPE_SUBEXPR = types.TOK_TYPE_SUBEXPR = "subexpression",
        TOK_TYPE_ARGUMENT = types.TOK_TYPE_ARGUMENT = "argument",
        TOK_TYPE_OP_PRE = types.TOK_TYPE_OP_PRE = "operator-prefix",
        TOK_TYPE_OP_IN = types.TOK_TYPE_OP_IN = "operator-infix",
        TOK_TYPE_OP_POST = types.TOK_TYPE_OP_POST = "operator-postfix",
        TOK_TYPE_WSPACE = types.TOK_TYPE_WSPACE = "white-space",
        TOK_TYPE_UNKNOWN = types.TOK_TYPE_UNKNOWN = "unknown",

        TOK_SUBTYPE_START = types.TOK_SUBTYPE_START = "start",
        TOK_SUBTYPE_STOP = types.TOK_SUBTYPE_STOP = "stop",

        TOK_SUBTYPE_TEXT = types.TOK_SUBTYPE_TEXT = "text",
        TOK_SUBTYPE_NUMBER = types.TOK_SUBTYPE_NUMBER = "number",
        TOK_SUBTYPE_LOGICAL = types.TOK_SUBTYPE_LOGICAL = "logical",
        TOK_SUBTYPE_ERROR = types.TOK_SUBTYPE_ERROR = "error",
        TOK_SUBTYPE_RANGE = types.TOK_SUBTYPE_RANGE = "range",

        TOK_SUBTYPE_MATH = types.TOK_SUBTYPE_MATH = "math",
        TOK_SUBTYPE_CONCAT = types.TOK_SUBTYPE_CONCAT = "concatenate",
        TOK_SUBTYPE_INTERSECT = types.TOK_SUBTYPE_INTERSECT = "intersect",
        TOK_SUBTYPE_UNION = types.TOK_SUBTYPE_UNION = "union";

    /**
     * @class
     */

    function F_token(value, type, subtype) {
        this.value = value;
        this.type = type;
        this.subtype = subtype;
    }

    /**
     * @class
     */

    function F_tokens() {

        this.items = [];

        this.add = function (value, type, subtype) {
            if (!subtype) {
                subtype = "";
            }
            var token = new F_token(value, type, subtype);
            this.addRef(token);
            return token;
        };
        this.addRef = function (token) {
            this.items.push(token);
        };

        this.index = -1;
        this.reset = function () {
            this.index = -1;
        };
        this.BOF = function () {
            return (this.index <= 0);
        };
        this.EOF = function () {
            return (this.index >= (this.items.length - 1));
        };
        this.moveNext = function () {
            if (this.EOF()) {
                return false;
            }
            this.index += 1;
            return true;
        };
        this.current = function () {
            if (this.index === -1) {
                return null;
            }
            return (this.items[this.index]);
        };
        this.next = function () {
            if (this.EOF()) {
                return null;
            }
            return (this.items[this.index + 1]);
        };
        this.previous = function () {
            if (this.index < 1) {
                return null;
            }
            return (this.items[this.index - 1]);
        };

    }

    function F_tokenStack() {

        this.items = [];

        this.push = function (token) {
            this.items.push(token);
        };
        this.pop = function (name) {
            var token = this.items.pop();
            return (new F_token(name || "", token.type, TOK_SUBTYPE_STOP));
        };

        this.token = function () {
            return ((this.items.length > 0) ? this.items[this.items.length - 1] : null);
        };
        this.value = function () {
            return ((this.token()) ? this.token().value.toString() : "");
        };
        this.type = function () {
            return ((this.token()) ? this.token().type.toString() : "");
        };
        this.subtype = function () {
            return ((this.token()) ? this.token().subtype.toString() : "");
        };

    }

    function getTokens(formula) {

        var tokens = new F_tokens(),
            tokenStack = new F_tokenStack(),

            offset = 0,

            currentChar = function () {
                return formula.substr(offset, 1);
            },
            doubleChar = function () {
                return formula.substr(offset, 2);
            },
            nextChar = function () {
                return formula.substr(offset + 1, 1);
            },
            EOF = function () {
                return (offset >= formula.length);
            },

            token = "",

            inString = false,
            inPath = false,
            inRange = false,
            inError = false,
            regexSN = /^[1-9]{1}(\.[0-9]+)?E{1}$/;

        while (formula.length > 0) {
            if (formula.substr(0, 1) === " ") {
                formula = formula.substr(1);
            } else {
                if (formula.substr(0, 1) === "=") {
                    formula = formula.substr(1);
                }
                break;
            }
        }



        while (!EOF()) {

            // state-dependent character evaluation (order is important)
            // double-quoted strings
            // embeds are doubled
            // end marks token
            if (inString) {
                if (currentChar() === "\"") {
                    if (nextChar() === "\"") {
                        token += "\"";
                        offset += 1;
                    } else {
                        inString = false;
                        tokens.add(token, TOK_TYPE_OPERAND, TOK_SUBTYPE_TEXT);
                        token = "";
                    }
                } else {
                    token += currentChar();
                }
                offset += 1;
                continue;
            }

            // single-quoted strings (links)
            // embeds are double
            // end does not mark a token
            if (inPath) {
                if (currentChar() === "'") {
                    if (nextChar() === "'") {
                        token += "'";
                        offset += 1;
                    } else {
                        inPath = false;
                    }
                } else {
                    token += currentChar();
                }
                offset += 1;
                continue;
            }

            // bracked strings (range offset or linked workbook name)
            // no embeds (changed to "()" by Excel)
            // end does not mark a token
            if (inRange) {
                if (currentChar() === "]") {
                    inRange = false;
                }
                token += currentChar();
                offset += 1;
                continue;
            }

            // error values
            // end marks a token, determined from absolute list of values
            if (inError) {
                token += currentChar();
                offset += 1;
                if ((",#NULL!,#DIV/0!,#VALUE!,#REF!,#NAME?,#NUM!,#N/A,").indexOf("," + token + ",") !== -1) {
                    inError = false;
                    tokens.add(token, TOK_TYPE_OPERAND, TOK_SUBTYPE_ERROR);
                    token = "";
                }
                continue;
            }

            // scientific notation check
            if (("+-").indexOf(currentChar()) !== -1) {
                if (token.length > 1) {
                    if (token.match(regexSN)) {
                        token += currentChar();
                        offset += 1;
                        continue;
                    }
                }
            }

            // independent character evaulation (order not important)
            // establish state-dependent character evaluations
            if (currentChar() === "\"") {
                if (token.length > 0) {
                    // not expected
                    tokens.add(token, TOK_TYPE_UNKNOWN);
                    token = "";
                }
                inString = true;
                offset += 1;
                continue;
            }

            if (currentChar() === "'") {
                if (token.length > 0) {
                    // not expected
                    tokens.add(token, TOK_TYPE_UNKNOWN);
                    token = "";
                }
                inPath = true;
                offset += 1;
                continue;
            }

            if (currentChar() === "[") {
                inRange = true;
                token += currentChar();
                offset += 1;
                continue;
            }

            if (currentChar() === "#") {
                if (token.length > 0) {
                    // not expected
                    tokens.add(token, TOK_TYPE_UNKNOWN);
                    token = "";
                }
                inError = true;
                token += currentChar();
                offset += 1;
                continue;
            }

            // mark start and end of arrays and array rows
            if (currentChar() === "{") {
                if (token.length > 0) {
                    // not expected
                    tokens.add(token, TOK_TYPE_UNKNOWN);
                    token = "";
                }
                tokenStack.push(tokens.add("ARRAY", TOK_TYPE_FUNCTION, TOK_SUBTYPE_START));
                tokenStack.push(tokens.add("ARRAYROW", TOK_TYPE_FUNCTION, TOK_SUBTYPE_START));
                offset += 1;
                continue;
            }

            if (currentChar() === ";") {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = "";
                }
                tokens.addRef(tokenStack.pop());
                tokens.add(",", TOK_TYPE_ARGUMENT);
                tokenStack.push(tokens.add("ARRAYROW", TOK_TYPE_FUNCTION, TOK_SUBTYPE_START));
                offset += 1;
                continue;
            }

            if (currentChar() === "}") {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = "";
                }
                tokens.addRef(tokenStack.pop("ARRAYROWSTOP"));
                tokens.addRef(tokenStack.pop("ARRAYSTOP"));
                offset += 1;
                continue;
            }

            // trim white-space
            if (currentChar() === " ") {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = "";
                }
                tokens.add("", TOK_TYPE_WSPACE);
                offset += 1;
                while ((currentChar() === " ") && (!EOF())) {
                    offset += 1;
                }
                continue;
            }

            // multi-character comparators
            if ((",>=,<=,<>,").indexOf("," + doubleChar() + ",") !== -1) {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = "";
                }
                tokens.add(doubleChar(), TOK_TYPE_OP_IN, TOK_SUBTYPE_LOGICAL);
                offset += 2;
                continue;
            }

            // standard infix operators
            if (("+-*/^&=><").indexOf(currentChar()) !== -1) {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = "";
                }
                tokens.add(currentChar(), TOK_TYPE_OP_IN);
                offset += 1;
                continue;
            }

            // standard postfix operators
            if (("%").indexOf(currentChar()) !== -1) {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = "";
                }
                tokens.add(currentChar(), TOK_TYPE_OP_POST);
                offset += 1;
                continue;
            }

            // start subexpression or function
            if (currentChar() === "(") {
                if (token.length > 0) {
                    tokenStack.push(tokens.add(token, TOK_TYPE_FUNCTION, TOK_SUBTYPE_START));
                    token = "";
                } else {
                    tokenStack.push(tokens.add("", TOK_TYPE_SUBEXPR, TOK_SUBTYPE_START));
                }
                offset += 1;
                continue;
            }

            // function, subexpression, array parameters
            if (currentChar() === ",") {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = "";
                }
                if (tokenStack.type() !== TOK_TYPE_FUNCTION) {
                    tokens.add(currentChar(), TOK_TYPE_OP_IN, TOK_SUBTYPE_UNION);
                } else {
                    tokens.add(currentChar(), TOK_TYPE_ARGUMENT);
                }
                offset += 1;
                continue;
            }

            // stop subexpression
            if (currentChar() === ")") {
                if (token.length > 0) {
                    tokens.add(token, TOK_TYPE_OPERAND);
                    token = "";
                }
                tokens.addRef(tokenStack.pop());
                offset += 1;
                continue;
            }

            // token accumulation
            token += currentChar();
            offset += 1;

        }

        // dump remaining accumulation
        if (token.length > 0) {
            tokens.add(token, TOK_TYPE_OPERAND);
        }

        // move all tokens to a new collection, excluding all unnecessary white-space tokens
        var tokens2 = new F_tokens();

        while (tokens.moveNext()) {

            token = tokens.current();

            if (token.type.toString() === TOK_TYPE_WSPACE) {
                var doAddToken = (tokens.BOF()) || (tokens.EOF());
                //if ((tokens.BOF()) || (tokens.EOF())) {}
                doAddToken = doAddToken && (((tokens.previous().type.toString() === TOK_TYPE_FUNCTION) && (tokens.previous().subtype.toString() === TOK_SUBTYPE_STOP)) || ((tokens.previous().type.toString() === TOK_TYPE_SUBEXPR) && (tokens.previous().subtype.toString() === TOK_SUBTYPE_STOP)) || (tokens.previous().type.toString() === TOK_TYPE_OPERAND));
                //else if (!(
                //	   ((tokens.previous().type === TOK_TYPE_FUNCTION) && (tokens.previous().subtype == TOK_SUBTYPE_STOP)) 
                //	|| ((tokens.previous().type == TOK_TYPE_SUBEXPR) && (tokens.previous().subtype == TOK_SUBTYPE_STOP)) 
                //	|| (tokens.previous().type == TOK_TYPE_OPERAND))) 
                //  {}
                doAddToken = doAddToken && (((tokens.next().type.toString() === TOK_TYPE_FUNCTION) && (tokens.next().subtype.toString() === TOK_SUBTYPE_START)) || ((tokens.next().type.toString() === TOK_TYPE_SUBEXPR) && (tokens.next().subtype.toString() === TOK_SUBTYPE_START)) || (tokens.next().type.toString() === TOK_TYPE_OPERAND));
                //else if (!(
                //	((tokens.next().type == TOK_TYPE_FUNCTION) && (tokens.next().subtype == TOK_SUBTYPE_START)) 
                //	|| ((tokens.next().type == TOK_TYPE_SUBEXPR) && (tokens.next().subtype == TOK_SUBTYPE_START)) 
                //	|| (tokens.next().type == TOK_TYPE_OPERAND))) 
                //	{} 
                //else { tokens2.add(token.value, TOK_TYPE_OP_IN, TOK_SUBTYPE_INTERSECT)};
                if (doAddToken) {
                    tokens2.add(token.value.toString(), TOK_TYPE_OP_IN, TOK_SUBTYPE_INTERSECT);
                }
                continue;
            }

            tokens2.addRef(token);

        }

        // switch infix "-" operator to prefix when appropriate, switch infix "+" operator to noop when appropriate, identify operand 
        // and infix-operator subtypes, pull "@" from in front of function names
        while (tokens2.moveNext()) {

            token = tokens2.current();

            if ((token.type.toString() === TOK_TYPE_OP_IN) && (token.value.toString() === "-")) {
                if (tokens2.BOF()) {
                    token.type = TOK_TYPE_OP_PRE.toString();
                } else if (((tokens2.previous().type.toString() === TOK_TYPE_FUNCTION) && (tokens2.previous().subtype.toString() === TOK_SUBTYPE_STOP)) || ((tokens2.previous().type.toString() === TOK_TYPE_SUBEXPR) && (tokens2.previous().subtype.toString() === TOK_SUBTYPE_STOP)) || (tokens2.previous().type.toString() === TOK_TYPE_OP_POST) || (tokens2.previous().type.toString() === TOK_TYPE_OPERAND)) {
                    token.subtype = TOK_SUBTYPE_MATH.toString();
                } else {
                    token.type = TOK_TYPE_OP_PRE.toString();
                }
                continue;
            }

            if ((token.type.toString() === TOK_TYPE_OP_IN) && (token.value.toString() === "+")) {
                if (tokens2.BOF()) {
                    token.type = TOK_TYPE_NOOP.toString();
                } else if (((tokens2.previous().type.toString() === TOK_TYPE_FUNCTION) && (tokens2.previous().subtype.toString() === TOK_SUBTYPE_STOP)) || ((tokens2.previous().type.toString() === TOK_TYPE_SUBEXPR) && (tokens2.previous().subtype.toString() === TOK_SUBTYPE_STOP)) || (tokens2.previous().type.toString() === TOK_TYPE_OP_POST) || (tokens2.previous().type.toString() === TOK_TYPE_OPERAND)) {
                    token.subtype = TOK_SUBTYPE_MATH.toString();
                } else {
                    token.type = TOK_TYPE_NOOP.toString();
                }
                continue;
            }

            if ((token.type.toString() === TOK_TYPE_OP_IN) && (token.subtype.length === 0)) {
                if (("<>=").indexOf(token.value.substr(0, 1)) !== -1) {
                    token.subtype = TOK_SUBTYPE_LOGICAL.toString();
                } else if (token.value.toString() === "&") {
                    token.subtype = TOK_SUBTYPE_CONCAT.toString();
                } else {
                    token.subtype = TOK_SUBTYPE_MATH.toString();
                }
                continue;
            }

            if ((token.type.toString() === TOK_TYPE_OPERAND) && (token.subtype.length === 0)) {
                if (isNaN(parseFloat(token.value))) {
                    if ((token.value.toString() === 'TRUE') || (token.value.toString() === 'FALSE')) {
                        token.subtype = TOK_SUBTYPE_LOGICAL.toString();
                    } else {
                        token.subtype = TOK_SUBTYPE_RANGE.toString();
                    }
                } else {
                    token.subtype = TOK_SUBTYPE_NUMBER.toString();
                }

                continue;
            }

            if (token.type.toString() === TOK_TYPE_FUNCTION) {
                if (token.value.substr(0, 1) === "@") {
                    token.value = token.value.substr(1).toString();
                }
                continue;
            }

        }

        tokens2.reset();

        // move all tokens to a new collection, excluding all noops
        tokens = new F_tokens();

        while (tokens2.moveNext()) {
            if (tokens2.current().type.toString() !== TOK_TYPE_NOOP) {
                tokens.addRef(tokens2.current());
            }
        }

        tokens.reset();

        return tokens;
    }


    var parseFormula = parser.parseFormula = function (inputID, outputID) {


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

            var tokens = getTokens(formula);

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

                if (token.subtype === TOK_SUBTYPE_STOP) {
                    indentCount -= ((indentCount > 0) ? 1 : 0);
                }

                tokensHtml += "<tr>";

                tokensHtml += "<td class='token'>" + (tokens.index + 1) + "</td>";

                tokensHtml += "<td class='token'>" + token.type + "</td>";
                tokensHtml += "<td class='token'>" + ((token.subtype.length === 0) ? "&nbsp;" : token.subtype.toString()) + "</td>";
                tokensHtml += "<td class='token'>" + ((token.value.length === 0) ? "&nbsp;" : token.value).split(" ").join("&nbsp;") + "</td>";
                tokensHtml += "<td class='token'>" + indent() + ((token.value.length === 0) ? "&nbsp;" : token.value).split(" ").join("&nbsp;") + "</td>";

                tokensHtml += "</tr>";

                if (token.subtype === TOK_SUBTYPE_START) {
                    indentCount += 1;
                }

            }

            tokensHtml += "</table>";

            document.getElementById(outputID).innerHTML = tokensHtml;

            formulaControl.select();
            formulaControl.focus();

        };

    var applyTokenTemplate = function (token, options, indent, lineBreak, override) {

            var indt = indent;

            var replaceTokenTmpl = function (inStr) {
                    return inStr.replace(/\{\{token\}\}/gi, "{0}").replace(/\{\{autoindent\}\}/gi, "{1}").replace(/\{\{autolinebreak\}\}/gi, "{2}");
                };

            var tokenString = ((token.value.length === 0) ? " " : token.value.toString()).split(" ").join("").toString();

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
                    tokenString = formatStr(replaceTokenTmpl(options.tmplFunctionStartArray), tokenString, indt, lineBreak);
                    break;
                case "ARRAYROW":
                    tokenString = formatStr(replaceTokenTmpl(options.tmplFunctionStartArrayRow), tokenString, indt, lineBreak);
                    break;
                default:
                    if (token.subtype.toString() === "start") {
                        tokenString = formatStr(replaceTokenTmpl(options.tmplFunctionStart), tokenString, indt, lineBreak);
                    } else {
                        tokenString = formatStr(replaceTokenTmpl(options.tmplFunctionStop), tokenString, indt, lineBreak);
                    }
                    break;
                }
                break;
            case "operand":
                //-----------------OPERAND------------------
                switch (token.subtype.toString()) {
                case "error":
                    tokenString = formatStr(replaceTokenTmpl(options.tmplOperandError), tokenString, indt, lineBreak);
                    break;
                case "range":
                    tokenString = formatStr(replaceTokenTmpl(options.tmplOperandRange), tokenString, indt, lineBreak);
                    break;
                case "logical":
                    tokenString = formatStr(replaceTokenTmpl(options.tmplOperandLogical), tokenString, indt, lineBreak);
                    break;
                case "number":
                    tokenString = formatStr(replaceTokenTmpl(options.tmplOperandNumber), tokenString, indt, lineBreak);
                    break;
                case "text":
                    tokenString = formatStr(replaceTokenTmpl(options.tmplOperandText), tokenString, indt, lineBreak);
                    break;
                case "argument":
                    tokenString = formatStr(replaceTokenTmpl(options.tmplArgument), tokenString, indt, lineBreak);
                    break;
                default:
                    break;
                }
                break;
            case "argument":
                tokenString = formatStr(replaceTokenTmpl(options.tmplArgument), tokenString, indt, lineBreak);
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
     * Any options starting with 'tmpl' are template strings, which can be plain text and have acess to 
     *  {{autoindent}} - apply auto indent based on current tree level
     *  {{token}} - the named token such as FUNCTION_NAME or "string"
     *
     * Options include:
     *  tmplFunctionStart           - template for the start of a function, the {{token}} will contain the name of the function.
     *  tmplFunctionStop            - template for when the end of a function has been reached.
     *  tmplOperandError            - template for errors.
     *  tmplOperandRange            - template for ranges and variable names.
     *  tmplOperandLogical          - template for logical operators such as + - = ...
     *  tmplOperandNumber           - template for numbers.
     *  tmplOperandText             - template for text/strings.
     *  tmplArgument				- template for argument seperators such as ,.
     *  tmplFunctionStartArray      - template for the start of an array.
     *  tmplFunctionStartArrayRow   - template for the start of an array row.
     *  tmplFunctionStopArrayRow    - template for the end of an array row.
     *  tmplFunctionStopArray       - template for the end of an array.
     *  tmplIndentTab               - template for the tab char.
     *  tmplIndentSpace             - template for space char.
     *  autoLineBreak               - when rendering line breaks automaticly which types should it break on. "TOK_SUBTYPE_STOP | TOK_SUBTYPE_START | TOK_TYPE_ARGUMENT"
     *  trim: true                  - trim the output.
     *	customTokenRender: null     - this is a call back to a custom token function. your call back should look like
     *                                EXAMPLE:
     *                                 
     *                                    customTokenRender: function(tokenString, token, indent, linbreak){
     *                                        var outstr = token,
     *                                            useTemplate = true;
     *                                        // In the return object "useTemplate" tells formatFormula() 
     *                                        // weather or not to apply the template to what your return from the "tokenString".
     *                                        return {tokenString: outstr, useTemplate: useTemplate}; 
     *                                    }
     *                                    
     *</pre>
     * @returns {string}
     */
    var formatFormula = parser.formatFormula = function (formula, options) {
            var isFirstToken = true,
                defaultOptions = {
                    tmplFunctionStart: "\n{{autoindent}}{{token}}\n{{autoindent}}(\n",
                    tmplFunctionStop: "\n{{autoindent}}{{token}})",
                    tmplOperandError: "{{token}}",
                    tmplOperandRange: "{{autoindent}}{{token}}",
                    tmplOperandLogical: "{{token}}",
                    tmplOperandNumber: "{{autoindent}}{{token}}",
                    tmplOperandText: '{{autoindent}}"{{token}}"',
                    tmplArgument: "{{token}}\n",
                    tmplFunctionStartArray: "",
                    tmplFunctionStartArrayRow: "{",
                    tmplFunctionStopArrayRow: "}",
                    tmplFunctionStopArray: "",
                    tmplIndentTab: "\t",
                    tmplIndentSpace: " ",
                    autoLineBreak: "TOK_SUBTYPE_STOP | TOK_SUBTYPE_START | TOK_TYPE_ARGUMENT",
                    trim: true,
                    customTokenRender: null
                };

            if (options) {
                options = core.extend(true, defaultOptions, options);
            } else {
                options = defaultOptions;
            }

            var indentCount = 0;

            var indent = function () {
                    var s = "",
                        i = 0;
                    for (; i < indentCount; i += 1) {
                        s += options.tmplIndentTab;
                    }
                    return s;
                };

            var tokens = getTokens(formula);

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

            while (tokens.moveNext()) {

                var token = tokens.current();
                var nextToken = tokens.next();

                if (token.subtype.toString() === TOK_SUBTYPE_STOP) {
                    indentCount -= ((indentCount > 0) ? 1 : 0);
                }

                var matchBeginNewline = /^\n/;

                var autoBreak = testAutoBreak(nextToken);

                var autoIndent = isNewLine;

                var indt = autoIndent ? indent() : options.tmplIndentSpace;
                var lineBreak = autoBreak ? "\n" : "";

                outputFormula += applyTokenTemplate(token, options, indt, lineBreak, options.customTokenRender);

                if (token.subtype.toString() === TOK_SUBTYPE_START) {
                    indentCount += 1;

                }

                isNewLine = autoBreak || (/\n$/).test(outputFormula);
                isFirstToken = false;
            }

            return options.trim ? trim(outputFormula) : outputFormula;
        };
	/**
     * This function calls {@link excelFormulaUtilities.parser.formatFormula}
	 *
     * @memberof excelFormulaUtilities.parser
     * @function
     * @param {string} formula
     * @param {object} options optional param
	 */
	var formatFormulaHTML = parser.formatFormulaHTML = function(formula){
				var options = {
                    tmplFunctionStart: '<br />\n{{autoindent}}<span class="function">{{token}}</span><br />\n{{autoindent}}<span class="function_start">(</span><br />\n',
                    tmplFunctionStop: '<br />\n{{autoindent}}<span class="function_stop">{{token}})</span>',
                    tmplOperandError: '<span class="error">{{token}}</span>',
                    tmplOperandRange: '{{autoindent}}<span class="range">{{token}}</span>',
                    tmplOperandLogical: '<span class="logical">{{token}}</span>',
                    tmplOperandNumber: '{{autoindent}}<span class="range">{{token}}</span>',
                    tmplOperandText: '{{autoindent}}<span class="text">"{{token}}"</span>',
                    tmplArgument: '<span class="argument">{{token}}</span><br />\n',
                    tmplFunctionStartArray: "",
                    tmplFunctionStartArrayRow: '<span calss="array_row_start">{</span>',
                    tmplFunctionStopArrayRow: '<span calss="array_row_stop">}',
                    tmplFunctionStopArray: "",
                    tmplIndentTab: "&nbsp;&nbsp;&nbsp;&nbsp;",
                    tmplIndentSpace: "&nbsp;",
                    autoLineBreak: "TOK_SUBTYPE_STOP | TOK_SUBTYPE_START | TOK_TYPE_ARGUMENT",
                    trim: true,
                    customTokenRender: null
                };
				
				return formatFormula(formula, options);
	}
		
    /**
     *
     * @memberof excelFormulaUtilities.convert
     * @function
     * @param {string} formula
     * @returns {string}
     */
    var formula2CSharp = convert.formula2CSharp = function (formula) {

            //Custom callback to format as c#
            var functionStack = [];

            var tokRender = function (tokenStr, token, indent, linbreak) {
                    var outstr = "",
                        //tokenString = (token.value.length === 0) ? "" : token.value.toString(),
                        tokenString = tokenStr,
                        directConversionMap = {
                            "=": "==",
                            "<>": "!=",
                            "MIN": "Math.Min",
                            "MAX": "Math.Max",
                            "ABS": "Math.ABS"
                        },
                        currentFunctionOnStack = functionStack[functionStack.length - 1],
                        useTemplate = false;

                    switch (token.type.toString()) {

                    case TOK_TYPE_FUNCTION:

                        switch (token.subtype) {

                        case TOK_SUBTYPE_START:
                            if ((/^if$/gi).test(tokenString)) {
                                functionStack.push({
                                    name: tokenString,
                                    isIf: true,
                                    argumentNumber: 0
                                });
                                outstr = "(";
                            } else {
                                functionStack.push({
                                    name: tokenString,
                                    isIf: false,
                                    argumentNumber: 0
                                });
                                outstr = directConversionMap[tokenString] || tokenString;
                                useTemplate = true;
                            }
                            break;
                        case TOK_SUBTYPE_STOP:

                            useTemplate = true;
                            if (currentFunctionOnStack.isIf) {
                                outstr = ")";

                                useTemplate = false;
                            } else {
                                outstr = directConversionMap[tokenString] || tokenString;
                            }
                            functionStack.pop();
                            break;
                        }

                        break;

                    case TOK_TYPE_ARGUMENT:
                        if (currentFunctionOnStack.isIf) {
                            switch (currentFunctionOnStack.argumentNumber) {
                            case 0:
                                outstr = "?";
                                break;
                            case 1:
                                outstr = ":";
                                break;
                            }
                        } else {
                            outstr = directConversionMap[tokenString] || tokenString;
                            useTemplate = true;
                        }

                        currentFunctionOnStack.argumentNumber += 1;

                        break;

                    default:
                        outstr = directConversionMap[tokenString] || tokenString;
                        useTemplate = true;
                        break;
                    }

                    return {
                        tokenString: outstr,
                        useTemplate: useTemplate
                    };
                };

            var cSharpOutput = formatFormula(
            formula, {
                tmplFunctionStart: '{{token}}(',
                tmplFunctionStop: '{{token}})',
                tmplOperandError: '{{token}}',
                tmplOperandRange: '{{token}}',
                tmplOperandLogical: '{{token}}',
                tmplOperandNumber: '{{token}}',
                tmplOperandText: '"{{token}}"',
                tmplArgument: '{{token}}',
                tmplFunctionStartArray: "",
                tmplFunctionStartArrayRow: "{",
                tmplFunctionStopArrayRow: "}",
                tmplFunctionStopArray: "",
                tmplIndentTab: "\t",
                tmplIndentSpace: " ",
                autoLineBreak: "TOK_SUBTYPE_STOP | TOK_SUBTYPE_START | TOK_TYPE_ARGUMENT",
                trim: true,
                customTokenRender: tokRender
            });
            return cSharpOutput;
        };
}());