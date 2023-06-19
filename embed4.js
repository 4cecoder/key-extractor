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

    function getPassword(js) {
        // A
        cryptoVar = js.substringBeforeLast("document").substringAfterLast(",").substringBefore("=");
                               
        // A(K,g('SUwdL0Ty','fixRe'))
        cryptoFunc = `${cryptoVar}(` + js.substringAfterLast(`=>${cryptoVar}(`).substringBefore("()").substringBeforeLast(",");
                                
        // g('SUwdL0Ty','fixRe')
        keyFunc = cryptoFunc.substringAfter(",").substringBeforeLast(")");

        // s=K=>Array['isArray'](K),g=(...K)=>K[QM('!V&v',0x37d)]('')
        keyArray = js.substringAfterLast("CryptoJS[").substringAfterLast("return[];}),").substringBeforeLast("...").substringBeforeLast(",");

        // g=(...k)=>K[QM('!V&v', 0x37d)]('')
        keyArraySplit = keyArray.substringAfterLast("),")
        
        // QM('!V&v', 0x37d)
        keyArrayFunc = keyArray.substringBeforeLast("]").substringAfterLast("[");
    }
    
    return getPassword(js);
}

fs.readFile('player.js', 'utf8', function(err, data) {
    console.log(extractKeyComp(4, data));
});

