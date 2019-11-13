/*
  0onShow 不同于onLoad 无法在形参上接收options参数
* 1页面打开的时候 触发onshow
*  1获取url的参数
*  2根据type去发送请求获取订单的数据
*  3渲染页面
* 2点击不同的标题 重新发送请求来获取和渲染页面
*
* */
import {request} from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data:{
    orders:[],
    tabs:[
      {
        id:0,
        value:'全部',
        isActive:true
      },
      {
        id:1,
        value:'待付款',
        isActive:false
      },
      {
        id:2,
        value:'待发货',
        isActive:false
      },
      {
        id:3,
        value:'退款/退货',
        isActive:false
      }
    ]
  },
   onShow(options){
    const token = wx.getStorageSync('token');
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      });
      return;
    }
    //1获取当前的小程序的页面栈-数组,长度最大为10
      let pages = getCurrentPages();
      //数组中 索引最大的页面就是当前页面
      let currentPages = pages[pages.length-1];
      const type = currentPages.options;
      this.changeTitleByIndex(type-1);
      this.getOrders(type)
   },
  //获取订单数据的方法
  async getOrders(type){
    var res = await request({url:'/my/orders/all',data:{type}});
    this.setData({
      orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    })
  },
  changeTitleByIndex(index){
    //修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    //3.赋值到data中
    this.setData({
      tabs
    })
  },
  tabsItemChange(e){
    //获取被点击的标题索引
    const {index} = e.detail;
    this.changeTitleByIndex(index)
    this.getOrders(index+1);
  },
})
