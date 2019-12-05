// pages/show/show.js
Page({

  /**

   * Page initial data
   */
  data: {
  },

  getUserEvent: function(event_id, user_id) {
    console.log("fetching user_event....")
    let query = new wx.BaaS.Query()
    let UserEvent = new wx.BaaS.TableObject('user_event')

    query.compare('event_id', '=', event_id)
    query.compare('user_id', '=', user_id)
    console.log("ready for query...")
    UserEvent.setQuery(query).find().then(res => {
      console.log(res)
      let user_event = res;
      console.log('userEvent fetched')
      this.setData ( {user_event} )
      if ((user_event.going === true)) {
        this.setData({disableAttendBtn: true})
      }
    })
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

    this.setData({ disableAttendBtn: true })

    wx.showToast({
      title: `已成功报名！`,
      icon: 'success'
    })
    wx.reLaunch({
      url: `/ pages / show / show ? id = ${ this.data.event.id }`
    })

    
  },

  unsaveUserEvent: function () {
    let user_event = this.data.user_event
    user_event.saved = false

    let User_event = new wx.BaaS.TableObject('user_event')
    let db_user_event = User_event.getWithoutData(user_event.id)
    db_user_event.set("saved", user_event.saved)
    db_event.update().then(res => {
      console.log(res);
    }, err => {
    })
    wx.reLaunch({
      url: `/pages/show/show?id=${this.data.event.id}`
    })
  },

  saveUserEvent: function () {
    if (this.data.user_event) {
      let user_event = this.data.user_event
      user_event.saved = true

      let User_event = new wx.BaaS.TableObject('user_event')
      let db_user_event = User_event.getWithoutData(user_event.id)
      db_user_event.set("saved", user_event.saved)
      db_event.update().then(res => {
        console.log(res);
      }, err => {
      })
    } else {
        let User_event = new wx.BaaS.TableObject('user_event')
        let user_event = User_event.create()
        let new_user_event = {
          user_id: this.data.user.id,
          event_id: this.data.event.id,
          saved: true
        }
        user_event.set(new_user_event).save().then(res => {
          console.log(res)
        }, err => {
        })
    }
    wx.reLaunch({
      url: `/pages/show/show?id=${this.data.event.id}`
    })
  },

  navigateToHome: function () {
    wx.switchTab({
      url: '/pages/home/home'
    })
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
    let event_id = options.id // needs to be changed after linking it to index!!!!
    console.log("show options id")
    console.log(event_id)
    this.getEvent(event_id)
    // console.log(options)
    wx.BaaS.auth.getCurrentUser().then(user => {
      // user 为 currentUser 
      this.setData({ user })
      console.log("ready to get user_event")
      let user_id = this.data.user.id
      this.getUserEvent(event_id, user_id)
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