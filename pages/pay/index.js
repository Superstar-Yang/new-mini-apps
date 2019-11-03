// pages/cart/index.js
/*
1页面加载的时候
  1从缓存中获取购物车数据 渲染到页面中
    这些数据 checked = true
  2微信支付
    1那些人 那些账号 可以实现微信支付
      1企业账号
      2企业账号的小程序后台中 必须 给开发者 添加白名单
        1一个appid 可以同时绑定多个开发者
        2这些开发者就可以公用这个appid 和它的开发权限
   3支付按钮
    1先判断缓存中有没有token
    2没有 跳转到授权页面 进行获取token
    3有token
* 引入
* */
import {getSetting,chooseAddress,openSetting,showModal,showToast} from '../../utils/aysncwx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    address:{},
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  onShow(){
    //1.获取缓存中的收货地址
    const address = wx.getStorageSync('address');
    //1.获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    //过滤后的购物车数组
    cart = cart.filter(v=>v.checked)
    this.setData({address})
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v=>{
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
    })
    //给data赋值
    this.setData({
      cart,
      totalPrice,
      totalNum
    })
  },
  handleOrdrPay(e){
    const token = wx.getStorageSync('token');
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      })
    }else{
      console.log('已经存在token');
    }
  }
});