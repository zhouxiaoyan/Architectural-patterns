F.module("event",function(){
	return {
		on:function(dom,type,cb){
			dom["on"+type]=cb;
		}
	}
});