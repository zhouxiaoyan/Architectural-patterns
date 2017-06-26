F.module("dom",function(){
	return {
		g:function(id){
			return document.getElementById(id);
		},
		html:function(id,html){
			if(html){
				this.g(id).innerHTML=html;
				return;
			}else{
				return this.g(id).innerHTML;
			}
		}
	}
})