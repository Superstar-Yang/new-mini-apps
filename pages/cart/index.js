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
* 引入
* */
import {getSetting,chooseAddress,openSetting} from '../../utils/aysncwx.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    address:{},
    cart:[]
  },
  onShow(){
    //1.获取缓存中的收货地址
    const address = wx.getStorageSync('address');
    //1.获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart');
    this.setData({
      address,
      cart
    })
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
  }

})