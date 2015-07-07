fs = require 'fs'

String::Trim = () ->
	return @replace(/(^\s*)|(\s*$)/g, "")

String::TrimRight = () ->
	return @replace(/(\s*$)/g, "")

data = fs.readFileSync('source.txt').toString()
data = data.replace(/\r\n/g, '\n')

# console.log data
# console.log data.indexOf('(', 19)
# data = fs.readFileSync('out.json').toString()
# data = fs.readFileSync('csonData.cson').toString()
#
# CSON = require('season')
# console.log JSON.parse(data)
# console.log CSON.parse(data)

atom = (s) ->
	s = s.Trim()
	if s is '('
		return '['
	if s is ')'
		  return '],'
	  if s is ','
		  return ''
	return "\'" + s + "\',"
###*
 * parseStp as a tree
 * use ", ( ) \s " to split
 * @param  {string} src the source text
 * @return {array}     the tree
###
parseStp = (src) ->
	  # parseStp tree " , ( ) "
	tokens = src.replace(/\(/g, ' ( ')
		.replace(/\)/g, ' ) ')
		.replace(/,/g, ' , ')
		.replace(/\t/g, ' ')
		.split(' ')
	t = (atom(s) for s in tokens when s.Trim() isnt '')
		.join(' ')
	t = t.substring(0, t.length-1) # delete the last ','
	try
		eval(t)
	catch error
		console.log error
		console.log src
		return error

# datat = datat.replace(/\r\n/g, '\n')
# lines = datat.split('\n')
# lines = (t for t in lines when t isnt '')
# console.log lines[400]

countTab = (str) ->
	count = 0
	for i in [0...str.length]
		if str[i] is '\t' then count++
		else break
	return count

parseOneLine = (line) ->
	n = line.replace('：', ':').indexOf(':')
	result = []
	if n > -1
		result.push line[0...n] if n isnt 0
		result.push ':'
		result.push line[n+1...]
	else
		result = line.Trim()
			.split(' ')
	return (t for t in result when t isnt '')

# parseLine(data)
# t = parseLine(data)
# console.log t

class Trunck

	constructor: (@body, @tabN = 0) ->
		@content = []
		@tabs = ''
		@tabs += '\t' for i in [0...@tabN]

	addContent: (trunks) ->
		@content = trunks;

	toString: () ->
		str = @tabs + '[' + @body + '\n'
		str += t.toString() for t in @content
		return str + @tabs + ']\n'

	toCS: () ->
		str = '\n'
		if @content.length is 0
			return str + @body + ';'
		else
			str += '\n' + @body + ' {'
			str += t.toCS() for t in @content
			str += '\n' + @tabs + '}'

class FunctionTrunck extends Trunck

	constructor: (body, tabN = 0) ->
		body = body[0...body.length - 1]
		super(body, tabN)

	toCS: () ->
		if @content.length is 0
			return '\n\n' + @body + ' {\n' + @tabs + '}'
		else
			super()

class RootTrunck extends Trunck

	constructor: () ->
		@content = []
		@tabN = -1

	toString: () ->
		str = ''
		str += t.toString() for t in @content
		return str

	toCS: () ->
		str = ''
		str += t.toCS() for t in @content
		return str

class BlankTrunck

	constructor: () ->
		@tabN = -1

	toString: () ->
		return ''

	toCS: () ->
		return ''

createTrunck = (line, tabN) ->
	line = line.TrimRight()
	if line[line.length - 1] is ':'
		return new FunctionTrunck(line, tabN)
	else
		return new Trunck(line, tabN)

parseLine = (src) ->
	lines = src.replace(/\r\n/g, '\n').split('\n')
	lines = (t for t in lines when t.Trim() isnt '')
	createTrunk = (wait, done) ->
		if wait.length is 0
			return done
		else
			l = wait.pop()
			lTabN = countTab(l)
			trunk0 = createTrunck(l, lTabN)
			# find subs
			count = 0
			for t in done
				if lTabN < t.tabN
					count++
				else
					break
			contents = done[0...count]
			rest = done[count...]
			trunk0.addContent(contents)
			return [trunk0, rest...]
	done = [new BlankTrunck()]
	for i in [0...lines.length]
		done = createTrunk(lines, done)
		# console.log done
	all = new RootTrunck()
	all.addContent(done)
	return all

root = parseLine(data)

console.log root.toCS()

console.log 'abcdef'

# fs.writeFileSync('aim.cs', root.toCS())
