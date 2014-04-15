//JavaScript

/* CellView - object reperesenting the canvas
 * 
 * CellView.prototype.setup()  - setup object
 * CellView.prototype.loadDots(dots) - loads Dot objects into this.dots array form json file
 * CellView.prototype.getMousePos()  - returns mouse coordinates on true scale
 * CellView.prototype.drawDots()     - draws dots corresponding to x,y coordinates from data on canvas
*/
function CellView(canvas, dot, image, width, height) {
    var thisObj = this;
    this.mouseX = 0;
    this.mouseY = 0;
    this.canvas = document.getElementById(canvas); // DOM object of canvas
    this.dot = document.getElementById(dot);
    
    this.img = new Image(); // Main background image
    this.img.src = image; // set the src of background image to image
    this.dots = []; // Array of Dot objects
    this.setup(); // setup
    this.canvasDimension = this.canvas.width; // 500
    this.boxDimension = 750;
    this.trueW = width; // the actual width of the pixel grid
    this.trueH = height; // the actual height of the pixel grid
    this.scale = width / this.canvasDimension; // scale of background image
    this.offset = {x: 0.55, y: 0.55}; // DEBUG: offset
}

CellView.prototype.setup = function () {
    var thisObj = this;
    this.img.onload = function () {
        var ctx = thisObj.canvas.getContext("2d");
        ctx.drawImage(thisObj.img, 0, 0, thisObj.canvasDimension, thisObj.canvasDimension);
    };
    this.canvas.addEventListener("mousemove", function (evt) {
        thisObj.mouseX = evt.clientX;
        thisObj.mouseY = evt.clientY;
    });
    this.canvas.addEventListener("mousedown", function () {
        var coords = thisObj.getMousePos(thisObj.mouseX, thisObj.mouseY),
            i = 0;
        //console.log(thisObj.mouseX, thisObj.mouseY)
        //console.log(coords)
        for (i = 0; i < thisObj.dots.length; i++) {
            if (thisObj.dots[i].checkPos(coords.x, coords.y, 0.5)) {
                var ctx = thisObj.dot.getContext("2d");
                ctx.drawImage(thisObj.dots[i].img, 0, 0, thisObj.canvasDimension, thisObj.canvasDimension);
                //console.log(thisObj.dots[i])
                
                
                
                var ctx = thisObj.canvas.getContext("2d");
                ctx.drawImage(thisObj.img, 0, 0, thisObj.canvasDimension, thisObj.canvasDimension);
                var x = (thisObj.dots[i].x +thisObj.offset.x) / thisObj.scale;
                var y = (thisObj.dots[i].y + thisObj.offset.y) / thisObj.scale;
                //console.log(x,y)
                ctx.fillStyle = "red";
                ctx.fillRect( x-5, y-5, 10, 10);
                break;
            }
            
        }
    });
}

CellView.prototype.loadDots = function(array)
{
	for (var i = 0; i < array.length; i++ )
	{
		this.dots.push(new Dot(array[i][2], array[i][1], array[i][0]))
	}
}

CellView.prototype.getMousePos = function(clientX,clientY)
{
    var rect = this.canvas.getBoundingClientRect();
    var scale = this.scale;
    var offset = this.offset;
    var thisObj = this;
    var xy = {
        x: (clientX - rect.left)/thisObj.boxDimension * thisObj.canvasDimension * scale - offset.x,
        y: (clientY - rect.top)/thisObj.boxDimension * thisObj.canvasDimension * scale - offset.y
    };
    return xy;
}

CellView.prototype.drawDots = function()
{
    var ctx = this.canvas.getContext("2d");
    ctx.fill()
    ctx.fillStyle = "red";
    for (var i = 0; i< this.dots.length; i++)
    {  
        var x = (this.dots[i].x+this.offset.x)/this.scale
        var y = (this.dots[i].y+this.offset.y)/this.scale
        //console.log(x,y)
        ctx.fillRect( x-5, y-5, 10, 10)
    }
}

/* Object representing each dot
 *
 * Dot.prototype.makeImgName(imgNum)  -    create path to image
 * Dot.prototype.checkPos(x,y,error)     -  return true if x and y are in the error range of this.x and this.y
 * 
 */
function Dot(x,y,img)
{
    this.img = new Image(); // Enlarged image of the dot
    this.imgName = this.makeImgName(img); // Generate path to dot image
    this.img.src = this.makeImgName(img);
    this.x = parseFloat(x); // x coordinate on true scale of background image
    this.y = parseFloat(y); // y coordinate on true scale of background image
}

Dot.prototype.makeImgName = function(imgNum)
{
    var path = "data/w/";
    var prfix = "w_";
    var sufix = ".png"
    var num = "";
	
    for ( var i = 0; i< (3-imgNum.length); i++ )
    {
        num += "0"
    }
    num += imgNum;
	
    return path + prfix + num + sufix;
}

Dot.prototype.checkPos = function(x,y,error)
{
    if (Math.abs(this.x-x)< error)
    {
        if (Math.abs(this.y-y)< error )
        {
            return true;
        }
    }
    return false;
}


var cell = new CellView("cell", "dot","data/wf_loc.png",38,38);
cell.loadDots(Cell_data);

