function extractKeyComp(id, js) {
    let functionsAdded = [];
    function getFunction(funcName, js, recur = true){
        let string = "";
        if(functionsAdded.includes(funcName)){
            return "";
        }
        functionsAdded.push(funcName);
        let funcNameWFunction = "function " + funcName;
        let jsTemp = "(" + js.substringAfter(funcNameWFunction + "(");

        if(jsTemp == "("){
            return "";
        }
        let params = findClosingBraces(jsTemp);
        jsTemp = jsTemp.substringAfter(params);
        let funcBody = findClosingBraces(jsTemp);
        
        if(recur){
            let otherFunc = findFirstBrace(funcBody.substringAfter("return "));
            string += getFunction(otherFunc, js);
        }
        string += (funcNameWFunction + params + funcBody);
        return string;
    }

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
        let brackets = ["(", "[", "{"];
        let closingBrackets = [")", "]", "}"];
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

    function findFirstBraceEmpty(str) {
        let output = "";
        let check = false;
        for (let i = 0; i < str.length; i++) {
            if (str[i] == "(") {
                check = true;
                break;
            }
            output += str[i];

        }

        if(check){
            return output;
        }else{
            return "";
        }
    }

    function getPassword(js) {

        let regex = /\.\.\..+?=/g;
        let funcName = null;
        let funcArgs;
        let transformDecodeFunc;
        while (match = regex.exec(js)) {
            let tempFuncName = "_0x" + js.substring(0, match.index).substringBeforeLast("=").substringAfterLast("_0x");
            if (js.includes(tempFuncName + "(")) {
                funcName = tempFuncName;
                break;
            }
        }



        let otherParams;
        let decFuncName2;
        let concatFunc, transformFunc, keyVarName;
        if (id == 4) {
            otherParams = findClosingBraces(js.substringAfter(`${funcName}`));
        } else {
            let cryptoVar = "(" + js.substringAfter("CryptoJS[").substringBefore("return").substringAfterLast("(");
            cryptoVar = cryptoVar.substringAfterLast(",").substringBefore(")");

            let cryptoFuncName = js.substringBeforeLast(cryptoVar).substringAfterLast("const").substringBefore("=").trim();
            let replaceVar = js.substringAfter(`${cryptoFuncName}(`).substringBefore(")").substringAfter(",");

            let replaceFuncName = replaceVar;

            let replaceTemp = js.indexOf(`${replaceFuncName}=${replaceFuncName}`);
            let keyValue, replaceFunc, decFuncName = "";
            if(replaceTemp > -1){
                let replaceString = `${replaceFuncName}=${replaceFuncName}` + findClosingBraces(js.substringAfter(`${replaceFuncName}=${replaceFuncName}`));
                replaceFunc = findClosingBraces(js.substring(replaceTemp + replaceString.length));
                decFuncName = "_0x" + replaceFunc.substringAfter("_0x").substringBefore("(");

                let keyVar = "_0x" + js.substringBefore(replaceFuncName).substringBeforeLast("=").substringAfterLast("_0x").trim();
                let keyFunc = findClosingBraces("(" + js.substringAfter(keyVar + "("))
                keyValue = keyFunc.substringAfter(",");
            }else{
                let replaceTemp = js.indexOf(`${replaceFuncName}=`);
                let jsTemp = js.substring(replaceTemp + `${replaceFuncName}=`.length);
                keyValue = findClosingBraces(jsTemp);
                jsTemp = jsTemp.substring(keyValue.length);
                let replaceFuncTitle = findClosingBraces(jsTemp);
                jsTemp = jsTemp.substring(replaceFuncTitle.length);
                replaceFunc = findClosingBraces(jsTemp);

            }
            if(keyValue[0] == "'"){
            }else{
                keyValue = keyValue.substringBeforeLast(")");
                decFuncName2 = "_0x" + keyValue.substringAfter("_0x").substringBefore("(");
            }

            funcArgs = {
                "keyValue": keyValue,
                "replaceFunc": replaceFunc,
                "decFuncName": decFuncName,
                "decFuncName2": decFuncName2

            };

        }

        if (id == 6) {
            funcArgs.transform = true;
        } else {
            otherParams = otherParams.substring(1, otherParams.length - 1);
            otherParams = otherParams.split(",");
            let decodeFunc = findFirstBrace(otherParams[0]);
            for (let i = 0; i < otherParams.length; i++) {
                if (otherParams[i][0] != "'") {
                    decodeFunc = findFirstBrace(otherParams[i]);
                }
            }

            otherParams = otherParams.join(",");
            funcArgs = {
                "paramString": otherParams,
                "decFuncName": decodeFunc
            };
        }



        return [getPasswordFromJS(js, funcArgs), false];
    }

    function getPasswordFromJS(js, getKeyArgs) {
        // return;
        let script = "";
        
        let anonWhileString = "(" + js.substringBefore("while(!![])").substringAfterLast("(function(");
        let anonParam = findClosingBraces(anonWhileString);
        anonWhileString = js.substringAfter(anonParam);
        let anonBody = findClosingBraces(anonWhileString);
        let anonCall = findClosingBraces(js.substringAfter(anonBody).trim());
        let anonFunc = "(function" + anonParam + anonBody + ")" + anonCall; 

        // console.log(anonFunc);
        let arrayFuncName;
        for(let func of anonFunc.split("return ")){
            let funcName = findFirstBrace(func);
            if(funcName.trim() != ""){
                let f = getFunction(funcName, js, false);
                script += f;
                arrayFuncName = "_0x" + f.substringBefore("()").substringAfterLast("_0x");
                script += "\n";
            }
        }

        script += anonFunc;
        script = getFunction(arrayFuncName, js, false) + ";" + script + ";";

       

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

                let decodeArray = [];
                for(let decode of getKeyArgs.replaceFunc.split(",")){
                    let k = findFirstBraceEmpty(decode);
                    if(k != ""){
                        decodeArray.push(k);
                    }
                }

                for(let decode of decodeArray){
                    script += getFunction(decode,js) + ";";
                }
                script += getFunction(getKeyArgs.decFuncName2 ,js) + ";";
                script += getFunction(getKeyArgs.decFuncName ,js)  + ";";
                script += "\n" + getKeyArgs.keyValue + ".replace" + getKeyArgs.replaceFunc;
            } else {
                let decodeArray = [];
                for(let decode of getKeyArgs.paramString.split(",")){
                    let k = findFirstBraceEmpty(decode);
                    if(k != ""){
                        decodeArray.push(k);
                    }
                }
                for(let decode of decodeArray){
                    script += getFunction(decode,js) + ";";
                }
                script += "\nlet tempArray = [";
                script += getKeyArgs.paramString;
                script += "];";
                script += "tempArray.join('')";
            }

        }


        return (script);
    }


    return getPassword(js);
}
