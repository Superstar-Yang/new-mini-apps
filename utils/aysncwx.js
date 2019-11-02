/*
* promise形式的 getSetting
* */
export const getSetting=()=>{
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success:res=>{
        resolve(res)
      },
      fail:err=>{
        reject(err)
      }
    })
  })
}
/*
* promise形式的 chooseAddress
* */
export const chooseAddress=()=>{
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success:res=>{
        resolve(res)
      },
      fail:err=>{
        reject(err)
      }
    })
  })
}
/*
* promise形式的 openSetting
* */
export const openSetting=()=>{
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success:res=>{
        resolve(res)
      },
      fail:err=>{
        reject(err)
      }
    })
  })
}