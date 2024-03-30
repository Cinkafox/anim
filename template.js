var fs = require("fs"),
  PNG = require("pngjs").PNG;

function createTemplateMap(path){
    fs.createReadStream(path)
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2;

        this.data[idx] = x % 32;
        this.data[idx + 1] = y  % 32;
        this.data[idx + 2] = 0;
      }
    }

    this.pack().pipe(fs.createWriteStream("out/" + path));
  });
}

let paths = fs.readdirSync("layers")
for (let i = 0; i < paths.length; i++) {
  paths[i] = "layers/" + paths[i]
}


/**
   * @type {[PNG]}
   */
var PNGarray = []
for(let path of paths){
  var buffer = fs.readFileSync(path);
  var oriData = PNG.sync.read(buffer);
  PNGarray.push(oriData)
  createTemplateMap(path)
}

var a = new PNG({width: PNGarray[0].width, height:PNGarray[0].height})

for (var y = 0; y < a.height; y++) {
  for (var x = 0; x < a.width; x++) {
    var idx = (a.width * y + x) << 2;
    a.data[idx] = x % 32;
    a.data[idx + 1] = y % 32;
    a.data[idx + 2] = 0;

    for(let papa of PNGarray){
      if(papa.data[idx + 3] > 0){
        a.data[idx + 3] = papa.data[idx + 3]
        break
      }
    }
  }
}

a.pack().pipe(fs.createWriteStream("out/template.png"))


