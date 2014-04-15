var fs = require("fs");
var csv = require("csv");

fs.readFile("./data/coord.txt", function(err, data) {
    if ( err ) throw err;
    var str = data.toString();
    var converted = str.replace(/\t/g, ',');
    var dataArray = [];
    csv().from.string( converted ).to.array( function(data){
        fs.writeFile( "./data/coord.json", "var Cell_data = " + JSON.stringify( data ), function( err )
        {
        	if ( err ) throw err;
        	console.log( "Saved in data/coord.js" );
        });
    });
});
