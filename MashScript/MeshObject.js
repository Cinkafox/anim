const fs = require("fs")
const Texture = require("./Texture.js")
const Vec2 = require("vec2")
const Transform = require("./Transform.js")

class MeshObject{
    constructor(path){
        this.texture = new Texture(fs.readFileSync(path),4,new Vec2(32,32))
        this.transform = new Transform(this.texture)

    }
}

module.exports = MeshObject