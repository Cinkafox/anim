'use strict';

const Vector2 = require("vec2");

class LinearVec{
    curPos = 0;
    constructor(x,y,width, startpos){
        this.vec2 = new Vector2(x,y)
        this.startpos = startpos
        this.width = width
    }

    get line(){
        var shift = this.vec2.clone().add(this.startpos)
        return ((this.width * shift.y + shift.x) << 2) + this.curPos
    }

    next(){
        this.curPos += 1;
        return this.line
    }
}

class Color{
    constructor(){
        this.r = 0
        this.g = 0
        this.b = 0
        this.a = 0
    }
}

function fromGrad(sa){
    return sa * Math.PI / 180
}

/**
 * 
 * @param {[import("./MeshObject")]} texAr 
 * 
 */
function Mix(texAr){
    var mixed = texAr.shift().texture.clone()
    for(let mesh of texAr){
        for (var y = 0; y < mixed.PNG.width; y++) {
            for (var x = 0; x < mixed.PNG.width; x++) {
                var c = mesh.texture.getColor(new LinearVec(x,y,mixed.PNG.width,new Vector2(0,0)),new Color())
                if(c.a > 0)
                mixed.setColor(new LinearVec(x,y,mixed.PNG.width,new Vector2(0,0)),c)
            }
        }
    }

    return mixed
}


module.exports = {
    LinearVec, fromGrad, Color, Mix
}