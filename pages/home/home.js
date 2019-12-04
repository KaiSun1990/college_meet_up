// pages/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2516586920,128826406&fm=26&gp=0.jpg'
    }, {
      id: 1,
      type: 'image',
        url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575414783789&di=26cf9bc4dc68c3357b59967a78cecb20&imgtype=0&src=http%3A%2F%2Fimg02.taopic.com%2F190128%2F234820-1Z12QJ14274.jpg',
    }, {
      id: 2,
      type: 'image',
        url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1575417036716&di=df91d774c78216e108c9a9721ed6d2a8&imgtype=0&src=http%3A%2F%2Fhbimg.b0.upaiyun.com%2F30442067bbd3f478e8eab9c5927faa7faac4da204dcfd-VYVBxs_fw658'
    }],

  },

  loginWithWechat: function () {
    wx.BaaS.auth.loginWithWechat().then(user => {
      console.log(user)
      this.setData({user})
    }, err => {
      console.log(err);
      // 登录失败
    })
  },

  getCurrentUser: function () {
    wx.BaaS.auth.getCurrentUser().then(user => {
      // user 为 currentUser 对象
      console.log(user)
      this.setData({user})
    }).catch(err => {
      // HError
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCurrentUser();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})