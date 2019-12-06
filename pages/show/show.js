// pages/show/show.js
Page({

  /**

   * Page initial data
   */
  data: {
  },

  getUserEvent: function(eventId, userId) {
    let query = new wx.BaaS.Query()
    let UserEvent = new wx.BaaS.TableObject('user_event')

    query.compare('event_id', '=', eventId.toString())
    query.compare('user_id', '=', userId.toString())
    console.log("ready for query...")
    UserEvent.setQuery(query).find().then(res => {
      console.log('fetched result object from getting User Event: ...')
      console.log(res)
      if (res.data.objects.length !== 0) {
        let userEvent = res.data.objects[0];
        console.log('userEvent fetched')
        this.setData ( {userEvent} ) // Saving User Event to local page data
      }
    })
  },

  attendEvent: function () {
    let user = this.data.user
    let event = this.data.event
    // (1) update people_going to Event object in data base
    let peopleGoing = event.people_going
    // console.log(peopleGoing)
    peopleGoing = peopleGoing === null ? "0" : peopleGoing;
    // console.log(peopleGoing)
    console.log(peopleGoing)
    // peopleGoing = Number.parseInt(peopleGoing)
    // console.log(typeof peopleGoing)
    peopleGoing += 1
    // console.log(typeof peopleGoing)
    // console.log(peopleGoing)
    console.log(peopleGoing, typeof (peopleGoing))
    
    let Event = new wx.BaaS.TableObject('event') // (2) update people_going to Event object in data base
    let dbEvent = Event.getWithoutData(event.id)
    dbEvent.set("people_going", peopleGoing)
    dbEvent.update().then(res => {
      this.setData({event: event})
      console.log(res);
    }, err => {
    })

    if ((!this.data.userEvent)) { // Create new User Event, if no User Event existing
      let user = this.data.user
      let event = this.data.event
      let UserEvent = new wx.BaaS.TableObject('user_event')
      let userEvent = UserEvent.create()
      let newUserEvent = {
        user_id: this.data.user.id,
        event_id: this.data.event.id,
        going: true
      }
      userEvent.set(newUserEvent).save().then(res => {
        console.log("Result after saving new User Event")
        console.log(res.data)
        this.setData({userEvent: res.data})
      }, err => {
      })
    
      this.setData({ userEvent: newUserEvent })
    } else { // changed going to true, if User Event already existing
      let user = this.data.user
      let event = this.data.event
      let userEvent = this.data.userEvent
      userEvent.going = true
      this.setData({ userEvent: userEvent })
      let UserEvent = new wx.BaaS.TableObject('user_event') // update going to User Event object in data base
      let dbUserEvent = UserEvent.getWithoutData(userEvent.id)
      dbUserEvent.set("going", userEvent.going)
      dbUserEvent.update().then(res => {
        console.log(res);
        this.getUserEvent(user.id, event.id)
      }, err => {
      })
    }
    wx.showToast({
      title: `已成功报名！`,
      icon: 'success'
    })    
  },

  unsubscribeEvent: function () {
    let user = this.data.user
    let event = this.data.event
    // (1) update people_going to Event object in data base
    let peopleGoing = event.people_going
    // console.log(peopleGoing)
    peopleGoing = peopleGoing === null ? "0" : peopleGoing;
    // console.log(peopleGoing)
    console.log(peopleGoing)
    // peopleGoing = Number.parseInt(peopleGoing)
    // console.log(typeof peopleGoing)
    peopleGoing -= 1
    // console.log(typeof peopleGoing)
    // console.log(peopleGoing)
    console.log(peopleGoing, typeof (peopleGoing))

    let Event = new wx.BaaS.TableObject('event') // (2) update people_going to Event object in data base
    let dbEvent = Event.getWithoutData(event.id)
    dbEvent.set("people_going", peopleGoing)
    dbEvent.update().then(res => {
      this.setData({ event: event })
      console.log(res);
    }, err => {
    })

    
    // changed going to false, if User Event already existing
    let userEvent = this.data.userEvent
    userEvent.going = false
    this.setData({ userEvent: userEvent })
    let UserEvent = new wx.BaaS.TableObject('user_event') // update going to User Event object in data base
    let dbUserEvent = UserEvent.getWithoutData(userEvent.id)
    dbUserEvent.set("going", userEvent.going)
    dbUserEvent.update().then(res => {
      console.log(res);
      this.getUserEvent(user.id, event.id)
    }, err => {
    })
  
    wx.showToast({
      title: `取消成功！`,
      icon: 'success'
    })
  },

  unsaveUserEvent: function () {
    let event = this.data.event // (1) update people_saved to Event object in data base
    let peopleSaved = event.people_saved
    console.log(peopleSaved, typeof(peopleSaved))
    peopleSaved = peopleSaved === null ? "0" : peopleSaved;
    // peopleSaved = Number.parseInt(peopleSaved)
    peopleSaved -= 1

    let Event = new wx.BaaS.TableObject('event') // (2) update people_saved to Event object in data base
    let dbEvent = Event.getWithoutData(event.id)
    dbEvent.set("people_saved", peopleSaved)
    dbEvent.update().then(res => {
      this.setData({ event: res.data })
      console.log(res.data)
    }, err => {
    })

    let userEvent = this.data.userEvent
    userEvent.saved = false

    let UserEvent = new wx.BaaS.TableObject('user_event') // update 'saved' to User Event object in data base
    let dbUserEvent = UserEvent.getWithoutData(userEvent.id)
    dbUserEvent.set("saved", userEvent.saved)
    dbUserEvent.update().then(res => {
      console.log(res);
      this.setData({ userEvent: userEvent })
    }, err => {
    })

    wx.showToast({
      title: `成功取消收藏`,
      icon: 'success'
    })    
  },

  saveUserEvent: function () {
    let event = this.data.event // (1) update people_saved to Event object in data base
    let peopleSaved = event.people_saved
    peopleSaved = peopleSaved === null ? "0" : peopleSaved;
    // peopleSaved = Number.parseInt(peopleSaved)
    peopleSaved += 1
    console.log(peopleSaved, typeof(peopleSaved))

    let Event = new wx.BaaS.TableObject('event') // (2) update 'people_saved' to Event object in data base
    let dbEvent = Event.getWithoutData(event.id)
    
    dbEvent.set("people_saved", peopleSaved)
    dbEvent.update().then(res => {
      this.setData({event: res.data})
    }, err => {
    })
    
    if (this.data.userEvent) { // updating "saved" to true in DB, if User Event already exists
      
      let userEvent = this.data.userEvent
      userEvent.saved = true

      let UserEvent = new wx.BaaS.TableObject('user_event') // update 'saved' to User Event object in data base
      let dbUserEvent = UserEvent.getWithoutData(userEvent.id)
      dbUserEvent.set("saved", userEvent.saved)
      dbUserEvent.update().then(res => {
        console.log(res);
        this.setData({userEvent: userEvent})
      }, err => {
      }) 
       
    } else { // Creating new User Event and saving into DB, if User Event doens not exist yet
    
      let UserEvent = new wx.BaaS.TableObject('user_event')
      let userEvent = UserEvent.create()
      let newUserEvent = {
        user_id: this.data.user.id,
        event_id: this.data.event.id,
        saved: true
      }
      userEvent.set(newUserEvent).save().then(res => {
        console.log("Result after saving new User Event")
        console.log(res.data)
        this.setData({ userEvent: res.data })
      }, err => {
      })
     }
        wx.showToast({
      title: `已成功收藏！`,
      icon: 'success'
    })
      },

  navigateToHome: function () {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  getEvent(id) {
    let Event = new wx.BaaS.TableObject('event')
    Event.get(id.toString()).then(res => {
      let event = res.data;
      event = this.setDisplayDate(event)
      this.setData({ event })
      // success
    }, err => {
      // err
    })
  },

  setDisplayDate: function (event) {
    let date = new Date(event.date)

    // const dateArray = date.toLocaleString().split(', ')
    event.display_day = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    event.display_time = `${date.getHours() - 8}时${date.getMinutes()}分`
    return event
  },

  onLoad: function (options) {
    let eventId = options.id // Setting eventId from Page properties
    this.getEvent(eventId) // Getting Event object by search with Event ID
    wx.BaaS.auth.getCurrentUser().then(user => { // Getting current_user information
      this.setData({ user })  // Saving current_user object to local page data
      this.getUserEvent(eventId, user.id)
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