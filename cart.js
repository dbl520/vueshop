var vm=new Vue({
	//指向绑定的element(元素)，之后该实例的属性和方法可以在对应元素内使用
	el:"#app",		
	// 绑定的数据(即调用的变量)，可以实时监听变化
	data:{
		// 作者：灿灿 交流方式-QQ:326943819-关注imooc账号->私信
		author:"CanCan",
		// 获取的商品列表
		shopList:[],
		// 全选判定
		checkAll:false,
		// 总价
		total:0
	},
	// 监听数据变化
	watch:{
		// 监听商品列表的变化
		shopList:{
			// 变化后处理的方法，对handler进行方法定义
			handler:function(){
				// 判断每个对象内是否存在checked属性(此不正确逻辑思想，因为如果对象数量内容变化，就不止读取3条，应该用forEach循环处理，大家可发散思维)
				// if(如果三者checked属性全存在，且全为真)
				if(this.shopList[0].checked&&this.shopList[1].checked&&this.shopList[2].checked)
					// this指向当前vm实例，使checkAll属性值为真
					this.checkAll=true;
				else
					// 反之则为假(即checked属性不全存在，或者不全为真时)
					this.checkAll=false;
				// 使总价赋值为0，然后重新计算(通过监听shopList内部的变化，变相达到总价的监听思想，总价的改变绑定到单个元素的改变)
				this.total=0;
				// forEach循环判断，执行计算，ele为传入的当前element，即shopList内的对象
				this.shopList.forEach(function(ele){	
					// 判断当前对象的checked属性是否为真				
					if(ele.checked)
						// 为真时总价+=该对象单价×数量
						this.vm.total+=ele.productPrice*ele.productQuantity;
				});
			},
			// 官方解释：深度观察。(个人实践理解：如果没有此属性的赋值为真，则无法持续监听变化，无论监听属性作何改变，始终只对第一次变化生效)
			deep:true
		}
	},
	// 定义过滤方法
	filters:{
		// 传入原始value然后返回处理后数据
		changePrice:function(value){
			// toFixed(2)：保留两位小数(引用老师原句：该数值应为后端处理传过来的数据，前端进行计算容易丢失精度)
			return "￥"+value.toFixed(2);
		}
	},
	// Vue1.0的ready方法->迁移为mounted
	mounted:function(){
		// 根据官方文档添加$nextTick钩子，以保证该vm已被实例加载
		this.$nextTick(function(){
			// 调用getJson方法(已经在methods内定义)
			this.getJson();
		})
	},
	// 实例内要用到的所有方法
	methods:{
		// 获取data/cartData内的内容(因为我通过vue-resource方法获取该内容始终不成功，所以在"错误时的方法"中获取了list内的内容并且赋值给shopList，此为不正确逻辑)
		getJson:function(){
			// 调用vue-resource插件的$http.get方法，then中第一个function为get成功方法，第二个方法为get失败方法
			// vue-resource学习地址(来自第三方分享，并非本人创作，其内容带来的法律责任与灿灿无关，请自学筛选学习)：http://www.cnblogs.com/axl234/p/5899137.html
			this.$http.get("data/cartData.json").then(function(res){
				console.log("成功");
			},function(res){
				this.shopList=res.data.result.list;
			});
		},
		changeNumber:function(item,flag){
			if(flag>0){
				item.productQuantity++;
			}
			else{
				item.productQuantity--;	
				if(item.productQuantity<1)
					item.productQuantity=1;
			}
		},
		select:function(item){
			if (!item.checked) {
				this.$set(item,"checked",true);
			}
			else
				item.checked=!item.checked;
		},
		selectAll:function(flag){
			var _this=this;
			if(flag){
				this.checkAll=true;
				this.shopList.forEach(function(ele){
					if (!ele.checked) {
						_this.$set(ele,"checked",true);
					}
					else
						ele.checked=true;
				});
			}
			else{
				this.checkAll=false;
				this.shopList.forEach(function(ele){
					if(!ele.checked){
						_this.$set(ele,"checked",false);
					}
					else
						ele.checked=false;
				});
			}
		}
	}
});