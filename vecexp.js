var Vector2 = require("vec2");

var a = new Vector2(0,0)
a.subtract(2,2).rotate(Math.PI/4).add(2,2)
console.log(a)