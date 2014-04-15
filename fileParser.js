var fs = require("fs");
var csv = require("csv");

fs.readFile("./data/coord.txt", function(err, data) {
    if ( err ) throw err;
    var str = data.toString()
    var converted = str.replace(/\t/g, ', ');
    var dataArray = [];
    csv().from.string(converted).to.array(function(data){
        dataArray = data;
        console.log(dataArray)
    })
    
})