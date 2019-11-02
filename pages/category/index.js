import {request} from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    //左侧的菜单数据
    leftMenuList:[],
    //右侧的菜单数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧商品列表距离顶部的距离
    scrollTop:0
  },
  //接口的返回数据
  Cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
      0.web中的本地存储与小程序中的本地存储的区别
        1.写代码的方式不一样
          web:localStorage.setItem('key','value') localStorage.getItem('key')
          小程序中：wx.setStorageSync('key','value') wx.getStorageSync('key')
        2.存的时候 有没有；类型转换
          web:不管存入的是什么类型，最终都会先调用一下toString(),把数据转换为字符串 在存进去
          小程序:不存在类型转换  存的是什么类型,获取的就是什么类型
    * 1.先判断一下本地存储中有没有旧数据
    * {time:Date.now(),data:[]}
    * 2.没有旧数据 直接发送新请求
    * 3.有旧的数据 同时旧的数据没有过期 就使用本地存储中的旧数据即可
    * */
    //1.获取本地存储数据(小程序中也是有本地存储技术)
    const Cates = wx.getStorageSync("cates");
    //2.判断
    if(!Cates){
      //不存在 发送请求获取数据
      this.getCate();
    }else{
      //有旧的数据  定义过期时间 10s 改成5分钟
      if(Date.now() - Cates.time > 1000 * 10){
        //重新发送请求
        this.getCate()
      }else{
       //可以使用旧的数据
       //  console.log('可以使用旧的数据');
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // async getCate(){
  async getCate(){
    // request({
    //   url:'/categories'
    // }).then(res=>{
    //   this.Cates = res;
    //   //把接口的数据存入到本地存储中
    //   wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    //   //构造左侧的大数据
    //   let leftMenuList = this.Cates.map(v=>v.cat_name);
    //   let rightContent = this.Cates[0].children
    //   this.setData({
    //     leftMenuList,
    //     rightContent
    //   })
    // })
    const res = await request({url:'/categories'})
    this.Cates = res;
    //把接口的数据存入到本地存储中
    wx.setStorageSync("cates", {time:Date.now(),data:this.Cates});
    //构造左侧的大数据
    let leftMenuList = this.Cates.map(v=>v.cat_name);
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  //左侧菜单的点击事件
  handleItemTap(e){
    /*
    * 1.获取被点击标题身上的索引值
    * 2.将data的currentIndex赋值为当前的索引值
    * 3.根据不同的索引来渲染右侧的商品内容
    * */
    const {index} = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent,
      scrollTop:0
    })
  }
})