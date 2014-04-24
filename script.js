//JavaScript

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
    //this.canvasDimension = this.canvas.width; // 500
    //this.boxDimensionX = this.canvas.widht;
    //this.boxDimensionY = this.canvas.height;
    //this.boxDimension = 550;
    //this.trueW = width; // the actual width of the pixel grid
    //this.trueH = height; // the actual height of the pixel grid
    //this.scale = this.canvasDimension / width; // scale of background image
    this.scaleX = 1000;//3.38;//*this.canvas.width / width; // scale for the mouse
    this.scaleY = 1000;//4.24;//*this.canvas.height / height; // 
    this.offset = {x: 0., y: 0.}; // DEBUG: offset
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
        var coords = thisObj.getMousePos(thisObj.mouseX, thisObj.mouseY),
            i = 0;
        //console.log(thisObj.mouseX, thisObj.mouseY)
        //console.log(coords)
//         for (i = 0; i < thisObj.dots.length; i++) {
//             if (thisObj.dots[i].checkPos(coords.x, coords.y, 5)) {
//                 var ctx = thisObj.dot.getContext("2d");
//                 ctx.drawImage(thisObj.dots[i].img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
//                 console.log(thisObj.dots[i])                                
//                 
//                 var ctx = thisObj.canvas.getContext("2d");
//                 ctx.drawImage(thisObj.img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
//                 var x = (thisObj.dots[i].x +thisObj.offset.x) * thisObj.scaleX;
//                 var y = (thisObj.dots[i].y + thisObj.offset.y) * thisObj.scaleY;
//                 //console.log(x,y)
//                 ctx.fillStyle = "red";
//                 ctx.fillRect( x, y, 10, 10);
//                 break;
//             }
// //             else {
// //             	var ctx = thisObj.canvas.getContext("2d");
// //                 ctx.drawImage(thisObj.img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
// //                 //console.log(x,y)
// //             	ctx.fillStyle = "green";
// //                 ctx.fillRect( coords.x, coords.y, 10, 10);
// //                 
// //             }
//             
//         }
		var distmin = thisObj.canvas.width + thisObj.canvas.height;
		var imin = 0;
        for (i = 0; i < thisObj.dots.length; i++) {
        	var dist = thisObj.dots[i].distance(coords.x,coords.y);
        	if (dist < distmin) {
        		distmin = dist;
        		imin = i;         	
        	}
        }
        var ctx = thisObj.dot.getContext("2d");
        ctx.drawImage(thisObj.dots[imin].img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
        console.log(thisObj.dots[imin])                                
                
        var x = thisObj.dots[imin].x_canvas;//(thisObj.dots[imin].x +thisObj.offset.x) * thisObj.scaleX;
        var y = thisObj.dots[imin].y_canvas;// + thisObj.offset.y) * thisObj.scaleY;
        //console.log(x,y)
    	var ctx = thisObj.canvas.getContext("2d");
        ctx.drawImage(thisObj.img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
        ctx.fillStyle = "red";
        ctx.fillRect( x, y, 10, 10);       
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
    var offset = this.offset;
    var thisObj = this;
    var xy = {
        //x: (clientX - rect.left)/thisObj.boxDimensionX * thisObj.canvas.width / scaleX - offset.x,
        //y: (clientY - rect.top)/thisObj.boxDimensionY * thisObj.canvas.height / scaleY - offset.y
        x: (clientX - rect.left)/thisObj.canvas.width*scaleX,// - offset.x,
        y: (clientY - rect.top)/thisObj.canvas.height*scaleY// - offset.y

    };
    console.log(thisObj.canvas.width,thisObj.canvas.height)
    var ctx = thisObj.canvas.getContext("2d");
    ctx.drawImage(thisObj.img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
                //console.log(x,y)
    ctx.fillStyle = "green";
    ctx.fillRect( xy.x,xy.y, 10, 10);
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
        //var x = (this.dots[i].x+this.offset.x - rect.left)* this.scaleCoordX
        //var y = (this.dots[i].y+this.offset.y - rect.top) * this.scaleCoordY
        var x = this.dots[i].x_canvas;
        var y = this.dots[i].y_canvas;
        //console.log(x,y)
        ctx.fillRect( x, y, 5, 5)
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
    this.x_canvas = 3.38*this.x
    this.y_canvas = 4.24*this.y

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

Dot.prototype.checkPos = function(x,y,error)
{
	var xs = 0;
  	var ys = 0;
 
  	xs = this.x_canvas - x;
  	xs = xs * xs;
  	ys = this.y_canvas - y;
  	ys = ys * ys; 
  	if (Math.sqrt( xs + ys ) < error)
  	{
  		return true;
  	}
  	return false;
  	}

Dot.prototype.checkPos2 = function(x,y,error)
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

Dot.prototype.distance = function(x,y)
{
	var xs = 0;
  	var ys = 0;
 
  	xs = this.x_canvas - x;
  	xs = xs * xs;
  	ys = this.y_canvas - y;
  	ys = ys * ys; 
  	return Math.sqrt( xs + ys )
}


var cell = new CellView("cell", "dot","data/wf_loc.png");//,987,786);
cell.loadDots(Cell_data);

