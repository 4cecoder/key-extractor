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

    if (functionsAdded.includes(funcName)) { return ""; }

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
    cryptoVar = js.substringBeforeLast("CryptoJS[").substringBeforeLast("document").substringAfterLast(",").substringBefore("=");
    cryptoFunc = `${cryptoVar}(` + js.substringAfterLast(`=>${cryptoVar}(`).substringBefore("()").substringBeforeLast(",");
    keyFunc = cryptoFunc.substringAfter(",").substringBeforeLast(")");
    keyArray = js.substringAfterLast("CryptoJS[").substringAfterLast("return[];}),").substringBeforeLast("...").substringBeforeLast(",").substringAfterLast("),");

    /* TODO: 
     change (keyArray) UH=(...U)=>U[RO('XP)a',0x15c9)]('') to 
     var UH=(...c)=>c['join'](''); 
    */

    keyFuncParams = keyFunc.substringAfter("(").substringBeforeLast(")");
    let splitKeyParams = splitParams(keyFuncParams);

    console.log(getPasswordFromJs(js));
  }

  function getPasswordFromJs(js) {
    let script = "";

    let anonWhileString1 = "(" + js.substringBefore("while(!![])").substringAfterLast("(function(");
    let anonParam = findClosingBraces(anonWhileString1);
    let anonWhileString2 = js.substringAfter(anonWhileString1).substringBefore(");function").substringBeforeLast("(");
    let anonCall = js.substringAfter(anonWhileString2).substringBefore(");function");
    let anonFunc = "(function" + anonWhileString1 + anonWhileString2 + ")" + anonCall;

    for(let func of anonFunc.split("return ")) {
      let funcName = findFirstBrace(func);
      if(funcName.trim() != "") {
        let f = getFunction(funcName, js, false);
        script += f;

        arrayFuncName = f.substringBefore("()").substringAfterLast("=");
        script += "\n"
      }
    }

    script += anonFunc;
    script = getFunction(arrayFuncName, js, false) + ";" + script + ";";
  }


  return getPassword(js);
}

fs.readFile('player.js', 'utf8', function(err, data) {
  try {
    console.log(extractKeyComp(data));
  } catch (error) {
    console.error(err)
  }
});

