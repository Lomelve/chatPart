var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
mongoose = require('mongoose')

var onlineuser ={};

app.get("/",function(req,res){
	res.sendFile(__dirname+"/index.html");

});
io.sockets.on("connection",function(socket){
	//users.push(socket);
//	console.log("New user connected "+users.length),

	socket.on("disconnect",function(){
		delete onlineuser[socket.username];
		//users.splice(users.indexOf(socket),1);
		//onlineuser.splice(onlineuser.indexOf(socket.username),1);
		//console.log("User disconnected "+users.length);
		updateuser();
	});

	socket.on("new user",function(data){
		socket.username = data;
		onlineuser[socket.username]=socket;
		console.log("user conected "+onlineuser);
		updateuser();
	});

	socket.on("msg",function(data){
		var msg= data.trim();
		var ind=msg.indexOf('*');
		if(msg.substr(0,3) === '/w*')
		
		{	
			msg=msg.substr(3);
			var name=msg.substring(0 ,msg.indexOf(' '));
			if(ind!== -1){
				if(name in onlineuser){
					
					console.log("name is "+name);
					onlineuser[name].emit("privatemsg",{name:socket.username,msg:msg}); //2.msg trimlenmiş olan
				}

				else
				console.log("Please enter a valid user");
				
			}	
			else
			console.log("Enter a message");


		}
		
		else 
	io.sockets.emit("rmsg",{name:socket.username,msg:data});

	


	});

	function updateuser(){
		io.sockets.emit("get user",Object.keys(onlineuser));
	}

});


var port=process.env.PORT || 1234;
http.listen(port,"0.0.0.0",function(){
console.log("Server Created with port 1234");
});