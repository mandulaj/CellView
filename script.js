//JavaScript

var CanvasConfig = {
    offset: {x: -8, y: -8},
    
}


/* CellView - object reperesenting the canvas
 * 
 * CellView.prototype.setup()  - setup object
 * CellView.prototype.loadDots(dots) - loads Dot objects into this.dots array form json file
 * CellView.prototype.getMousePos()  - returns mouse coordinates on true scale
 * CellView.prototype.drawDots()     - draws dots corresponding to x,y coordinates from data on canvas
*/
function CellView(canvas, dot, image) {
    var thisObj = this;
    this.mouseX = 0;
    this.mouseY = 0;
    this.canvas = document.getElementById(canvas); // DOM object of canvas
    this.dot = document.getElementById(dot);
    
    this.img = new Image(); // Main background image
    this.img.src = image; // set the src of background image to image
    this.dots = []; // Array of Dot objects
    this.setup(); // setup
}

CellView.prototype.setup = function () {
    var thisObj = this;
    this.img.onload = function () {
        var ctx = thisObj.canvas.getContext("2d");
        ctx.drawImage(thisObj.img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
    };
    this.canvas.addEventListener("mousemove", function (evt) {
        thisObj.mouseX = evt.clientX;
        thisObj.mouseY = evt.clientY;
    });
    this.canvas.addEventListener("mousedown", function () {
        var coords_canvas = thisObj.getMousePos(thisObj.mouseX, thisObj.mouseY),
            i = 0;

		var distmin = thisObj.canvas.width + thisObj.canvas.height;
		var imin = 0;
        for (i = 0; i < thisObj.dots.length; i++) {
        	var dist = thisObj.dots[i].distance(coords_canvas.x,coords_canvas.y);
        	if (dist < distmin) {
        		distmin = dist;
        		imin = i;         	
        	}
        }
        console.log(distmin)
        var ctx = thisObj.dot.getContext("2d");
        ctx.drawImage(thisObj.dots[imin].img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
        console.log(thisObj.dots[imin])
        console.log(thisObj.dots[imin].x_canvas,thisObj.dots[imin].y_canvas)                                
        var x = thisObj.dots[imin].x_canvas;//(thisObj.dots[imin].x +thisObj.offset.x) * thisObj.scaleX;
        var y = thisObj.dots[imin].y_canvas;// + thisObj.offset.y) * thisObj.scaleY;
    	var ctx = thisObj.canvas.getContext("2d");
        ctx.drawImage(thisObj.img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
        ctx.fillStyle = "red";
        var bs = 5
        ctx.fillRect( x-0, y-0, bs, bs);       
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
    var scaleX = this.scaleX;
    var scaleY = this.scaleY;
    var offset = CanvasConfig.offset;
    var thisObj = this;
    var xy = {
        //x: (clientX - rect.left)/thisObj.boxDimensionX * thisObj.canvas.width / scaleX - offset.x,
        //y: (clientY - rect.top)/thisObj.boxDimensionY * thisObj.canvas.height / scaleY - offset.y
        x: clientX - rect.left + CanvasConfig.offset.x,//(clientX - rect.left)/thisObj.canvas.width*scaleX,// - offset.x,
        y: clientY - rect.top + CanvasConfig.offset.y//(clientY - rect.top)/thisObj.canvas.height*scaleY// - offset.y

    };
    var ctx = thisObj.canvas.getContext("2d");
//    ctx.drawImage(thisObj.img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
//    ctx.fillStyle = "green";
//    ctx.fillRect( xy.x,xy.y, 10, 10);
//    console.log(xy.x,xy.y)
    return xy;
}

CellView.prototype.drawDots = function()
{
    var rect = this.canvas.getBoundingClientRect();
    var ctx = this.canvas.getContext("2d");
    ctx.fill()
    ctx.fillStyle = "red";
    for (var i = 0; i< this.dots.length; i++)
    {  
        var x = this.dots[i].x_canvas;
        var y = this.dots[i].y_canvas;
        ctx.fillRect( x, y, 5, 5)
    }
}

/* Object representing each dot
 *
 * Dot.prototype.makeImgName(imgNum)  -    create path to image
 * Dot.prototype.distance(x,y)     -  returns distance of Dot to x,y
 * 
 */
function Dot(x,y,img)
{
    this.img = new Image(); // Enlarged image of the dot
    this.imgName = this.makeImgName(img); // Generate path to dot image
    this.x = parseFloat(x); // x coordinate on true scale of background image
    this.y = parseFloat(y); // y coordinate on true scale of background image
    this.x_canvas = 3.3345*this.x // this is the scale between the pixels of the image and the original data
    this.y_canvas = 3.3345*this.y

}

Dot.prototype.makeImgName = function(imgNum)
{
    var path = "data/w/";
    var prfix = "w_";
    var sufix = ".png"
    var num = "";
	
    for ( var i = 0; i< (5-imgNum.length); i++ )
    {
        num += "0"
    }
    num += imgNum;
	
    return path + prfix + num + sufix;
}


Dot.prototype.distance = function(x,y)
{
	var xs = 0;
  	var ys = 0;
 
  	xs = this.x_canvas - x + CanvasConfig.offset.x;
    
  	xs = xs * xs;
  	ys = this.y_canvas - y + CanvasConfig.offset.y;
  	ys = ys * ys; 
  	return Math.sqrt( xs + ys )
}

Dot.prototype.loadImg = function()
{
    this.img.src = this.this.imgName;
}

var cell = new CellView("cell", "dot","data/wf_loc.png");//,987,786);
cell.loadDots(Cell_data);

