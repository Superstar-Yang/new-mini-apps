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
 4页面收藏
  1页面onshow 的时候 加载缓存中的商品收藏数据
  2判断当前商品是不是被收藏
    1是 改变页面的图标
    3 不是。。。
  3点击商品收藏按钮
   1判断该商品否存在于缓存数组中
   2已经存在 把该商品删除
   3没有存在 把商品加到收藏数组中 存入到缓存中即可
 */
Page({
  data: {
    goodsObj:{},
    isCollect:false
  },
  //商品对象
  GoodsInfo:{},
  onShow: function () {
    let pages = getCurrentPages()
    let currentPages = pages[pages.length-1];
    let options = currentPages.options
    const {goods_id} = options;
    this.getgoodsDetail(goods_id)
  },
  //获取商品详情数据
 async getgoodsDetail(goods_id){
   const res = await request({url:'/goods/detail',data:{goods_id}})
   this.GoodsInfo = res;
   //获取缓存中收藏的数组
   let collect= wx.getStorageSync('collect') || [];
   //判断该商品是否存在于缓存数组中
   let isCollect = collect.some(v=>{v.goods_id===this.GoodsInfo.goods_id})
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
  },
  handleChangeCollect(){
    let isCollect = false;
    //获取缓存中的收藏商品、
    let collect= wx.getStorageSync('collect') || [];
    //判断该商品是否存在于缓存中
    let index = collect.findIndex(v=>v.goods_id === this.GoodsInfo.goods_id);
    //当index！==-1 表示已经收藏过
    if(index!==-1){
      //能找到 已经收藏过 在数组中删除该商品
      collect.splice(index,1)
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon:'success',
        mask:true
      })
    }
    else{
      //没有收藏过
      collect.push(this.GoodsInfo)
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon:'success',
        mask:true
      })
    }
   wx.setStorageSync('collect', collect);
    this.setData({
      isCollect
    })
  }
})