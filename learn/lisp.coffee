tokenize = (input) ->
	input.replace(/\(/g, ' ( ')
		.replace(/\)/g, ' ) ')
		.split(/ +/)[1...-1]

t = tokenize("
	(first (t d e))
	")
console.log t  

parenthesize = (input, list) ->
	token = input.shift();
	if token is undefined
		return list.pop()
	else if token is '('
		list.push(parenthesize(input, []))
		return parenthesize(input, list)
	else if token is ')'
		return list
	else 
		return parenthesize(input,
			list.concat(categrize(token)))

categrize = (input) ->
	if !isNaN(parseFloat(input))
		return {type: 'lit', val:parseFloat(input)}
	else
		return {type: 'id', val: input}

t = parenthesize(t, [])
console.log t

interpret = (input, context) ->
	if context is undefined
		return interpret(input, new Context(library))
	else if input instanceof Array
		return interpretList(input, context)
	else if input.type is 'id'
		return interpretId(input, context)
	else
		return input.val

interpretList = (input, context) ->
	if special[input[0].val]?
		return special[input[0].val](input, context)
	else
		list = input.map((x) ->
			return interpret(x, context)
		)
		if list[0].type is 'function'
			return list[0].val(list.slice(1))
		else
			return list

Context = (scope, parent) ->
	@scope = scope
	@parent = parent
	@get = (id) ->
		if @scope[id]?
			return @scope[id]
		else if @parent isnt undefined
			return @parent.get(id)

library = {
	first: (x) ->
		return x[0]
}
