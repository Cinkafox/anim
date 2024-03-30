var fs = require("fs"),
  PNG = require("pngjs").PNG, Vector2 = require("vec2");

var http = require("http")

function fromGrad(sa){
    return sa * Math.PI / 180
}

class linearVec{
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

    rotate(deg){
        var sz = 1 + Math.sin(deg*2)*0.45
        var rotated = this.vec2.clone().subtract(this.width/4,this.width/4).rotate(deg).multiply(sz,sz).add(this.width/4,this.width/4)
        this.vec2.set(Math.floor(rotated.x),Math.floor(rotated.y))
    }
}


var buffer = fs.readFileSync("layers/torso.png");
var pngobj = PNG.sync.read(buffer);
var newobj = new PNG({width: pngobj.width,height: pngobj.height})
const storona = 4
const width = pngobj.width / 2
const height = pngobj.height / 2
const size = new Vector2(width,height)



for(let s = 0; s < storona; s++){
    const s1 = s % 2
    const s2 = Math.floor(s / 2)
    const stpos = size.multiply(s1,s2,true)

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var sa1 = new linearVec(x,y,pngobj.width,stpos)
            var sa2 = new linearVec(x,y,pngobj.width,stpos)

            sa2.rotate(fromGrad(45))
            if(sa2.vec2.x < 0 || sa2.vec2.x > width || sa2.vec2.y < 0 || sa2.vec2.y > height) continue

            newobj.data[sa1.line] = pngobj.data[sa2.line]
            newobj.data[sa1.next()] = pngobj.data[sa2.next()]
            newobj.data[sa1.next()] = pngobj.data[sa2.next()]
            newobj.data[sa1.next()] = pngobj.data[sa2.next()]
        }
    }
}

newobj.pack().pipe(fs.createWriteStream("a.png"))