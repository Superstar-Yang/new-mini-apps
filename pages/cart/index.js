// pages/cart/index.js
/*
* 1获取用户的收货地址
*  1.绑定点击事件
*  2.调用小程序内置的api 获取用户的收货地址 wx.chooseAddress
* 2获取用户对小程序所授权获取地址的权限状态 scope
*   1.假设 用户 点击获取收货地址的提示框 确定 authSetting scope.address
*     scope值true 直接调用 获取收货地址
*   2.假设用户从来没有调用过 收货地址的api
*     scope undefined 直接调用 获取收货地址
*   3假设用户点击获取收货地址的提示框取消
*     scope值 false
*      1诱导用户 自己打开 授权设置页面(wx.openSetting) 当用户重新给予 获取地址的权限的时候
*      2获取收货地址
*   4把获取的到收货地址存入到 本地存储中
*2 页面加载完成后
*   0 onload onshow
*   1.获取本地存储中的数据
*   2.把数据设置到data中的一个变量
* 3.onshow
*   0回到了商品详情页面 第一次添加商品的时候 手动添加了属性
*     1，num：1
*     2.checked：true
*   1.获取缓存中的购物车数组
*   2.把购物车数据填充到data中
* 4全选的实现  数据的显示
*   1 onshow 获取缓存中的购物车数组
*   2 根据购物车中的商品数据 所有的商品都被选中 checked=true 全选就被选中
* 5总价格以及总数量
*   1都需要商品被选中 来计算
*   2获取购物车的数组
*   3遍历
*   4进行判断是否被选中
*   5总价格 += 商品的单价 * 商品的数量
*   总数量 += 商品的数量
*   6把计算后的价格和数量 设置回data中即可
* 6 商品的选中
*   1绑定change事件
*   2获取到被修改的商品对象
*   3商品对象的选中状态 取反
*   4重新填充回data中和缓存中
*   5重新计算全选 总价格 总数量
* 7全选和反选
*   1全选复选框绑定事件 change
*   2获取data中的全选变量 allchecked
*   3直接取反 allchecked=！allchecked
*   4遍历购物车数组 让里面 商品选中状态跟随 allchecked 改变而改变
*   5把购物车数组和allchecked 重新设置回data把购物车重新设置回缓存中
* 8商品数量的编辑
*   1"+" "-" 按钮绑定同一个点击事件 区分的关键 自定义属性
*     1"+" "+1"
*     2"-" "-1"
*   2传递被点击的商品id goods_id
*   3获取data中的购物车数组 来获取需要被修改的商品对象
*   4当购物车的数量=1 同事 用户点击 "-"
*     弹窗提示 询问用户 是否要删除
*     1确定 直接执行删除
*     2取消 什么都不做
*   5直接修改商品对象的数量 num
*   6把cart数组 重新设置回 缓存中 和data中
* 引入
* */
import {getSetting,chooseAddress,openSetting,showModal,showToast} from '../../utils/aysncwx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    address:{},
    cart:[],
    allchecked:false,
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1.获取缓存中的收货地址
    const address = wx.getStorageSync('address');
    //1.获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || [];
    this.setData({address})
    this.setCart(cart)
  },
  //点击收货地址
  async hondleADDaddress(){
    //获取权限状态
    // wx.getSetting({
    //   success:res=>{
    //     const scopeAddress = res.authSetting["scope.address"]
    //     if(scopeAddress === true || scopeAddress ===undefined){
    //       wx.chooseAddress({
    //         success:res=>{
    //           resolve(res)
    //         },
    //         fail:err=>{
    //           reject(err)
    //         }
    //       })
    //     }else{
    //       wx.openSetting({
    //         success:res=>{
    //           wx.chooseAddress({
    //             success:res=>{
    //               resolve(res)
    //             },
    //             fail:err=>{
    //               reject(err)
    //             }
    //           })
    //         },
    //         fail:err=>{
    //           reject(err)
    //         }
    //       })
    //     }
    //   },
    //   fail:err=>{
    //     reject(err)
    //   }
    // })
    try{
    const res = await getSetting();
    const scopeAddress = res.authSetting["scope.address"]
    if(scopeAddress ===false){
      await openSetting();
    }
    let address = await chooseAddress();
    address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
    wx.setStorageSync('address', address);
    }
    catch(err){
      console.log(err);
    }
  },
  //商品的选中
  handleItemchange(e){
    //获取被修改的商品的id
    const goods_id = e.currentTarget.dataset.id;
    //2 获取购物车数组
    let {cart} = this.data
    //3找到被修改的商品对象
    let index = cart.findIndex(v=>v.goods_id === goods_id);
    //4 选中状态取反
    cart[index].checked = !cart[index].checked
    // 5把购物车数据重新设置回data中和缓存中
    this.setCart(cart)
  },
  //设置购物车状态同事 重新计算 底部工具栏的数据 全选 总价格 总数量...
  setCart(cart){
    //计算全选
    //every 数组方法 会遍历 会接收一个回调函数 那么 每一个回调函数都会返回true 那么 every方法的返回值为true
    //只要 有一个回调函数返回了false 那么不再循环执行,直接返回false
    //空数组 调用every,返回值就是true
    // const allchecked = cart.length?cart.every(v=>v.checked):false;
    let allchecked = true
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      }else{
        allchecked = false
      }
    })
    allchecked = cart.length!=0?allchecked:false;
    //给data赋值
    this.setData({
      cart,
      allchecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync('cart', cart);
  },
  handleItemchangeall(){
    //工具栏的全选
    let {cart,allchecked} = this.data;
    allchecked = !allchecked;
    cart.forEach(v=>v.checked=allchecked);
    this.setCart(cart)
  },
  async handleItemEdit(e){
    //获取传递过来的参数
    const {operation,id}=e.currentTarget.dataset;
    //获取购物车的数组
    let {cart} = this.data;
    //找到需要修改的商品索引
    const index = cart.findIndex(v=>v.goods_id===id);
    //判断是否执行删除
    if(cart[index].num===1 && operation===-1){
      const res = await showModal({content:'您是否要删除？'});
      if(res.confirm){
        cart.splice(index,1);
        this.setCart(cart)
      }
    }else{
      //进行修改数量
      cart[index].num += operation;
      //设置回data以及缓存中
      this.setCart(cart)
    }
  },
  async handlePay(){
    const {address, totalNum} = this.data;
    if(!address.userName){
      await showToast({title:'您还没有选择收货地址'})
      return;
    }
    if(totalNum==0){
      await showToast({title:'您还没有选择商品'})
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
});