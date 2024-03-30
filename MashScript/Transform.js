const Vec2 = require("vec2");
const Texture = require("./Texture");
const { RotateAction, ResizeAction, ShiftAction } = require("./Actions.js");
const TextureAction = require("./Actions.js").TextureAction

class Transform{
    #position = new Vec2(0,0)
    #center = new Vec2(16,16)
    #rotCenter = new Vec2(16,16)
    #rotation = 0
    #size = new Vec2(32,32)
    #scale = new Vec2(1,1)

    /**
     * 
     * @param {Texture} texture 
     */
    constructor(texture){
        this.oriTexture = texture.clone()
        this.texture = texture
        this.#size = texture.size
        this.#rotCenter = this.#size.divide(2,2)
        this.#position = this.#size.divide(2,2)
        this.#center = this.#size.divide(2,2)
    }

    get scale(){
        return this.#scale
    }

    get size(){
        return this.#size
    }

    get rotation(){
        return this.#rotation
    }

    get rotCenter(){
        return this.#rotCenter
    }

    get position(){
        return this.#position
    }

    set scale(value){
        this.texture.data = this.oriTexture.data
        this.#scale = value
        this.texture.performAction(new ResizeAction(this.#scale))
    }

    set rotation(value){
        this.texture.PNG.data = this.oriTexture.data
        this.#rotation = value
        this.texture.performAction(new RotateAction(this.rotCenter,this.rotation))
    }

    set rotCenter(value){
        this.texture.PNG.data = this.oriTexture.data
        this.#rotCenter = value
        this.texture.performAction(new RotateAction(this.rotCenter,this.rotation))
    }

    set position(value){
        this.texture.PNG.data = this.oriTexture.data
        this.#position = value
        this.texture.performAction(new ShiftAction(this.#position.subtract(this.#center)))
    }
}

module.exports = Transform