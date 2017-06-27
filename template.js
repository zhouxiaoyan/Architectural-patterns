F.module("template",function(){
	/*
		*模版引擎 处理数据和编译模版入口
		*@param  str 模版容器id或者模版字符串
		*@param  data  渲染数据
	*/
	var _tmpEnginer=function(str,data){
		if(data instanceof Array){
			var html='',
				i=0,
				len=data.length;

			for(;i<len;i++){
				html+=_getTpl(str)(data[i]);
			}

			return html;
		}else{
			return _getTpl(str)(data);
		}
	};
	/*
		*获取模版
		*@param str 模版容器id,或者模板字符串
	*/
	var _getTpl=function(str){
		var ele=document.getElementById(str);
		if(ele){
			var html=/^(textarea|input)$/i.test(ele.nodeName)?ele.value:ele.innerHTML;
			return _compileTpl(html);
		}else{
			return _compileTpl(str);
		}
	};
	var _delTpl=function(str){
		var _left="{%";
		var _right="%}";

		return String(str)
			   .replace(/&lt;/g,"<")
			   .replace(/&gt;/g,">")
			   .replace(/[\r\t\n]/g,'')
			   .replace(new RegExp(_left+'=(.*?)'+_right,'g'),"',typeof($1)==='undefined'?'': $1,'")
			   .replace(new RegExp(_left,'g'),"');")
			   .replace(new RegExp(_right,'g'),"template_array.push('");
	};

	/*
		*编译执行
		*@param str 模版数据
	*/

	var _compileTpl=function(str){
		var fnBody="var template_array=[];\nvar fn=(function(data){\nvar template_key='';\nfor(key in data){\ntemplate_key+=('var '+key+'=data[\"'+key+'\"];');\n}\neval (template_key);\ntemplate_array.push('"+_delTpl(str)+"');\ntemplate_key=null;\n})(templateData);\nfn=null;\nreturn template_array.join('');";
	
		return new Function("templateData",fnBody);		
	};

	return _tmpEnginer;
});