	/**
			模块化方式适合团队间合作，各成员间互不影响共用一套代码。
			这个机制有点像ng的依赖注入机制。尤其是类似angularJS的
			各个模块之间的以来引用。
		**/
		var F={};
		//创建包管理器
		F.define=function(str,fn){
			//此处为了命名空间，str可直接为一个包的名字，也可以带着自己的路径(即为包所在的命名空间，而不是真实的物理路径。)			
			//比如str的值可以是"string",那么外界引用此包的时候将会在F下边直接找到
			//还可以是"MM.string",那么此包的路径将会是F.MM.string
			var parts=str.split('.'),
				//设置命名空间，默认是当前对象的根节点
				old=parent=this,
				//初始化for循环的i值和len
				i=len=0;
				//当第一个参数的命名空间直接是F时，将第一个路径去掉，防止同名覆盖
				if(parts[0]==='F'){
					parts=parts.slice(1);
				}
				//当复写F下的define和module时不允许操作，不会通过
				if(parts[0]==='define'||parts[0]==='module'){
					return;
				}
				for(len=parts.length;i<len;i++){
					//设置包路径，即包在模块中的命名空间
					if(typeof parent[parts[i]]==="undefined"){
						parent[parts[i]]={};
					}
					//缓存命名空间
					old=parent;
					//
					parent=parent[parts[i]];
				}
				if(fn){
					//将方法挂载到命名空间位置
					old[parts[--i]]=fn();
					//注意此处是fn()而不是fn,所以需要第二个参数是一个返回对象这样才能通过名字调用对象下边的方法
				}
				return this;
		}

		F.module=function(){
				//将参数arguments类数组转换成数组
			var args=[].slice.call(arguments),
				//默认最后一个参数是函数上下文
				fn=args.pop(),
				//取到包的集合或直接命名空间
				parts=args[0]&&args[0] instanceof Array?args[0]:args,
				modules=[],
				modIDs='',
				i=0,
				ilen=parts.length,
				parent,j,jlen;

			while(i<ilen){
				if(typeof parts[i]==='string'){
					parent=this;
					modIDs=parts[i].replace(/^F\./,'').split(".");
					for(j=0,jlen=modIDs.length;j<jlen;j++){
						//按照路径(命名空间)取到包,若不存在则返回false
						parent=parent[modIDs[j]]||false;
					}
					//将取到的包对象添加到模块数组中
					modules.push(parent);
				}else{
					modules.push(parts[i]);
				}
				i++;
			}
			//将回调函数的各项参数与前边定义的包相互对应，则此时各个实参变成包对象
			fn.apply(null,modules);
		};