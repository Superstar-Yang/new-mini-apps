/*
* 1.用户上滑页面 滚动条触底 开始加载下一条数据
  * 2.判断还有没有下一页数据
  * 3，假如没有下一页数据 弹出一个提示
  * 4.假如还有下一页数据 加载下一页数据
  *   1.当前的页码++
  *   2.重新发送请求
  *   3.数据请求回来后  要对data中数组 进行拼接 而不是全部替换
* 2.下拉刷新页面
*    1.触发下拉刷新事件  需要在json文件中开启一个配置项
*      找到下拉刷新的事件
*    2.重置 数据数组
*    3.重置页码 设置为1
*    4.重新发送请求
*    5.数据请求回来，手动关闭刷新的效果
* */
import {request} from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    tabs:[
      {
        id:0,
        value:'综合',
        isActive:true
      },
      {
        id:1,
        value:'销量',
        isActive:false
      },
      {
        id:2,
        value:'价格',
        isActive:false
      },
    ],
    goods_List:[]
  },
  //接口需要的参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10,
    // total:23
  },
  Totalpages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    this.getGoodsList()
  },
  //获取商品列表数据
  async getGoodsList(){
    const res = await request({url:'/goods/search'},{data:this.QueryParams})
    this.Totalpages = Math.ceil(res.total/this.QueryParams.pagesize);
    this.setData({
      goods_List : [...this.data.goods_List,...res.goods]
    })
    wx.stopPullDownRefresh();
  },
//  标题的点击事件
  tabsItemChange(e){
    //获取被点击的标题索引
    const {index} = e.detail;
    //修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    //3.赋值到data中
    this.setData({
      tabs
    })
  },
  onReachBottom(){
    if(this.QueryParams.pagenum >= this.Totalpages){
      wx.showToast({title: '没有下一页'})
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList()
    }
  },
  //下拉刷新事件
  onPullDownRefresh(){
    this.setData({
      goods_List:[]
    })
    this.QueryParams.pagenum=1;
    this.getGoodsList()
  }
})