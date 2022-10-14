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

    function findClosingBraces(str){
        let output = "";
        let stack = [];
        let braces = ["\'","\""];
        for(let i = 0; i < str.length; i++){
            output += str[i]; 

            if(str[i] == "(" && !braces.includes(stack[stack.length - 1])){
                stack.push("(");
            }
            else if(str[i] == ")" && !braces.includes(stack[stack.length - 1])){
                stack.pop();
            }
            else if(braces.includes(str[i])){
                if(str[i] == stack[stack.length - 1]){
                    stack.pop();
                }else{
                    stack.push(str[i]);
                }
            }

            if(stack.length == 0){
                break;
            }
        }

        return output;
    }

    function getPassword(js) {
        var passVar = js.substringAfter("CryptoJS[")
            .substringBefore("),")
            .substringAfterLast(",");

        var passValue = js.substringAfter(`const ${passVar}=`, "").substringBefore(";", "");
        if (!passValue == "") {
            if (passValue.startsWith("'")) {
                passValue = passValue.substring(1, passValue.length - 1);
                return [passValue, true];
            }

            return [getPasswordFromJS(js, "(" + passValue.substringAfter("(")), false];
        }

        var jsEnd = js.substringBefore("jwplayer(").substringBeforeLast("var");
        var suspiciousPass = jsEnd.substringBeforeLast("'").substringAfterLast("'")
        if (suspiciousPass.length < 8) {
            let funcArgs;
            if (id == 4) {
                let funcName = "0x" + js.substringBeforeLast("=($(document)['on']").substringAfterLast("0x");
                funcArgs = (js.substringAfter(funcName).substringAfter(","));
                if (funcArgs[0] == "'") {
                    funcArgs = funcArgs.split("'")[1];
                    return [funcArgs, true];
                } else {
                    funcArgs = findClosingBraces("(" + js.substringAfter(funcName).substringAfter(",").substringAfter("("));
                    funcArgs = "(" + funcArgs.substringAfter("(");
                    if(funcArgs.includes("_0x") && (funcArgs.includes("(_0x") || funcArgs.indexOf("(") == funcArgs.indexOf("('"))){
                        let tempM = "(" + ((js.substringAfter(funcName)).substringAfter(",").substringAfter("("));
                        tempM = findClosingBraces(tempM);
                        tempM = tempM.substring(1, tempM.length - 1);



                        let decFuncName = "_0x" + tempM.substringAfter("_0x").substringBefore("(");
                        funcArgs = {
                            "paramString" : tempM,
                            "decFuncName" : decFuncName
                        };
                    }

                }
            } else {
                funcArgs = jsEnd.substringAfterLast("(0x").substringBefore(")");
            }
            return [getPasswordFromJS(js, funcArgs), false];
        }
        return [suspiciousPass, true];
    }

    function getPasswordFromJS(js, getKeyArgs) {

        var script = js.substringBefore(",(!function") + ")";

        var decoderFunName = js.substringBefore("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=").substringBeforeLast("function").substringBeforeLast("function").substringAfterLast("return").trim().split("=")[0];
        var decoderFunPrefix = "function " + decoderFunName;
        var decoderFunBody = decoderFunPrefix +  "(" + js.substringAfter(decoderFunPrefix + "(");
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
        if(typeof getKeyArgs == "string"){
            script += `\n${decoderFunName}${getKeyArgs}`;
        }else{
             
            script += "\n[";    
            script += getKeyArgs.paramString.replace(getKeyArgs.decFuncName,decoderFunName);
            script += "].join('');";
        }
        return (script);
    }
    
    return getPassword(js);
}
