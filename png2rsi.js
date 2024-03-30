var fs = require("fs"),
  PNG = require("pngjs").PNG;

const states = [
    //"equipped-INNERCLOTHING",
    "torso_f",
    "l_arm","l_hand",
    "r_arm","r_hand",
    "l_foot", "l_leg",
    "r_foot", "r_leg",
]

const width = 32
const height = 32
const storona = 4


function layerfi(state){
    let paths = fs.readdirSync("pngs/" + state)
    for (let i = 0; i < paths.length; i++) {
      paths[i] = "pngs/" + state + "/" + paths[i]
    }

    /**
       * @type {[PNG]}
       */
    var PNGarray = []
    for(let path of paths){
      var buffer = fs.readFileSync(path);
      var oriData = PNG.sync.read(buffer);
      PNGarray.push(oriData)
    }

    let sasai = new PNG({width: width * paths.length, height: height * storona})

    var numb = 0;
    for(let pngobj of PNGarray){

      for(let s = 0; s < storona; s++){
        const s1 = s % 2
        const s2 = Math.floor(s / 2)
        console.log(s1 + " " + s2)

        for (var y = 0; y < height; y++) {
          for (var x = 0; x < width; x++) {

            var sx = height*s1 + x
            var sy = width*s2 + y

            var idx = (pngobj.width * sy + sx) << 2;
            var sdx = (sasai.width * (y + height*s) + (x + width*numb)) << 2;

            sasai.data[sdx] = pngobj.data[idx]
            sasai.data[sdx + 1] = pngobj.data[idx + 1]
            sasai.data[sdx + 2] = pngobj.data[idx + 2]
            sasai.data[sdx + 3] = pngobj.data[idx + 3]
          }
        }
      }

      numb++;
    }

    sasai.pack().pipe(fs.createWriteStream("rsis/out.rsi/" + state + ".png"))
    return numb
}

class Vector2{
    x = 0
    y = 0
    constructor(x,y){
        this.x = x
        this.y = y
    }
}

class State{
    delays = []
    constructor(name,directions,count,delay = 0.1){
        this.name = name
        if(directions > 1){
            this.directions = directions
        }

        for (let j = 0; j < directions; j++) {
            var tempa = []
            for (let i = 0; i < count; i++) {
                tempa.push(delay)
            }
            this.delays.push(tempa)
        }
    }
}

class Meta{
    version = 1
    license = "CC-BY-SA-4.0"
    copyright = "Да кого это ебёт?"
    size = new Vector2(width,height)
    /**
     * @type {[State]}
     */
    states = []
}

const meta = new Meta()
for(let o of states){
  let anileng = layerfi(o)
  meta.states.push(new State(o,storona,anileng))
}

let sa = JSON.stringify(meta, null, 4)
fs.writeFileSync("rsis/out.rsi/meta.json",sa)