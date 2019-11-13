// pages/feedback/index.js
/*
* 1点击"+"触发tap点击事件
*   1调用小程序内置的选择图片的api
*   2获取到图片路径数组
*   3把图片路径 存到data的变量中
*   4页面就可以根据图片数组进行循环显示自定义组件
* 2点击 自定义图片组件
*   1获取点击的元素的索引
*   2获取data中的图片数组
*   3根据索引 数组中删除对应的元素
*   4把数组重新设置回data中
* 3点击"提交"
*   1获取文本域的内容  类似 输入框的获取
*     1data中定义变量 表示 输入框内容
*     2文本域 绑定 输入文件 事件触发的时候 把输入框的值 存入到变量中
*   2对这些内容 合法性验证
*   3验证通过 用户选择的图片 上传至专门的图片服务器 返回图片外网的链接
*     1遍历图片数组
*     2挨个上传
*     3自己在维护图片数组 存放 图片上传后的外网的链接
*   4文本域 和 外网的图片路径 一起提交到服务器 前端的模拟 不会发送请求到后台...
*   5清空当前页面
* 6返回上一页
* */
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投资',
        isActive: false
      }
    ],
    chooseImgs: [],
    textVal: ""
  },
  //外网图片的路径数组
  upLoadImgs:[],
  tabsItemChange(e) {
    //获取被点击的标题索引
    const {index} = e.detail;
    //修改原数组
    let {tabs} = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    //3.赋值到data中
    this.setData({
      tabs
    })
  },
  handleChangeImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...res.tempFilePaths]
        })
      }
    });
  },
  handleRemoveImg(e) {
    const {index} = e.currentTarget.dataset;
    let {chooseImgs} = this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },
  //文本域的输入事件
  handleTextInp(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  //提交按钮的点击
  handleFromSubmit() {
    //获取文本域的内容 图片数组
    const {textVal, chooseImgs} = this.data;
    //合法性判断
    if (!textVal.trim()) {
      //不合法
      wx.showToast({
        title: '输入有误',
        icon: 'none',
        mask: true
      });
      return;
    }
    //准备上传图片到专门的服务器
    //上传文件的api 不支持 多个文件同时上传 遍历数组 挨个上传
    //显示正在等待的图标
    wx.showLoading({
      title:'正在上传中',
      mask: true,
    })
    //判断有没有需要上传的图片数组
    if(chooseImgs!=0){
    chooseImgs.forEach((v, i) => {
      wx.uploadFile({
        //图片要上传到哪里
        url: 'https://images.ac.cn/Home/Index/UploadAction/',
        //被上传的文件路径
        filePath: v,
        //上传文件的名称   后台来获取文件 file
        name: 'file',
        //顺带的文本信息
        fromData: {},
        success: res => {
          console.log(res);
          let url = JSON.parse(res.data).url;
          console.log(url);
          this.upLoadImgs.push(url);
          //所有的图片都上传完毕了 才触发的事件
          if(i===chooseImgs.length-1){
            wx.hideLoading();
            console.log('把文本的内容和所有图片数组提交到后台中');
            //提交成功
            this.setData({
              textVal:'',
              chooseImgs:[]
            })
            //返回上一个页面
            wx.navigateBack({
              delta:1
            })
          }
        }
      })
    })
    }else{
      wx.hideLoading();
      console.log('只是提交了文本');
      wx.navigateBack({
        delta:1
      })
    }
  },
})