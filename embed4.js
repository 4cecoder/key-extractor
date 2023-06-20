const fs = require("fs");

function extractKeyComp(js) {
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
        // T0
        cryptoVar = js.substringBeforeLast("CryptoJS[").substringBeforeLast("document").substringAfterLast(",").substringBefore("=");
                               
        // T0(T,T2('qlzr',tp(0x1751,0xea2),'59','McsaV',gM(0xef8,'g0x$')))
        cryptoFunc = `${cryptoVar}(` + js.substringAfterLast(`=>${cryptoVar}(`).substringBefore("()").substringBeforeLast(",");
                                
        // T2('qlzr',tp(0x1751,0xea2),'59','McsaV',gM(0xef8,'g0x$'))
        keyFunc = cryptoFunc.substringAfter(",").substringBeforeLast(")");

        // T1=T=>Array[gh(0x1106,0xe2a)](T),T2=(...T)=>T[gh(0x796,0xf5b)]('')
        keyArray = js.substringAfterLast("CryptoJS[").substringAfterLast("return[];}),").substringBeforeLast("...").substringBeforeLast(",");

        // T2=(...T)=>T[gh(0x796,0xf5b)]('')
        keyArraySplit = keyArray.substringAfterLast("),")
        
        // gh(0x796,0xf5b)
        keyArrayFunc = keyArray.substringBeforeLast("]").substringAfterLast("[");
    
        // 'qlzr',tp(0x1751,0xea2),'59','McsaV',gM(0xef8,'g0x$')
        keyFuncParams = keyFunc.substringAfter("(").substringBeforeLast(")");
        
        // [ "'qlzr'", 'tp(0x1751,0xea2)', "'59'", "'McsaV'", "gM(0xef8,'g0x$')" ]
        splitKeyParams = splitParams(keyFuncParams);

        console.log(getPasswordFromJs(splitKeyParams, keyArrayFunc));
    }
    
    function getPasswordFromJs(splitKeyParams, keyArrayFunc) {
        let outputString = '';

        if (keyArrayFunc === "'join'") {
            for(let i = 0; i < splitKeyParams.length; i++) {
                const text = splitKeyParams[i]
                const indexes = [text.indexOf('('), text.indexOf(','), text.indexOf(')')]
                if (indexes[0] > -1 && indexes[0] < indexes[1] && indexes[1] < indexes[2]) {
                    keyParentFunc = getFunction(text.substringBefore("("), js, true);
                    keyConstructFuncName = keyParentFunc.substringAfter("var").substringBefore(";").substringAfter("=").substringBefore("()");
                    keyConstructFunction = getFunction(keyConstructFuncName, js, true);

                    keyParentFuncBody = keyParentFunc.substringAfter(`${keyConstructFuncName}();`).substringBeforeLast("},");
                    keyReturnFunc1Name = keyParentFuncBody.substringAfter("function(").substringBefore(",");
                    keyReturnFunc1Body = getFunction(keyReturnFunc1Name, js, true);
                    
                    keyReturnFunc2Name = keyParentFuncBody.substringBefore(`[${keyReturnFunc1Name}]`).substringAfterLast("=");
                    keyReturnFunc2Body = getFunction(keyReturnFunc2Name, js, true);
                    
                    // Eval each k)ey function and return the value individually!
                    const outputValue = evalScript(keyReturnFunc2Body + keyReturnFunc1Body + keyConstructFunction + keyParentFunc + `\n${text}`);
                    outputString += outputValue;
                }
            }
            
            if (outputString != '') {
              console.log(outputString);
            } else {
              return splitKeyParams.map(x => x.slice(1, -1)).join('');
            }
        } else {
            for(let i = 0; i < splitKeyParams.length; i++) {
                const text = splitKeyParams[i]
                const indexes = [text.indexOf('('), text.indexOf(','), text.indexOf(')')]
                if (indexes[0] > -1 && indexes[0] < indexes[1] && indexes[1] < indexes[2]) {
                    keyParentFunc = getFunction(text.substringBefore("("), js, true);
                    keyConstructFuncName = keyParentFunc.substringAfter("var").substringBefore(";").substringAfter("=").substringBefore("()");
                    keyConstructFunction = getFunction(keyConstructFuncName, js, true);

                    keyParentFuncBody = keyParentFunc.substringAfter(`${keyConstructFuncName}();`).substringBeforeLast("},");
                    keyReturnFunc1Name = keyParentFuncBody.substringAfter("function(").substringBefore(",");
                    keyReturnFunc1Body = getFunction(keyReturnFunc1Name, js, true);
                    
                    keyReturnFunc2Name = keyParentFuncBody.substringBefore(`[${keyReturnFunc1Name}]`).substringAfterLast("=");
                    keyReturnFunc2Body = getFunction(keyReturnFunc2Name, js, true);
                    
                    // Eval each key function and return the value individually!
                    const outputValue = evalScript(keyReturnFunc2Body + keyReturnFunc1Body + keyConstructFunction + keyParentFunc + `\n${text}`);
                    outputString += outputValue;
                }
            }
            
            return splitKeyParams.map(x => x.slice(1, -1)).join('');
        }
    }

    function evalScript(funcBody) {
      try {
        return eval(funcBody);
      } catch (error) {
        console.error('Error occurred during script evaluation:', error);
        return undefined;
      }
    }

    return getPassword(js);
}

fs.readFile('player2.js', 'utf8', function(err, data) {
    console.log(extractKeyComp(data));
});

