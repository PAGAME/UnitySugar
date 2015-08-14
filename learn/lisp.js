(function() {
  var Context, categrize, interpret, interpretList, library, parenthesize, t, tokenize;

  tokenize = function(input) {
    return input.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').split(/ +/).slice(1, -1);
  };

  t = tokenize("(first (t d e))");

  console.log(t);

  parenthesize = function(input, list) {
    var token;
    token = input.shift();
    if (token === void 0) {
      return list.pop();
    } else if (token === '(') {
      list.push(parenthesize(input, []));
      return parenthesize(input, list);
    } else if (token === ')') {
      return list;
    } else {
      return parenthesize(input, list.concat(categrize(token)));
    }
  };

  categrize = function(input) {
    if (!isNaN(parseFloat(input))) {
      return {
        type: 'lit',
        val: parseFloat(input)
      };
    } else {
      return {
        type: 'id',
        val: input
      };
    }
  };

  t = parenthesize(t, []);

  console.log(t);

  interpret = function(input, context) {
    if (context === void 0) {
      return interpret(input, new Context(library));
    } else if (input instanceof Array) {
      return interpretList(input, context);
    } else if (input.type === 'id') {
      return interpretId(input, context);
    } else {
      return input.val;
    }
  };

  interpretList = function(input, context) {
    var list;
    if (special[input[0].val] != null) {
      return special[input[0].val](input, context);
    } else {
      list = input.map(function(x) {
        return interpret(x, context);
      });
      if (list[0].type === 'function') {
        return list[0].val(list.slice(1));
      } else {
        return list;
      }
    }
  };

  Context = function(scope, parent) {
    this.scope = scope;
    this.parent = parent;
    return this.get = function(id) {
      if (this.scope[id] != null) {
        return this.scope[id];
      } else if (this.parent !== void 0) {
        return this.parent.get(id);
      }
    };
  };

  library = {
    first: function(x) {
      return x[0];
    }
  };

}).call(this);

//# sourceMappingURL=../learn/lisp.js.map