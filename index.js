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
                funcArgs = (js.substringAfter(funcName).substringBefore("')") + "')").substringAfter(",");
                if (funcArgs[0] == "'") {
                    funcArgs = funcArgs.split("'")[1];
                    return [funcArgs, true];
                } else {
                    funcArgs = "(" + funcArgs.substringAfter("(");
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
        script += `\n${decoderFunName}${getKeyArgs}`;
        return (script);
    }
    
    return getPassword(js);
}
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
                funcArgs = (js.substringAfter(funcName).substringBefore("')") + "')").substringAfter(",");
                if (funcArgs[0] == "'") {
                    funcArgs = funcArgs.split("'")[1];
                    return [funcArgs, true];
                } else {
                    funcArgs = "(" + funcArgs.substringAfter("(");
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
        script += `\n${decoderFunName}${getKeyArgs}`;
        return (script);
    }
    
    return getPassword(js);
}
