// pages/show/show.js
Page({

  /**

   * Page initial data
   */
  data: {
  },

  attendEvent: function () {
    let recordID = this.data.event.id
    console.log(recordID)
    let tableName = 'event'
    let Event = new wx.BaaS.TableObject(tableName)
    let event = Event.getWithoutData(recordID)
    console.log(event)
    let people_going = event.people_going
    console.log(people_going)
    people_going = people_going == null ? "0" : people_going;
    people_going += 1
    console.log(people_going)
    event.set("people_going", people_going)
    event.update().then(res => {

    }, err => {

    })
    // this.setData({ disableBtn: true })
  },

  getEvent(id) {

    console.log("lauch get event")
    let query = new wx.BaaS.Query()
    let EventTable = new wx.BaaS.TableObject('event')

    EventTable.get(id).then(res => {
      console.log(res);
      let event = res.data
      this.setData({ event })
      // success
    }, err => {
      console.log(err);
      // err
    })
  },

  saveEvent: function () {
    let tableName = "event"
    let recordID = this.data.event.id
    let Event = new wx.BaaS.TableObject(tableName)
    let event = Event.getWithoutData(recordID)
    event.people_saved.push({ user_id: this.user.id })
    event.update().then(page.getRequestData)
  },

  getUserInfo: function () {

  },


  onLoad: function (options) {
    let id = options.id // needs to be changed after linking it to index!!!!
    console.log(id)
    this.getEvent(id)
    // console.log(options)
    wx.BaaS.auth.getCurrentUser().then(user => {
      // user 为 currentUser 
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