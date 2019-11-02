import {request} from '../../request/index';
import regeneratorRuntime from '../../lib/runtime/runtime';
/*1发送请求获取数据
2.点击轮播图 预览大图
  1给轮播图绑定点击事件
  2.调用小程序的api previewImage
3.点击假如购物车
  1.先绑定点击事件
  2.获取缓存中的购物车数据 数组格式
  3.先判断  当前的商品是否存在与 购物车中
  4.如果存在 修改购物车数量  执行购物车数量++ 重新把购物车数组 填充回缓存中
  5.不存在的直接添加新元素 新元素带上 购物数量属性num 重新把购物车数组 填充回缓存中
  6.弹出提示
 */
Page({
  data: {
    goodsObj:{}
  },
  //商品对象
  GoodsInfo:{},
  onLoad: function (options) {
    const {goods_id} = options;
    this.getgoodsDetail(goods_id)
  },
  //获取商品详情数据
 async getgoodsDetail(goods_id){
  const res = await request({url:'/goods/detail',data:{goods_id}})
  this.GoodsInfo = res;
   this.setData({
     goodsObj:{
       goods_name:res.goods_name,
       goods_price:res.goods_price,
       pics:res.pics,
       goods_introduce:res.goods_introduce.replace(/\.webp/g,'.jpg')
     }
   })
 },
  //点击轮播图 放大预览
  handlepreviewImage(e){
    //先构造预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    //接收传递过来的图片url
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls
    })
  },
  hondleCartAdd(){
    //1先获取缓存中的数据
    let cart = wx.getStorageSync('cart')||[];
    //2.判断对象是否存在于购物车数组中
    let index = cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id)
    if(index===-1){
      //3不存在
      this.GoodsInfo.num=1;
      this.GoodsInfo.checked=true;
      cart.push(this.GoodsInfo)
    }else{
      //4已经存在  就执行num++
      cart[index].num++
    }
    //5把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    //6弹窗提示
    wx.showToast({
      title: '加入成功',
      mark:true
    })
  }
})