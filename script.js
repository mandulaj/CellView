//JavaScript

function CellView(canvas, image, width, height) {
    
    this.canvas = document.getElementById(canvas);
    this.img = new Image();
    this.img.src = image;
    this.dots = [];
    this.setup();
    this.trueW = width;
    this.trueH = height;
    this.scale = width/500;
    this.offset = {x: 8, y:-6}
}

CellView.prototype.setup = function()
{
    var thisObj = this;
    this.img.onload = function () {
        var ctx = thisObj.canvas.getContext( "2d" );
        ctx.drawImage( thisObj.img, 0, 0, 500, 500 );
    }
    this.canvas.addEventListener("mousemove", function(evt) 
    {
        var coords = thisObj.getMousePos(evt);
        for ( var i = 0; i< thisObj.dots.length; i++ )
        {
            if (thisObj.dots[i].checkPos(coords.x,coords.y,0.5))
            {
                console.log(thisObj.dots[i].imgName) 
                break;
            }
            
        }
    })
}

CellView.prototype.loadDots = function(array)
{
	for (var i = 0; i < array.length; i++ )
	{
		this.dots.push(new Dot(array[i][1], array[i][2], array[i][0]))
	}
}

CellView.prototype.getMousePos = function(evt)
{
    var rect = this.canvas.getBoundingClientRect();
    var scale = this.scale;
    var offset = this.offset;
    var xy = {
        x: (evt.clientX - rect.left) * scale - offset.x,
        y: (evt.clientY - rect.top) * scale - offset.y
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
        console.log(x,y)
        console.log(this.scale)
        ctx.fillRect( x, y, 4, 4)
    }
}


function Dot(x,y,img)
{
    this.img = new Image();
    this.imgName = this.makeImgName(img);
    this.x = parseFloat(x);
    this.y = parseFloat(y);
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


var cell = new CellView("cell","data/wf_loc.png",39,39);
cell.loadDots(Cell_data);

