var _LS = {};
_LS.whitespace = /\s/;
_LS.isFunction = /^function/;
_LS.validName = /^[a-zA-Z_$][0-9a-zA-Z_$]*$/;
_LS.validFunction = /^[a-zA-Z_$][0-9a-zA-Z_$.]*$/;
_LS.macros = {};

_LS.syntaxTree = function(code) {
    if (/^\s*\(/.test(code) === false) throw _LS.error(0, 1);
    var code = "(" + code + ")";
    var length = code.length;
    var pos = 1;
    var lineno = 1;
    var parser = function() {
        var tree = [];
        tree._line = lineno;
        var token = "";
        var isString = false;
        var isSingleString = false;
        var isJSArray = 0;
        var isJSObject = 0;
        var isListComplete = false;
        var handleToken = function() {
            if (token) {
                tree.push(token);
                token = "";
            };
        };
        while (pos < length) {
            var c = code.charAt(pos);
            if (c == "\n") lineno++;
            pos++;
            if (c == '"') {
                isString = !isString;
                token += c;
                continue;
            };
            if (isString) {
                token += c;
                continue;
            };
            if (c == "'") {
                isSingleString = !isSingleString;
                token += c;
                continue;
            };
            if (isSingleString) {
                token += c;
                continue;
            };
            if (c == '[') {
                isJSArray++;
                token += c;
                continue;
            };
            if (c == ']') {
                if (isJSArray === 0) throw _LS.error(4, tree._line);
                isJSArray--;
                token += c;
                continue;
            };
            if (isJSArray) {
                token += c;
                continue;
            };
            if (c == '{') {
                isJSObject++;
                token += c;
                continue;
            };
            if (c == '}') {
                if (isJSObject === 0) throw _LS.error(6, tree._line);
                isJSObject--;
                token += c;
                continue;
            };
            if (isJSObject) {
                token += c;
                continue;
            };
            if (c == "(") {
                tree.push(parser());
                continue;
            };
            if (c == ")") {
                isListComplete = true;
                handleToken();
                break;
            };
            if (_LS.whitespace.test(c)) {
                handleToken();
                continue;
            };
            token += c;
        };
        if (isString) throw _LS.error(3, tree._line);
        if (isSingleString) throw _LS.error(3, tree._line);
        if (isJSArray > 0) throw _LS.error(5, tree._line);
        if (isJSObject > 0) throw _LS.error(7, tree._line);
        if (!isListComplete) throw _LS.error(8, tree._line);
        return tree;
    };
    return parser();
};

_LS.expandObjects = function(tree) {
    for (var i = 0; i < tree.length; i++) {
        if (typeof tree[i] == "object") {
            tree[i] = _LS.statementToString(tree[i]);
        }
    };
    return tree;
};

_LS.macroExpand = function(tree) {
    var command = tree[0];
    var template = _LS.macros[command]["template"];
    var code = _LS.macros[command]["code"];
    var replacements = {};
    for (var i = 0; i < template.length; i++) {
        if (template[i] == "rest...") {
            replacements["~rest..."] = tree.slice(i + 1);
        } else {
            replacements["~" + template[i]] = tree[i + 1];
        }
    }
    var replaceCode = function(source) {
        var ret = [];
        for (var i = 0; i < source.length; i++) {
            if (typeof source[i] == "object") {
                ret.push(replaceCode(source[i]));
            } else {
                if (replacements[source[i]]) {
                    if (source[i] == "~rest...") { 
                        ret = ret.concat(replacements[source[i]]);
                    } else {
                        ret.push(replacements[source[i]]);
                    }
                } else {
                    ret.push(source[i]);
                }
            }
        }
        return ret;
    }
    var ret = replaceCode(code);
    return ret;
};

_LS.statementToString = function(tree) {
    var command = tree[0];
    if (_LS.macros[command]) {
        tree = _LS.macroExpand(tree);
        return _LS.statementToString(tree);
    }
    if (typeof command == "string") {
        if (command.charAt(0) == ".") {
            return "(" + _LS.statementToString(tree[1]) +")" + command;
        }
        if (_LS[command]) {
            return _LS[command](tree);
        }
    }
    tree = _LS.expandObjects(tree);
    var fName = tree[0];
    if (!fName) throw _LS.error(1, tree._line);
    if (!_LS.isFunction.test(fName))
        if (!_LS.validFunction.test(fName)) throw _LS.error(2, tree._line);
    // testing for anonymous func called immediately
    if (_LS.isFunction.test(fName)) fName = "(" + fName + ")";
    return fName + "(" + tree.slice(1).join(",") + ")";
    
};

_LS.statements = function(stmnts, isFunction) {
    for (var i = 0; i < stmnts.length; i++) {
        stmnts[i] = _LS.statementToString(stmnts[i]);
    }
    if (isFunction) {
        stmnts[stmnts.length - 1] = "return " + stmnts[stmnts.length - 1];
    }
    return "\n" + stmnts.join(";\n") + ";\n";
};

_LS.var = function(arr) {
    if (!_LS.validName.test(arr[1])) throw _LS.error(9, arr._line);
    return "var " + _LS.set(arr);
};

_LS.set = function(arr) {
    if (arr.length != 3) throw _LS.error(0, arr._line);
    var ret = arr[1] + " = ";
    if (typeof arr[2] == "object") {
       ret += _LS.statementToString(arr[2]);
    } else {
       ret += arr[2];
    }
    return ret;
}

_LS.function = function(arr) {
    if (arr.length < 3) throw _LS.error(0, arr._line);
    if (typeof arr[1] != "object") throw _LS.error(0, arr._line);
    var ret = "function(" + arr[1].join(",") + "){";
    ret += _LS.statements(arr.slice(2), true);
    ret += "}";
    return ret;
}

_LS.if = function(arr) {
    if (arr.length < 3 || arr.length > 4)  throw _LS.error(0, arr._line);
    arr = _LS.expandObjects(arr);
    return arr[1] + " ? " + arr[2] + " : " + arr[3];
}

_LS.handleOperator = function(arr) {
    if (arr.length != 3)  throw _LS.error(0, arr._line);
    arr = _LS.expandObjects(arr);
    return "(" + arr[1] + " " + arr[0] + " " + arr[2] + ")";    
};

_LS["+"] = _LS.handleOperator;

_LS["-"] = _LS.handleOperator;

_LS["*"] = _LS.handleOperator;

_LS["/"] = _LS.handleOperator;

_LS["%"] = _LS.handleOperator;

_LS["="] = function(arr) {
    if (arr.length != 3)  throw _LS.error(0, arr._line);
    arr = _LS.expandObjects(arr);
    return "(" + arr[1] + " === " + arr[2] + ")";
}

_LS["!="] = function(arr) {
    if (arr.length != 3)  throw _LS.error(0, arr._line);
    arr = _LS.expandObjects(arr);
    return "(" + arr[1] + " !== " + arr[2] + ")";
}

_LS[">"] = _LS.handleOperator;

_LS[">="] = _LS.handleOperator;

_LS["<"] = _LS.handleOperator;

_LS["<="] = _LS.handleOperator;

_LS["||"] = _LS.handleOperator;

_LS["&&"] = _LS.handleOperator;

_LS["!"] = function(arr) {
    if (arr.length != 2)  throw _LS.error(0, arr._line);
    arr = _LS.expandObjects(arr);
    return "(!" + arr[1] + ")";
}

_LS.macro = function(arr) {
    if (arr.length != 4)  throw _LS.error(0, arr._line);
    _LS.macros[arr[1]] = {template: arr[2], code: arr[3]};
    return "//macrodef";
}

_LS.error = function(no, line) {
    return _LS.err[no] + ", line no " + line;
}
_LS.err = [];
_LS.err[0] = "Syntax Error";
_LS.err[1] = "Empty statement";
_LS.err[2] = "Invalid characters in function name";
_LS.err[3] = "End of File encountered, unterminated string";
_LS.err[4] = "Closing square bracket, without an opening square bracket";
_LS.err[5] = "End of File encountered, unterminated array";
_LS.err[6] = "Closing curly brace, without an opening curly brace";
_LS.err[7] = "End of File encountered, unterminated javascript object '}'";
_LS.err[8] = "End of File encountered, unterminated parenthesis";
_LS.err[9] = "Invalid character in var name";

var fs = require('fs');
try {
  var infile = process.argv[2];
  var outfile = process.argv[3];
  var code = fs.readFileSync(infile, 'ascii');
  var tree = _LS.syntaxTree(code);
  fs.writeFileSync(outfile, _LS.statements(tree), "ascii");
}
catch (err) {
  if (typeof err == "string")
      console.log(err);
  else
      console.log(_LS.err[err]);
}





var data = fs.readFileSync('source.ls').toString()

var t = _LS.syntaxTree(data);
console.log(t);