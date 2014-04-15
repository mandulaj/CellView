//JavaScript
var c = document.getElementById("cell");
var ctx = c.getContext("2d");

function CellView(canvas)
{
    this.canvas = document.getElementById(canvas);
    this.dots = [];
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
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function Dot(x,y,img)
{
    this.img = new Image();
    this.imgName = this.makeImgName(img);
    this.x = x;
    this.y = y;
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

var cell = new CellView("cell");
cell.loadDots(Cell_data)

cell.canvas.addEventListener("mousemove", function(evt) {
    //console.log(cell.getMousePos(evt))
})
