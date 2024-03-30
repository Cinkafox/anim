const fs = require("fs")
const Vector2 = require("vec2")
const TextureActions = require("./Actions.js")
const Utils = require("./util.js")
const Texture = require("./Texture.js")
const MeshObject = require("./MeshObject.js")
const http = require("http")

const states = [
  //"equipped-INNERCLOTHING",
  "torso", "head",
  "l_arm","l_hand",
  "r_arm","r_hand",
  "l_foot", "l_leg",
  "r_foot", "r_leg",
]

/**
 * @type {Object.<string, MeshObject>} 
 */
var meshs = {}
for(let state of states){
  let path = "layers/" + state + ".png"
  meshs[state] = new MeshObject(path)
}

var chast = "torso"

http.createServer((req,res)=>{
  var params = req.url.split("?")[1].split("&")
  for(let param of params){
    var sa = param.split("=")
    switch(sa[0]){
      case "rotation":
        meshs[chast].transform.rotation = Utils.fromGrad(Number(sa[1]))
        break;
      case "scale":
        var num = Number(sa[1])
        meshs[chast].transform.scale = new Vector2(num,num)
        break;
      case "position":
        var num = Number(sa[1])
        meshs[chast].transform.position = new Vector2(num,num)
        break;
      
    } 
  }
  var m = Utils.Mix(Object.values(meshs))
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.write(m.buffer)
}).listen(8080)


