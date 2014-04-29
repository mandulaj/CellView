//JavaScript

function dataParser(array) //Generates a nice object with which the work is easy
{
    return {
        img_index:  array[0],
        dot_x:      array[2],
        dot_y:      array[1],
        ax_pos:     array[3],
        brightness: array[4],
        correl:     array[5],
        eval_index: array[6],
        sqr_x1:     array[8],
        sqr_y1:     array[7],
        sqr_x2:     array[10],
        sqr_y2:     array[9]
    }
    
}

/* CellView - object reperesenting the canvas
 * 
 * CellView.prototype.setup()        - setup object
 * CellView.prototype.loadDots(dots) - loads Dot objects into this.dots array form json file
 * CellView.prototype.getMousePos()  - returns mouse coordinates on true scale
 * CellView.prototype.drawDots()     - draws dots corresponding to x,y coordinates from data on canvas
*/
function CellView(canvas, dot, image) {
    var thisObj = this;
    this.mouseX = 0; // Current X position of mouse
    this.mouseY = 0; // Current Y position of mouse
    this.canvas = document.getElementById(canvas); // DOM object of cell canvas (this is the main cell)
    this.dot = document.getElementById(dot); // DOM object of dot canvas (this is the enlarged image of the dot)
    
    this.img = new Image(); // Main background image
    this.img.src = image; // set the src of background image to `image`
    this.dots = []; // Array of Dot objects
    this.setup(); // setup
}

CellView.prototype.setup = function () {
    var thisObj = this;
    this.img.onload = function () { // Initial paint of background image
        var ctx = thisObj.canvas.getContext("2d");
        ctx.drawImage(thisObj.img, 0, 0, thisObj.canvas.width, thisObj.canvas.height);
    };
    this.canvas.addEventListener("mousemove", function (evt) { // Updates the mouseX and mouseY to current mouse position on move of the mouse
        thisObj.mouseX = evt.clientX;
        thisObj.mouseY = evt.clientY;
    });
    this.canvas.addEventListener("mousedown", function () { // Whenever we click on the cell canvas
        var coords_canvas = thisObj.getMousePos(thisObj.mouseX, thisObj.mouseY), // Where we clicked
            i = 0, // index of Dot we are at in loop
            distmin = thisObj.canvas.width + thisObj.canvas.height, // the minimal distance we have seen
            imin = 0, // index of Dot in array that is nearest to where we clicked
            dist = 0; // distance to the Dot we are at in the loop
        
        for (i = 0; i < thisObj.dots.length; i++) {
            dist = thisObj.dots[i].distance(coords_canvas.x,coords_canvas.y);
        	if (dist < distmin) {
        		distmin = dist;
        		imin = i;         	
        	}
        }
        
        var ctx = thisObj.canvas.getContext("2d");
        ctx.drawImage(thisObj.img, 0, 0, thisObj.canvas.width, thisObj.canvas.height); // repaint the background
        thisObj.dots[imin].drawSelf(thisObj.canvas, thisObj.dot); // Draw small image of Dot and a square at the cell canvas
    });
}

CellView.prototype.loadDots = function(array)
{
	for (var i = 0; i < array.length; i++ )
	{
		this.dots.push(new Dot(dataParser(array[i])))
	}
}

CellView.prototype.getMousePos = function(clientX,clientY)
{
    var rect = this.canvas.getBoundingClientRect();
    var scaleX = this.scaleX;
    var scaleY = this.scaleY;
    
    var thisObj = this;
    var xy = {
        x: clientX - rect.left + CanvasConfig.offset.x,
        y: clientY - rect.top + CanvasConfig.offset.y
    };
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
 * Dot.prototype.drawSelf(cellCanvas, dotCanvas) - draws a small square on cellCanvas and the image of the Dot on dotCanvas
 */
function Dot(specs)
{
    
    this.img        = new Image(); // Enlarged image of the dot
    this.imgName    = this.makeImgName( specs.img_index ); // Generate path to dot image
    
    this.x          = parseFloat( specs.dot_x ); // x coordinate on true scale of background image
    this.y          = parseFloat( specs.dot_y ); // y coordinate on true scale of background image
    
    this.ax_pos     = specs.ax_pos;
    this.brightness = specs.brightness;
    this.correl     = specs.correl;
    this.eval_index = specs.eval_index;
    
    this.rect = {
        x1:  specs.sqr_x1,
        y1:  specs.sqr_y1,
        x2:  specs.sqr_x2,
        y2:  specs.sqr_y2
    };
    
    
    this.x_canvas = 3.3345 * this.x // this is the scale between the pixels of the image and the original data
    this.y_canvas = 3.3345 * this.y

}

Dot.prototype.makeImgName = function(imgNum)
{
    var path = CanvasConfig.data_path,
        prfix = CanvasConfig.data_prefix,
        sufix = CanvasConfig.data_sufix,
        num = "";
	
    for ( var i = 0; i < (CanvasConfig.data_num_of_0 - imgNum.length); i++ )
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

Dot.prototype.drawSelf = function(cellCanvas, dotCanvas)
{
    if(this.img.width === 0)
    {
        thisObj = this;
        this.img.onload = function()
        {
            var ctx = dotCanvas.getContext("2d");
            ctx.drawImage(thisObj.img, 0, 0, dotCanvas.width, dotCanvas.height);
        }
        this.img.src = this.imgName;
    }
    else
    {
        
        var ctx = dotCanvas.getContext("2d");
        ctx.drawImage(this.img, 0, 0, dotCanvas.width, dotCanvas.height);
    }
    
    var ctx = cellCanvas.getContext("2d");
    ctx.fillStyle = CanvasConfig.dot_color_on_canvas;
    var bs = CanvasConfig.dot_size_on_canvas;
    ctx.fillRect( this.x_canvas + CanvasConfig.dot_offset_on_canvas.x, this.y_canvas + CanvasConfig.dot_offset_on_canvas.y, bs, bs);
    ctx.stroke();
    
    if (this.rect !== 0)
    {
        ctx.beginPath();
        ctx.lineWidth="2";
        ctx.strokeStyle = CanvasConfig.rect_color_on_canvas;
        ctx.rect(this.rect.x1,this.rect.y1,this.rect.x2,this.rect.y2); 
        ctx.stroke();
    }
}

var cell = new CellView("cell", "dot","data/wf_loc.png");//,987,786);
cell.loadDots(Cell_data);

