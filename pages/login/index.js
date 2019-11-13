// pages/login/index.js
Page({
  handleGetUserInfo(e){
    //获取数据
    console.log(e);
    const { userInfo } = e.detail;
    wx.setStorageSync('userinfo',userInfo);
    wx.navigateBack({
      delta:1
    })
  }
})