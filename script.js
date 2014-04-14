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
