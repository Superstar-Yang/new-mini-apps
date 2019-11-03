// pages/auth/index.js
import regeneratorRuntime from '../../lib/runtime/runtime';
import {request} from '../../request/index';
import { login } from '../../utils/aysncwx.js';
Page({
  async handleGetUserInfo(e){
    try{
      const {encryptedData,rawData,iv,signature} = e.datail;
      const {code} = await login();
      const loginParams = {encryptedData,rawData,iv,signature,token}
      const res =await request({url:'/users/wxlogin',data:loginParams,method:'post'})
      wx.setStorageSync('token', token);
      wx.navigateBack({
        delta:1
      })
    }catch(err){
      console.log(err);
    }
  }
})