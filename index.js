function extractKeyComp(id, js) {
    String.prototype.substringAfter = function substringAfter(toFind) {
        let str = this;
        let index = str.indexOf(toFind);
        return index == -1 ? "" : str.substring(index + toFind.length);
    }

    String.prototype.substringBefore = function substringBefore(toFind) {
        let str = this;
        let index = str.indexOf(toFind);
        return index == -1 ? "" : str.substring(0, index);
    }

    String.prototype.substringAfterLast = function substringAfterLast(toFind) {
        let str = this;
        let index = str.lastIndexOf(toFind);
        return index == -1 ? "" : str.substring(index + toFind.length);
    }

    String.prototype.substringBeforeLast = function substringBeforeLast(toFind) {
        let str = this;
        let index = str.lastIndexOf(toFind);
        return index == -1 ? "" : str.substring(0, index);
    }

    String.prototype.onlyOnce = function substringBeforeLast(substring) {
        let str = this;
        return str.lastIndexOf(substring) == str.indexOf(substring);
    }

    function findClosingBraces(str) {
        let output = "";
        let stack = [];
        let brackets = ["(", "["];
        let closingBrackets = [")", "]"];
        let braces = ["\'", "\""];
        let escapedBraces = ["\\\'", "\\\""];
        let lastChar = "";
        for (let i = 0; i < str.length; i++) {
            output += str[i];

            if (brackets.includes(str[i]) && !braces.includes(stack[stack.length - 1])) {
                stack.push(str[i]);
            }
            else if (closingBrackets.includes(str[i]) && !braces.includes(stack[stack.length - 1])) {
                stack.pop();
            }
            else if (braces.includes(str[i])) {
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

    function getPassword(js) {

        let regex = /\.\.\..+?=/g;
        let funcName = null;
        while (match = regex.exec(js)) {
            let tempFuncName = "_0x" + js.substring(0, match.index).substringBeforeLast("=").substringAfterLast("_0x");
            if (!js.onlyOnce(tempFuncName)) {
                funcName = tempFuncName;
                break;
            }
        }
        if (funcName == null) {
            let funcName = js.substringAfter("CryptoJS[").substringBefore(";return").substringAfterLast(",").replace(")", "");
            let otherParams = "[" + js.substringAfter(`${funcName}=[`).substringBefore("('')") + "('')";
            otherParams = otherParams.split(",");
            let decodeFunc = null;
            for (let i = 1; i < otherParams.length; i++) {
                if (otherParams[i][0] == "_") {
                    decodeFunc = findFirstBrace(otherParams[i]);
                    break;
                }
            }
            otherParams = otherParams.join(",");
            funcArgs = {
                "paramString": otherParams,
                "decFuncName": decodeFunc,
                "justEval": true
            };
        } else {


            let otherParams;
            let concatFunc, transformFunc;
            if (id == 4) {
                otherParams = findClosingBraces(js.substringAfter(`${funcName}`));
            } else {
                // let baseString = js.substringAfter(`${funcName}=(`);
                // concatFunc = findClosingBraces("(" + baseString);
                // otherParams = "eval" + findClosingBraces(baseString.substringAfter("eval"));
                // concatFunc = funcName + "=" + concatFunc + "=>" + otherParams + ";";

                otherParams = findClosingBraces(js.substringAfter(`=${funcName}`));
                let keyVarName = "_0x" + js.substringBefore(`=${funcName}`).substringAfterLast("_0x");
                let transformFuncTemp = "[" + js.substringAfter(`${keyVarName}[`);
                transformFunc = findClosingBraces(transformFuncTemp);

                let replaceFunc = findClosingBraces(transformFuncTemp.substringAfter(transformFunc));
                let replaceFuncTemp = replaceFunc.split(",");
                // let decodeFunc = null;
                // for (let i = 0; i < replaceFuncTemp.length; i++) {
                //     if (replaceFuncTemp[i][0] == "_") {
                //         decodeFunc = findFirstBrace(replaceFuncTemp[i]);
                //         break;
                //     }
                // }

                transformFunc = transformFunc + replaceFunc;


            }

            if (id == 6) {
                otherParams = otherParams.substring(1, otherParams.length - 1);
                funcArgs = {
                    "paramString": otherParams,
                    "decFuncName": decodeFunc
                };
                funcArgs.transform = true;
                funcArgs.transformFunc = transformFunc;
                // funcArgs.splice = false;
                // funcArgs.concatFunc = concatFunc;
                // funcArgs.concatFuncName = funcName;
            } else {
                otherParams = otherParams.split(",");
                let decodeFunc = findFirstBrace(otherParams[0]);

                for (let i = 1; i < otherParams.length; i++) {
                    if (otherParams[i][0] != "'") {
                        decodeFunc = findFirstBrace(otherParams[i]);
                    }
                }

                otherParams = otherParams.join(",");
                otherParams = otherParams.substring(1, otherParams.length - 1);
                funcArgs = {
                    "paramString": otherParams,
                    "decFuncName": decodeFunc
                };
            }

        }

        return [getPasswordFromJS(js, funcArgs), false];
    }

    function getPasswordFromJS(js, getKeyArgs) {
        var script = js.substringBefore(",(!function") + ")";

        var decoderFunName = js.substringBefore("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=").substringBeforeLast("function").substringBeforeLast("function").substringAfterLast("return").trim().split("=")[0];
        var decoderFunPrefix = "function " + decoderFunName;
        var decoderFunBody = decoderFunPrefix + "(" + js.substringAfter(decoderFunPrefix + "(");
        var decoderFunSuffix = `,${decoderFunName}(`;
        var decoderFunCall = decoderFunSuffix + decoderFunBody
            .substringAfter(decoderFunSuffix)
            .substringBefore(");}") + ");}";
        decoderFunBody = decoderFunBody.substringBefore(decoderFunCall) + decoderFunCall;
        if (!script.substring(0, 20).includes("=[")) {
            var superArrName = decoderFunBody.substringAfter("=").substringBefore(";")
            var superArrPrefix = "function " + superArrName
            var superArrSuffix = "return " + superArrName + ";}"
            var superArrBody = superArrPrefix + js.substringAfter(superArrPrefix)
                .substringBefore(superArrSuffix) + superArrSuffix
            script += "\n" + superArrBody + "\n"
        }

        script += "\n" + decoderFunBody
        decoderFunc = decoderFunName;

        if (typeof getKeyArgs == "string") {
            script += `\n${decoderFunName}${getKeyArgs}`;
        } else if (getKeyArgs.justEval) {
            script += `var ${getKeyArgs.decodeFunc} = ${decoderFunName};`;
            script += getKeyArgs.paramString.replaceAll(getKeyArgs.decFuncName, decoderFunName);
        } else {
            if (getKeyArgs.splice) {
                script += getKeyArgs.concatFunc;
                script += getKeyArgs.concatFuncName + `(${getKeyArgs.paramString.replaceAll(getKeyArgs.decFuncName, decoderFunName)})`;
            } else if (getKeyArgs.transform) {
                script += "\nlet tempArray = [";
                script += getKeyArgs.paramString.replaceAll(getKeyArgs.decFuncName, decoderFunName);
                script += "];";
                script += "let key = tempArray.join('');";
                script += "key" + getKeyArgs.transformFunc.replaceAll(getKeyArgs.decFuncName, decoderFunName);
            } else {
                script += "\nlet tempArray = [";
                script += getKeyArgs.paramString.replaceAll(getKeyArgs.decFuncName, decoderFunName);
                script += "];";
                script += "tempArray.join('')";
            }

        }


        return (script);
    }


    return getPassword(js);
}
