fs = require 'fs'

String::Trim = () ->
	return @replace(/(^\s*)|(\s*$)/g, "")

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

datat = fs.readFileSync('gq.strip', 'UTF-8').toString()
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

parseLine = (src) ->
	lines = src.replace(/\r\n/g, '\n').split('\n')
	lines = (t for t in lines when t.Trim() isnt '')
	createCmd = (n, tab) ->
		cmd = []
		while n < lines.length
			l = lines[n]
			ctab = countTab(l)
			if ctab is tab
				cmd.push(parseOneLine(l))
				n++
			else if ctab > tab
				lc = cmd.pop()
				[n, tc] = createCmd(n, ctab)
				cmd.push [lc..., tc...]
			else
				return [n, cmd]
		return [n, cmd]

	[n, cmd] = createCmd(0, 0)
	console.log n
	return cmd

parseLine(datat)
t = parseLine(datat)
console.log t[1..10]

