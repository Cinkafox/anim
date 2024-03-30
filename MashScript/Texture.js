'use strict';

const fs = require("fs")
const PNG = require("pngjs").PNG
const TextureAction = require("./Actions.js").TextureAction
const Utils = require("./util")
const LinearVec = Utils.LinearVec
const Color = Utils.Color

class Texture{
    constructor(buff,directionCount,size){
        this.PNG = PNG.sync.read(buff)
        this.directionCount = directionCount
        this.size = size
        this.width = size.x
        this.height = size.y
        this.wcount = this.PNG.width / this.width
        this.hcount = this.PNG.height / this.height
    }

    get data(){
        return this.PNG.data
    }

    get buffer(){
        return PNG.sync.write(this.PNG)
    }

    getLinear(x,y){
        return new LinearVec(x,y,this.PNG.width,new Vector2(0,0))
    }

    /**
     * 
     * @param {TextureAction} act
     * @param {[number]} dirs 
     */
    performAction(act,dirs){
        if(dirs == undefined){
            dirs = [...Array(this.directionCount).keys()]
        }


        var cl = new PNG({width: this.PNG.width, height: this.PNG.height})

        for(let dir of dirs){
            const s1 = dir % this.wcount
            const s2 = Math.floor(dir / this.hcount)
            const stpos = this.size.multiply(s1,s2,true)


            for (var y = 0; y < this.height; y++) {
                for (var x = 0; x < this.width; x++) {
                    var sa1 = new LinearVec(x,y,this.PNG.width,stpos)
                    var sa2 = new LinearVec(x,y,this.PNG.width,stpos)

                    act.Act(sa2)
        
                    if(sa2.vec2.x < 0 || sa2.vec2.x > this.width || sa2.vec2.y < 0 || sa2.vec2.y > this.height) continue
        
                    cl.data[sa1.line] = this.data[sa2.line]
                    cl.data[sa1.next()] = this.data[sa2.next()]
                    cl.data[sa1.next()] = this.data[sa2.next()]
                    cl.data[sa1.next()] = this.data[sa2.next()]
                }
            }
        }

        this.PNG = cl
        return this
    }

    /**
     * 
     * @param {LinearVec} linearVec 
     * @returns {Color}
     */
    getColor(linearVec){
        let col = new Color()
        col.r = this.data[linearVec.curPos]
        col.g = this.data[linearVec.next()]
        col.b = this.data[linearVec.next()]
        col.a = this.data[linearVec.next()]
        return col
    }

    /**
     * 
     * @param {LinearVec} linearVec 
     * @param {Color} color 
     */
    setColor(linearVec, color){
        this.data[linearVec.curPos] = color.r
        this.data[linearVec.next()] = color.g
        this.data[linearVec.next()] = color.b
        this.data[linearVec.next()] = color.a
    }

    clone(){
        return new Texture(this.buffer,this.directionCount,this.size)
    }
}

module.exports = Texture;