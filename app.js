//app.js
App({
  
  onLaunch: function () {
   
      wx.BaaS = requirePlugin('sdkPlugin')
    //让插件帮助完成登录、支付等功能
    wx.BaaS.wxExtend(wx.login,
      wx.getUserInfo,
      wx.requestPayment)

    let clientID = '265ecc6dd1f231150016'  // 应用名称: CityTales
    wx.BaaS.init(clientID, {autoLogin: true})
  },
  globalData: {
    userInfo: null
  }
})