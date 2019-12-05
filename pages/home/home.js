// pages/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    events: [],
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://cn.bing.com/th?id=OIP.7gWe7BgHfE50dH7gSR1w4gHaE1&pid=Api&rs=1'
    }, {
      id: 1,
      type: 'image',
        url: 'https://cn.bing.com/th?id=OIP.MFZnOQcMxUfNcF-oR-Oo2AHaD4&pid=Api&rs=1',
    }, {
      id: 2,
      type: 'image',
        url: 'https://www.desicomments.com/wp-content/uploads/2018/10/Weekend-Loading.jpg'
    }],

  },

  getEvents: function () {
    let query = new wx.BaaS.Query()
    let Event = new wx.BaaS.TableObject('event')
    query.compare('created_at', '>', 0)

    Event.setQuery(query).orderBy('date').find()
      .then(res => {
        let data = res.data.objects
        let dates_array = []
        data.forEach((item) => {
          let event = this.setDisplayDate(item)
          dates_array.push(event)
        })
        this.setData({events: dates_array})
      })
  },

  navigateToShow(e) {
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },

  setDisplayDate: function(event) {
    let date = new Date(event.date)
    const date_array = date.toLocaleString().split(', ')
    event.display_day = date_array[0]
    event.display_time = date_array[1]
    return event
  // 1. create date object. 2. create local string from date object. 3. parse array. 4. take first indecies of array and set to event.display.date 5. set all events to local data 
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
    this.getEvents();
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