// pages/profile/profile.js
Page({

  /**
   * Page initial data
   */
  data: {
  },

  getUserEvents: function (id) {
    console.log("fetching user_events....")
    let query = new wx.BaaS.Query()
    let UserEvent = new wx.BaaS.TableObject('user_event')

    query.compare('user_id', '=', id)
    query.compare('going', '=', true)
    console.log("ready for query...")
    UserEvent.setQuery(query).expand(['event_id']).find().then(res => {
      console.log(res.data.objects)
      let user_events = res.data.objects;
      console.log(this.data.user_events);

      user_events = user_events.map(user_event => this.setDisplayDate(user_event.event_id))

      this.setData({ user_events })
    })
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

  setDisplayDate: function (event) {
    let date = new Date(event.date)
    const date_array = date.toLocaleString().split(', ')
    event.display_day = date_array[0]
    event.display_time = date_array[1]
    return event
    // 1. create date object. 2. create local string from date object. 3. parse array. 4. take first indecies of array and set to event.display.date 5. set all events to local data 
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    wx.BaaS.auth.getCurrentUser().then(user => {
      user.custom_nickname  = user.get("custom_nickname")
      user.bio = user.get("bio")
      this.setData({ user })
      this.getUserEvents(user.id)
      
      
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