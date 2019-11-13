// pages/search/index.js
/*
* 1 输入框绑定 值改变事件 input事件
*   1获取到输入框的值
*   2合法性判断
*   3检验通过 把输入框的值发送到后台
*   4返回的数据打印到页面上
*2 防抖(防止抖动) 定时器 节流
*   0 防抖 一般 输入框中 防止重复输入 重复发送请求
*   1 节流 一般是用在页面下拉和上拉中
* 定义全局的定时器id
* */
import {request} from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    isShow:false,
    inpValue:''
  },
timeId:-1,
  /**
   * 生命周期函数--监听页面加载
   */
  //输入框的值改变了就会触发的事件
  handleChangeInput(e){
    //1获取输入框的值
    const {value} = e.detail;
    //2检测合法性判断
    if(!value.trim()){
      this.setData({
        goods:[],
        isShow:false
      })
      //值不合法
      return;
    }
    //准备发送请求获取数据
    this.setData({
      isShow:true
    })
    clearTimeout(this.timeId)
    this.timeId = setTimeout(()=>{
      this.qsearch(value)
    },1000)

  },
  //发送请求获取搜索建议的数据
  async qsearch(query){
    const res = await request({url:"/goods/qsearch",data:{query}})
    this.setData({
      goods:res
    })
  },
  handleCancel(){
    this.setData({
      goods:[],
      isShow:false,
      inpValue:""
    })
  }
})