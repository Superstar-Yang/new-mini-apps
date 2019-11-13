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
    4创建订单 获取订单编号
    5已经完成微信支付
    6手动删除缓存中 已经被选中的商品
    7删除后的购物车数据 填充回缓存中
    8在跳转页面
* 引入
* */
import {getSetting, chooseAddress, openSetting, showModal, showToast,requestPayment} from '../../utils/aysncwx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from "../../request/index.js";

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    //1.获取缓存中的收货地址
    const address = wx.getStorageSync('address');
    //1.获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || [];
    //过滤后的购物车数组
    cart = cart.filter(v => v.checked)
    this.setData({address})
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
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
  async handleOrderPay(e) {
   try{
     //1判断缓存中有没有token
     const token = wx.getStorageSync('token');
     //2判断
     if (!token) {
       wx.navigateTo({
         url: '/pages/auth/index'
       })
       return;
     }
     //3创建订单
     //准备 请求头参数
     // const header = {Authorization: token};
     //准备请求参数
     const order_price = this.data.totalPrice;
     const consignee_address = this.data.address;
     const cart = this.data.cart;
     let goods = [];
     cart.forEach(v => goods.push({
       goods_id: v.goods_id,
       goods_number: v.num,
       goods_price: v.goods_price
     }))
     const orderParams = {order_price, consignee_address, goods}
     //4准备发送请求 创建订单 获取订单编号
     const {order_number} = await request({url: 'my/orders/create', method: 'POST', data:orderParams});
     //5发起预支付的接口
     const {pay}= await request({url: 'my/orders/req_unifiedorder', method: 'POST', data:{order_number}})
     //6发起微信支付
     await requestPayment(pay);
     //7查询后台 订单状态
     const res = await  request({url:'my/orders/chKOrder',methods:'POST',data:{ order_number }})
     await showToast({
       title: '支付成功'
     })
     //8手动删除缓存中 已经支付了的商品
     let newCart = wx.getStorageSync('cart');
     newCart=newCart.filter(v=>!checked);
     wx.setStorageSync('cart', newCart);
     //支付成功 跳转到订单页面
     wx.navigateTo({
       url:'pages/order/index'
     })
    }catch(err){
     wx.showToast({
       title: '支付失败'
     })
    }
  }
});