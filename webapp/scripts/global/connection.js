var connection = {
	init:function() {
		//拼接cometd服务器url
		var cometdURL = location.protocol + "//" + location.host + "/caa-push-rpc/cometd";
    	$.cometd.configure({
    		url: cometdURL,
    		logLevel: 'info'
    	});
    	$.cometd.handshake();
	},
	register:function(path,msgHandler){
		$.cometd.subscribe(path, function(message){
			msgHandler();
		});
	}
}
connection.init();