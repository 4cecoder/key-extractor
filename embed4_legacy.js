const fs = require("fs");

function extractKeyComp(id, js) {
    // #### Helper Functions ####
    /*
    Returns a substring after the first occurence of [toFind].
    If the string does not contain the [toFind] returns empty string
    */
    String.prototype.substringAfter = function substringAfter(toFind) {
        let str = this;
        let index = str.indexOf(toFind);
        return index == -1 ? "" : str.substring(index + toFind.length);
    }

    /*
    Returns a substring before the first occurrence of [toFind].
    If the string does not contain the [toFind] returns empty string
    */
    String.prototype.substringBefore = function substringBefore(toFind) {
        let str = this;
        let index = str.indexOf(toFind);
        return index == -1 ? "" : str.substring(0, index);
    }

    /*
    Returns a substring after the last occurence of [toFind].
    If the string does not contain the [toFind] returns the empty string
    */
    String.prototype.substringAfterLast = function substringAfterLast(toFind) {
        let str = this;
        let index = str.lastIndexOf(toFind);
        return index == -1 ? "" : str.substring(index + toFind.length);
    }

    /*
    Returns a substring before the last occurence of [toFind].
    If the string does not contain the [toFind] returns the empty string
    */
    String.prototype.substringBeforeLast = function substringBeforeLast(toFind) {
        let str = this;
        let index = str.lastIndexOf(toFind);
        return index == -1 ? "" : str.substring(0, index);
    }

    /*
    The findClosingBraces function takes a string as input and 
    returns a substring containing the characters from the beginning 
    of the input string up to the closing brackets or braces.
    */
    function findClosingBraces(str) {
        let output = "";
        let stack = [];
        let brackets = ["(", "[", "{"];
        let closingBrackets = [")", "]", "}"];
        let braces = ["\'", "\""];
        let escapedBraces = ["\\\'", "\\\""];
        let lastChar = "";
        for (let i = 0; i < str.length; i++) {
            output += str[i];

            if (brackets.includes(str[i]) && !braces.includes(stack[stack.length - 1])) {
                stack.push(str[i]);
            } else if (closingBrackets.includes(str[i]) && !braces.includes(stack[stack.length - 1])) {
                stack.pop();
            } else if (braces.includes(str[i])) {
                if (lastChar == "\\" && escapedBraces.includes(`\\${str[i]}`)) {

                } else {
                    if (str[i] == stack[stack.length - 1]) {
                        stack.pop();
                    } else {
                        stack.push(str[i]);
                    }
                }
            }

            lastChar = str[i];


            if (stack.length == 0) {
                break;
            }
        }
        return output;

    }

    function findFirstBrace(str) {
        let output = "";
        for (let i = 0; i < str.length; i++) {
            if (str[i] == "(") {
                break;
            }
            output += str[i];

        }

        return output;
    }

    function getFunction(funcName, js, recur = true) {
        let functionsAdded = [];
        let string = "";

        if (functionsAdded.includes(funcName)) {
            return "";
        }

        functionsAdded.push(funcName);

        let funcNameWFunction = "function " + funcName;
        let jsTemp = "(" + js.substringAfter(funcNameWFunction + "(");

        if (jsTemp == "(") {
            return "";
        }

        let params = findClosingBraces(jsTemp);
        jsTemp = jsTemp.substringAfter(params);

        let funcBody = findClosingBraces(jsTemp);

        if (recur) {
            let otherFunc = findFirstBrace(funcBody.substringAfter("return "));
            string += getFunction(otherFunc, js);
        }

        string += (funcNameWFunction + params + funcBody)
        return string
    }

    function hasChars(source, chars) {
        return new Set(source.split('').filter(c => chars.includes(c))).size == chars.length;
    }

    function splitParams(string) {
        let comma_locations = [0];
        let parren_stack = [];
        let quoting = false;

        for (let i = 0; i < string.length; i++) {
            let found = string.charAt(i);
            if (found === "'") {
                quoting = !quoting; /* toggle */
            }
            if (quoting) {
                continue;
            }

            if (found === '(' || found === '{' || found === '[') {
                parren_stack.push(found);
                continue;
            }

            if (found === ')' || found === '}' || found === ']') {
                let tmp = parren_stack.pop();
                if (!tmp) {
                    throw new Error("Expected openning parenthesis");
                }
                switch ([tmp, found].join('')) {
                    case '()':
                    case '{}':
                    case '[]':
                        continue;
                    default:
                        throw new Error(`Unbalanced Parentesis [${tmp}, ${found}]`);
                }
            }

            if (parren_stack.length === 0 && found === ',') {
                comma_locations.push(i);
                continue;
            }
        }
        comma_locations.push(string.length);

        if (parren_stack.length !== 0) {
            throw new Error("Unbalanced Parentesis");
        }

        let captures = [];

        for (let i = 0; i < comma_locations.length - 1; i++) {
            let c = string.substring(comma_locations[i], comma_locations[i + 1]).trimEnd();
            if (c.charAt(0) === ',') {
                c = c.substring(1).trimStart();
            }
            captures.push(c);
        }

        return captures
    }

    function getPassword(js) {
        let result = "";
        let script = "";

        cryptoVar = js.substringBeforeLast("document").substringAfterLast(",").substringBefore("=");
        cryptoFunc = `${cryptoVar}(` + js.substringAfterLast(`=>${cryptoVar}(`).substringBefore("()").substringBeforeLast(",");
        keyFunc = cryptoFunc.substringAfter(",").substringBeforeLast(")");

        keyArray = js.substringAfterLast("CryptoJS[").substringAfterLast("return[];}),").substringBeforeLast("...").substringBeforeLast(",");
        keyArraySplit = keyArray.substringAfterLast("),")
        keyArrayFunc = keyArray.substringBeforeLast("]").substringAfterLast("[");

        keyfuncparams = keyFunc.substringAfter("(").substringBeforeLast(")");
        splitkeyparams = splitParams(keyfuncparams);

        if (keyArrayFunc === "'join'") {
            /* Implment logic for parsing the keyFunc variable 
            and all the params for a function call and 
            if so go to that function and get the return value
            */

            
            for (let i = 0; i < splitkeyparams.length; i++) {
                const element = splitkeyparams[i];
                if (hasChars(element, '(,)') == true) {
                    keyElem = element.substringBefore("("); // Found an element with all three characters
                    keyParentFunc = getFunction(keyElem, js, true);
                    keyConstructFuncName = keyParentFunc.substringAfter("var").substringBefore(";").substringAfter("=").substringBefore("()");
                    keyConstructFunction = getFunction(keyConstructFuncName, js, true);

                    keyParentFuncBody = keyParentFunc.substringAfter(`${keyConstructFuncName}();`).substringBeforeLast("},")
                    keyReturnFunc1Name = keyParentFuncBody.substringAfter("function(").substringBefore(",");
                    keyReturnFunc1 = getFunction(keyReturnFunc1Name, js, true);

                    keyReturnFunc2Name = keyParentFuncBody.substringBefore(`[${keyReturnFunc1Name}]`).substringAfterLast("=");
                    keyReturnFunc2 = getFunction(keyReturnFunc2Name, js, true);

                    script += keyReturnFunc2 + keyReturnFunc1 + keyConstructFunction + keyParentFunc + keyArraySplit + `\n${keyFunc}`
                    console.log(script);

                    return script
                }
            }
        } else {
            for (let i = 0; i < splitkeyparams.length; i++) {
                const element = splitkeyparams[i];
                if (hasChars(element, '(,)') === true) {
                    keyElem2 = element.substringBefore("(");
                    keyParentFunc2 = getFunction(keyElem2, js, true);
                    keyConstructFuncName2 = keyParentFunc2.substringAfter("var").substringBefore(";").substringAfter("=").substringBefore("()");
                    keyConstructFunction2 = getFunction(keyConstructFuncName2, js, true);
  
                    keyParentFuncBody2 = keyParentFunc2.substringAfter(`${keyConstructFuncName2}();`).substringBeforeLast("},");
                    keyReturnFunc1Name2 = keyParentFuncBody2.substringAfter("function(").substringBefore(",");
                    keyReturnFunc12 = getFunction(keyReturnFunc1Name2, js, true);
  
                    keyReturnFunc2Name2 = keyParentFuncBody2.substringBefore(`[${keyReturnFunc1Name2}]`).substringAfterLast("=");
                    keyReturnFunc22 = getFunction(keyReturnFunc2Name2, js, true);
  
                    const executionValue = keyReturnFunc22 + keyReturnFunc12 + keyConstructFunction2 + keyParentFunc2 + `\n${keyArraySplit}` + `\n${keyFunc}`;
                    console.log(executionValue);
                } else {
                        console.log(keyfuncparams);
                    }
                }
            }
        }
    return getPassword(js);

    }


fs.readFile('player.js', 'utf8', function(err, data) {
    console.log(eval(extractKeyComp(4, data)));
});