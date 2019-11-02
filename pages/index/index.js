//0 引入 用来发送请求的方法   一定要把路径补全
import {request} from '../../request/index'
Page({
  data: {
    //轮播图数组
    swiperList:[],
    //导航数组
    catesList:[],
  //  楼层数据
    floorList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //  发送异步请求获取轮播图数据
  //   wx.request({
  //     url:'https://api.zbztb.cn/api/pubilc/v1/home/swiperdata',
  //     success:(result)=>{
  //       this.setData({
  //         swiperList:result.data.message
  //       })
  //     },
  //   })
    this.getswiperList()
    this.getcatesList()
    this.getfloorList()
    },
  //获取轮播图数据
  getswiperList(){
    request({url:'/home/swiperdata'})
      .then(res=>{
        this.setData({
          swiperList:res
        })
      })
    },
  getcatesList(){
    request({url:'/home/catitems'})
        .then(res=>{
          this.setData({
            catesList:res
          })
        })
  },
  getfloorList(){
    request({url:'/home/floordata'})
        .then(res=>{
          this.setData({
            floorList:res
          })
        })
  }
});