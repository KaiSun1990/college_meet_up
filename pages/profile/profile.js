// pages/profile/profile.js
Page({

  /**
   * Page initial data
   */
  data: {
    current: 0,
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

  getUserEventsSaved: function (id) {
    console.log("fetching user_events....")
    let query = new wx.BaaS.Query()
    let UserEvent = new wx.BaaS.TableObject('user_event')

    query.compare('user_id', '=', id)
    query.compare('saved', '=', true)
    console.log("ready for query...")
    UserEvent.setQuery(query).expand(['event_id']).find().then(res => {
      console.log(res.data.objects)
      let user_events_saved = res.data.objects;
      console.log(this.data.user_events);

      user_events_saved = user_events_saved.map(user_event => this.setDisplayDate(user_event.event_id))

      this.setData({ user_events_saved })
    })
  },

  getEventsCreated: function (id) {
    console.log("fetching events....")
    let query = new wx.BaaS.Query()
    let Event = new wx.BaaS.TableObject('event')

    query.compare('created_by', '=', id)
    console.log("ready for query...")
    Event.setQuery(query).find().then(res => {
      console.log(res.data.objects)
      let events_created = res.data.objects;
      console.log('created events', this.data.events_created);
      this.setData({ events_created })
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

  navigateToShow(e) {
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },

  navigateToEditProfile: function () {
    wx.navigateTo({
      url: '/pages/edit_profile/edit_profile'
    })
  },

  setDisplayDate: function (event) {
    let date = new Date(event.date)

    // const dateArray = date.toLocaleString().split(', ')
    event.display_day = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    event.display_time = [date.getHours(), date.getMinutes()].map(this.formatNumber).join(':')
    return event
  },

  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
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
      this.getUserEventsSaved(user.id)
      this.getEventsCreated(user.id)
      
      
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
    wx.BaaS.auth.getCurrentUser().then(user => {
      user.custom_nickname = user.get("custom_nickname")
      user.bio = user.get("bio")
      this.setData({ user })
      this.getUserEvents(user.id)
      this.getUserEventsSaved(user.id)
      this.getEventsCreated(user.id)


    }).catch(err => {
      // HError
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })
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

  },

  onChange(e) {
    this.setData({
      current: e.detail.key,
    })
  }
})