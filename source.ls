(if (undefined? window)
  (console.log "Hello LispyScript!")
  (alert "Hello LispyScript!"))
(console.log "hello")

(console.log "hello LispyScript?")
(if (undefined? window)
	(console.log "hello LispyScript")
	(alert "hello LispyScript"))

(var square (function (x) (* x x)))

(Array.prototype.forEach.call [1, 2, 3]
	(function (elem index list)
		(console.log elem)))