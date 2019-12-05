// pages/show/show.js
Page({

  /**

   * Page initial data
   */
  data: {
    disableBtn: false
  },

  attendEvent: function () {
    let event = this.data.event
    let people_going = event.people_going
    // console.log(people_going)
    people_going = people_going === null ? "0" : people_going;
    // console.log(people_going)
    people_going += 1
    // console.log(typeof people_going)
    people_going = Number.parseInt(people_going)
    // console.log(typeof people_going)
    // console.log(people_going)
    
    let Event = new wx.BaaS.TableObject('event')
    let db_event = Event.getWithoutData(event.id)
    db_event.set("people_going", people_going)
    db_event.update().then(res => {
      console.log(res);
    }, err => {
    })

    let User_event = new wx.BaaS.TableObject('user_event')
    let user_event = User_event.create()
    let new_user_event = {
      user_id: this.data.user.id,
      event_id: this.data.event.id,
      going: true
    }
    user_event.set(new_user_event).save().then(res => {
      console.log(res)
    }, err => {
    })

    this.setData({ disableBtn: true })
  },

  getEvent(id) {
    console.log("lauch get event")
    let Event = new wx.BaaS.TableObject('event')
    Event.get(id).then(res => {
      console.log(res);
      let event = res.data;
      event = this.setDisplayDate(event)
      console.log(event);
      this.setData({ event })
      // success
    }, err => {
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

  setDisplayDate: function (event) {
    let date = new Date(event.date)
    const date_array = date.toLocaleString().split(', ')
    event.display_day = date_array[0]
    event.display_time = date_array[1]
    return event
  },


  onLoad: function (options) {
    console.log(options)
    let id = options.id // needs to be changed after linking it to index!!!!
    console.log("show options id")
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