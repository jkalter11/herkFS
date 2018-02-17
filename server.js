var http 	= require("http");
var fs 		= require("fs");
var path 	= require("path")


var port = process.env.PORT || 3001;

var server = http.createServer(function(req,res){

	console.log(req.url)

	if (req.method === "GET" && req.url == "/") {

			readDirectory("./store",res);
			
	}
	else if (req.method === "GET") {

		sendFile(req,res)
	}
	else{
		res.end();
	}
	

}).listen(port,()=>console.log("listening at",port))



function sendFile(req,res){

	var url = req.url.split("%20").join(" ");
	var urlsplit = url.split("/");
	var filename = urlsplit[urlsplit.length-1];
	filename = filename.split("%20").join(" ");

	var fileExt = filename.split(".");

	fileExt =  fileExt[fileExt.length-1];

	if (fileExt === "pdf") {

	var filePath = path.join(__dirname,url);
    var stat = fs.statSync(filePath);

    res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Length': stat.size
    });

    var readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    }
    else if(fileExt === "ico"){
    	res.end();
    }
    else{
    	//console.log(req.url)
    	readDirectory("."+req.url,res);
    }

}


function readDirectory(dir,res){

	dir = dir.split("%20").join(" ");

	fs.readdir(dir,(err,files)=>{

	var filesList = "<html \
					 <head>\
					 <title>SharaStore</title>\
					 </head>\
					 <body>\
					 <h1>Files Listing: </h1>\
					 "

	files.forEach((file)=>{

		filesList += ( `<a href="`+dir.substr(1)+`/`+file+`">` + file + `</a><br>`);
	})

	filesList += "</body></html>";

	res.writeHead(200,{
		'Content-Type':'text/html',
		'Content-Length':Buffer.byteLength(filesList)
	})



	res.write(filesList)
	res.end();

	})

}

