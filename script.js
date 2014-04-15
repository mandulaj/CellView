//JavaScript
var c = document.getElementById("cell");
var ctx = c.getContext("2d");

ctx.fillStyle = "#0000FF";
ctx.fillRect(450, 0, 450, 450);
ctx.fillStyle = "#000000";
ctx.fillRect(0, 450, 450, 450);
ctx.fillStyle = "#FF0000";
ctx.fillRect(0, 0, 450, 450);
ctx.fillStyle = "#00FF00";
ctx.fillRect(450, 450, 450, 450);


function CellView(canvas)
{
    this.canvas = document.getElementById(canvas);
    this.dots = [];
}

CellView.prototype.loadDots = function()
{
    
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
    this.x = x;
    this.y = y;
}

var cell = new CellView("cell");
cell.canvas.addEventListener("mousemove", function(evt) {
    //console.log(cell.getMousePos(evt))
})