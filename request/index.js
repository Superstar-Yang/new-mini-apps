//同步发送异步请求的次数
let ajaxTimes  = 0
export const request=(params)=>{
  //判断url中是否带有/my/请求的是否是私有的路径 带有header token
  let header={...params.header};
  if(params.url.includes('/my/')){
    //拼接header 带上token
    header['Authorization'] = wx.getStorageSync('token');
  }
  ajaxTimes++;
  const baseUrl = 'https://api.zbztb.cn/api/public/v1'
  return new Promise((resolve, reject) => {
    //设置正在加载中图标
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    //设置公共路径
      wx.request({
         ...params,
        header:header,
        url:baseUrl+params.url,
          success:res=>{
              resolve(res.data.message);
          },
          fail:err=>{
              reject(err);
          },
          complete:()=>{
            ajaxTimes--;
            if(ajaxTimes===0){
           wx.hideLoading()
            }
          }
      })
  })
}