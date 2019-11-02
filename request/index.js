//发送请求的次数
let ajaxTimes  = 0
export const request=(params)=>{
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