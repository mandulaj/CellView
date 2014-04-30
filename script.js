//JavaScript
'use strict' // We must be strict

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

/* CellView - object representing the canvas
 * 
 * CellView.prototype.setup()        - setup object
 * CellView.prototype.loadDots(dots) - loads Dot objects into this.dots array form json file
 * CellView.prototype.getMousePos()  - returns mouse coordinates on true scale
 * CellView.prototype.drawDots()     - draws dots corresponding to x,y coordinates from data on canvas
*/
function CellView(canvas, dot, psf, image) {
    var thisObj = this;
    this.mouseX = 0; // Current X position of mouse
    this.mouseY = 0; // Current Y position of mouse
    this.canvas = document.getElementById(canvas); // DOM object of cell canvas (this is the main cell)
    this.dot = document.getElementById(dot); // DOM object of dot canvas (this is the enlarged image of the dot)
    this.psf = document.getElementById(psf)
    this.img = new Image(); // Main background image
    this.img.src = image; // set the src of background image to `image`
    this.dots = []; // Array of Dot objects
    this.setup(); // setup
    
    this.canvas.width  = CanvasConfig.cell_img_real_width; // set the size of canvas to the correct values at the top of the program
    this.canvas.height = CanvasConfig.cell_img_real_height;
    
    
    this.sizes = {
        canvas: { // The real width of the bg png
            x: this.canvas.width,
            y: this.canvas.height
        },
        canvas_virt: { // Number of pixels in the experiment (virtual pixel)
            x: CanvasConfig.cell_img_vir_width,
            y: CanvasConfig.cell_img_vir_height
        },
        canvas_css: { // The width specified by css (50% -> Npx)
            x: this.canvas.offsetWidth,
            y: this.canvas.offsetHeight
        },
        scale_click: { // Scale for clicking (changes when we resize window)
            x: this.canvas.offsetWidth / this.canvas.width,
            y: this.canvas.offsetHeight / this.canvas.height
        },
        scale_draw: { // Scale for drawing (does not change when we resize the window (only if we change pictures))
            x: this.canvas.width / CanvasConfig.cell_img_vir_width,
            y: this.canvas.height / CanvasConfig.cell_img_vir_height
        }
    }
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
        
        ctx.stroke();
        thisObj.dots[imin].drawSelf(thisObj.canvas, thisObj.dot, thisObj.psf); // Draw small image of Dot and a square at the cell canvas
    });
    
    window.onresize = function() // We must update some of these values when we resize the window (css width/height changes)
    {
        thisObj.sizes = {
            canvas: {
                x: thisObj.canvas.width,
                y: thisObj.canvas.height
            },
            canvas_virt: {
                x: CanvasConfig.cell_img_vir_width,
                y: CanvasConfig.cell_img_vir_height
            },
            canvas_css: {
                x: thisObj.canvas.offsetWidth,
                y: thisObj.canvas.offsetHeight
            },
            scale_click: {
                x: thisObj.canvas.offsetWidth / thisObj.canvas.width,
                y: thisObj.canvas.offsetHeight / thisObj.canvas.height
            },
            scale_draw: {
                x: thisObj.canvas.width / CanvasConfig.cell_img_vir_width,
                y: thisObj.canvas.height / CanvasConfig.cell_img_vir_height
            }
        }
    }
}

CellView.prototype.loadDots = function(array)
{
	for (var i = 0; i < array.length; i++ )
	{
		this.dots.push(new Dot(dataParser(array[i]), this)) // This just creates an array of Dot objects each representing a dot on the cell
	}
}

CellView.prototype.getMousePos = function(clientX,clientY)
{
    var rect = this.canvas.getBoundingClientRect();
    
    var thisObj = this;
    var xy = {
        x: (clientX - rect.left + CanvasConfig.offset.x) / this.sizes.scale_click.x, // We must include the clicking scale here
        y: (clientY - rect.top + CanvasConfig.offset.y) / this.sizes.scale_click.y  // and here
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
        ctx.fillRect( x, y, 5, 5);
    }
}

/* Object representing each dot
 *
 * Dot.prototype.makeImgName(imgNum, dot)  -    create path to image if dot is true of undef ? dot image : psf image 
 * Dot.prototype.distance(x,y)     -  returns distance of Dot to x,y
 * Dot.prototype.drawSelf(cellCanvas, dotCanvas, psfCanvas) - draws a small square on cellCanvas and the image of the Dot on dotCanvas and psf on psfCanvas
 */
function Dot(specs,cell)
{
    this.cell = cell;
    
    this.img        = new Image(); // Enlarged image of the dot
    this.imgName    = this.makeImgName( specs.img_index ); // Generate path to dot image
    
    this.x          = parseFloat( specs.dot_x ); // x coordinate on true scale of background image
    this.y          = parseFloat( specs.dot_y ); // y coordinate on true scale of background image
    
    this.ax_pos     = specs.ax_pos; // axial position (index of image and 1/50 of nm Focus plane)
    this.brightness = specs.brightness; // brightness
    this.correl     = specs.correl; // reliability
    this.eval_index = specs.eval_index; // ?????
    this.psf_img    = new Image(); // Image of psf
    
    this.rect = {
        x1:  this.cell.sizes.scale_draw.x * specs.sqr_x1,
        y1:  this.cell.sizes.scale_draw.y * specs.sqr_y1,
        x2:  this.cell.sizes.scale_draw.x * specs.sqr_x2,
        y2:  this.cell.sizes.scale_draw.y * specs.sqr_y2
    };
    
    
    
    this.x_canvas = this.cell.sizes.scale_draw.x * this.x // this is the scale between the pixels of the image and the original data
    this.y_canvas = this.cell.sizes.scale_draw.y * this.y

}

Dot.prototype.makeImgName = function(imgNum, dot)
{
    // In case of the actual image of a dot `dot` can be left undefined or true
    // This constructs the image name using the dot_xxxxxxx config
    if (typeof dot === "undefined" || dot)
    {
        var path = CanvasConfig.data_path,
            prfix = CanvasConfig.data_prefix,
            sufix = CanvasConfig.data_sufix,
            num = "";
        for ( var i = 0; i < (CanvasConfig.data_num_of_0 - imgNum.length); i++ )
        {
            num += "0"
        }
    }
    else // If dot is set explicitly to false, we will use the config for psf and construct a psf version of the img name.
    {
        var path = CanvasConfig.psf_path,
            prfix = CanvasConfig.psf_prefix,
            sufix = CanvasConfig.psf_sufix,
            num = "";
        for ( var i = 0; i < (CanvasConfig.psf_num_of_0 - imgNum.length); i++ )
        {
            num += "0"
        }
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

Dot.prototype.drawSelf = function(cellCanvas, dotCanvas, psfCanvas)
{
    if(this.img.width === 0) // Load dot image only if not yet loaded
    {
        thisObj = this;
        this.img.onload = function() // Only draw it when it has finished loading
        {
            var ctx = dotCanvas.getContext("2d");
            ctx.drawImage(thisObj.img, 0, 0, dotCanvas.width, dotCanvas.height); // Draw it on the canvas
        }
        this.img.src = this.imgName;
    }
    else
    {
        var ctx = dotCanvas.getContext("2d");
        ctx.drawImage(this.img, 0, 0, dotCanvas.width, dotCanvas.height); // Draw it on the canvas
    }
    
    if(this.psf_img.width === 0) // Load psf image only if not yet loaded
    {
        var thisObj = this;
        this.psf_img.onload = function() // Only draw it when it has finished loading
        {
            var ctx = psfCanvas.getContext("2d");
            ctx.drawImage(thisObj.psf_img, 0, 0, dotCanvas.width, dotCanvas.height); // Draw it on the canvas
        }
        this.psf_img.src = this.makeImgName(this.ax_pos, false); // Draw it on the canvas
    }
    else
    {
        var ctx = psfCanvas.getContext("2d");
        ctx.drawImage(this.psf_img, 0, 0, dotCanvas.width, dotCanvas.height);
    } 
    
    // Draw small red dot on the canvas highlighting the dot
    var ctx = cellCanvas.getContext("2d");
    ctx.drawImage(this.cell.img ,0, 0, this.cell.canvas.width, this.cell.canvas.height)
    
    // Draw the green square showing the par of image that the enlargement is showing
    ctx.beginPath();
    ctx.lineWidth="2";
    ctx.strokeStyle = CanvasConfig.rect_color_on_canvas;
    ctx.rect(this.rect.x1,this.rect.y1,this.rect.x2 - this.rect.x1,this.rect.y2 - this.rect.y1); 
    
    ctx.fillStyle = CanvasConfig.dot_color_on_canvas;
    var bs = CanvasConfig.dot_size_on_canvas;
    ctx.fillRect( this.x_canvas + CanvasConfig.dot_offset_on_canvas.x, this.y_canvas + CanvasConfig.dot_offset_on_canvas.y, bs, bs);
    ctx.stroke();
    
    // Set the text values to that of this Dot
    document.getElementById("fpn").innerHTML = this.ax_pos * 50;
    document.getElementById("brn").innerHTML = this.brightness;
    document.getElementById("ren").innerHTML = this.correl;
    
    
}

var cell = new CellView("cell", "dot", "psf", "data/wf_loc.png");
cell.loadDots(Cell_data);

