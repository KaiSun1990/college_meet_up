// pages/profile/profile.js
Page({

  /**
   * Page initial data
   */
  data: {
  },

  getProfile: function () {
    let query = new wx.BaaS.Query()
    let Profile = new wx.BaaS.TableObject('edited_profile')
    query.compare('created_at', '>', 0)

    Event.setQuery(query).orderBy('date').find()
      .then(res => {
        let data = res.data.objects
        let dates_array = []
        data.forEach((item) => {
          let event = this.setDisplayDate(item)
          dates_array.push(event)
        })
        this.setData({ events: dates_array })
      })
  },




  navigateToEditProfile: function () {
    wx.navigateTo({
      url: '/pages/edit_profile/edit_profile'
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.BaaS.auth.getCurrentUser().then(user => {

      // user 为 currentUser 
      console.log(user)
      console.log(user.nickname)
      user.custom_nickname  = user.get("custom_nickname")
      user.bio = user.get("bio")
      console.log(user.city)
      console.log(user.province)
      console.log(user.country)
      console.log(user.gender)

      this.setData({ user })
    }).catch(err => {
      // HError
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})