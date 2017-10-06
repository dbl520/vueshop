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
		total:0,
		// 弹窗的控制
		delFlag:false,
		// 删除的索引
		delIndex:null
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
				// 不知道为什么我总是获取失败，为了不影响演示，就在失败方法中获取了数据，成功方法仅为打印
				// 如果有同学获取成功，可以console.log一下res然后获取正确的参数到shopList即可
				console.log("成功");
				// 失败方法
			},function(res){
				// 成功获取json内容
				this.shopList=res.data.result.list;
			});
		},
		// 调整数量的方法，flag判断加减
		changeNumber:function(item,flag){
			// 大于0为加
			if(flag>0){
				// item数量自增1
				item.productQuantity++;
			}
			// 小于0
			else{
				// item数量自减1
				item.productQuantity--;	
				// 如果数量小于1
				if(item.productQuantity<1)
					// 始终赋值为1，则数量无法小于1
					item.productQuantity=1;
			}
		},
		// 选中方法item为选中的元素
		select:function(item){
			// 如果该item的checked属性为false或者不存在
			if (!item.checked) {
				// 则$set设置checked属性为true，并且加入对象的监听，如果直接item.checked=true，就无法监听，重点。
				this.$set(item,"checked",true);
			}
			// checked为真
			else
				// 取反
				item.checked=!item.checked;
		},
		// 全选方法，flag判断全选或者取消全选
		selectAll:function(flag){
			// 先在顶部获取到该vm势力，因为在forEach内部，通过打印this，发现作用域指向的是Windows对象
			// 尽管在内部通过this.vm.同样可以获取到相同内容，但是显然与我们构思不符合，即不可取
			var _this=this;
			// 如果flag为真
			if(flag){
				// vm对象的checkAll属性赋值为真
				this.checkAll=true;
				// 遍历shopList属性，参数ele为当前遍历的对象
				this.shopList.forEach(function(ele){
					// 同上理，如果该对象不存在checked属性，或者为false
					if (!ele.checked) {
						// 赋值为真并且监听
						_this.$set(ele,"checked",true);
					}
					// 通过逻辑构思发现下面两行代码为多余，即else条件其实就是checked为true，不必要重复去赋值
					// 保留下来给大家警示，一定要明晰自己的逻辑，尽量少做冗余的代码
					// else
					// 	  ele.checked=true;
				});
			}
			// 如果flag为假，即取消全选
			else{
				// 反向操作
				this.checkAll=false;
				// 反向操作，再次强调：$set赋值整个Vue实例才会对其进行监听*3
				this.shopList.forEach(function(ele){
					// 判断条件与之前相反
					if(ele.checked){
						_this.$set(ele,"checked",false);
					}
					// 同理，多余操作
					// else
					// 	ele.checked=false;
				});
			}
		},
		// 如老师所说，应该通过ajax后台删除，前台仅表现逻辑思维
		// 删除按钮的方法
		dele:function(item){
			// 通过this.shopList.indexOf方法查找到item在该对象的索引并且保存下来
			this.delIndex=this.shopList.indexOf(item);
			// 控制弹窗的显示
			this.delFlag=true;
		},
		// 删除商品的方法
		deleShop:function(){
			// 通过官方$delete方法，传入--参数一：欲参与删除的对象；参数二：删除的索引位置。实现删除
			this.$delete(this.shopList,this.delIndex);
			// 关闭弹窗的显示
			this.delFlag=false;
		}
	}
});