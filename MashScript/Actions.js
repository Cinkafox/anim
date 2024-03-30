'use strict';

const Vec2 = require("vec2");

const LinearVec = require("./util").LinearVec;

class TextureAction{
    /**
     * 
     * @param {LinearVec} linearVec 
     */
    Act(linearVec){

    }
}

class RotateAction extends TextureAction{

    constructor(center,rotation){
        super()
        this.center = center
        this.rotation = rotation
    }
    
    /**
     * 
     * @param {LinearVec} linearVec 
     */
    Act(linearVec){
        super.Act(linearVec)

        var sz = 1 //+ Math.sin(this.rotation*2)*0.5
        var rotated = linearVec.vec2.clone().subtract(this.center).rotate(this.rotation).multiply(sz,sz).add(this.center)
        linearVec.vec2.set(Math.floor(rotated.x),Math.floor(rotated.y))
    }
}

class ResizeAction extends TextureAction{

    /**
     * 
     * @param {Vec2} size 
     */
    constructor(size){
        super()
        this.size = size
        this.center = new Vec2(16,16)
    }

    /**
     * 
     * @param {LinearVec} linearVec 
     */
    Act(linearVec){
        super.Act(linearVec)
        linearVec.vec2.multiply(this.size)
    }
}

class ShiftAction extends TextureAction{

    /**
     * 
     * @param {Vec2} value 
     */
    constructor(value){
        super()
        this.value = value
    }

    /**
     * 
     * @param {LinearVec} linearVec 
     */
    Act(linearVec){
        super.Act(linearVec)
        linearVec.vec2.add(this.value)
    }
}

module.exports = {
    TextureAction, RotateAction, ResizeAction, ShiftAction
}