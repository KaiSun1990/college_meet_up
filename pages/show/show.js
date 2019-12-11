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
    // peopleGoing = peopleGoing === null ? "0" : peopleGoing;
    peopleGoing += 1
    console.log(peopleGoing, typeof (peopleGoing))
    let Event = new wx.BaaS.TableObject('event') // (2) update people_going to Event object in data base
    let dbEvent = Event.getWithoutData(event.id)
    dbEvent.set("people_going", peopleGoing)
    dbEvent.update().then(res => {
      console.log(res, res.data)
      let event = res.data
      event = this.setDisplayDate(event)
      this.setData({ event })
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
        let userEvent = res.data
        this.setData({ userEvent })
        this.getUserEvents(this.data.event.id)
        wx.showToast({
          title: `已成功报名！`,
          icon: 'success'
        })  
      }, err => {
        wx.showToast({
          title: `网络错误`,
          icon: 'loading'
        })  
      })

    } else { // change going to true, if User Event already existing
      let user = this.data.user
      let event = this.data.event
      let userEvent = this.data.userEvent
      userEvent.going = true
      let UserEvent = new wx.BaaS.TableObject('user_event') // update going to User Event object in data base
      let dbUserEvent = UserEvent.getWithoutData(userEvent.id)
      dbUserEvent.set("going", userEvent.going)
      dbUserEvent.update().then(res => {
        let userEvent = res.data
        this.setData({ userEvent })
        this.getUserEvents(this.data.event.id)
        wx.showToast({
          title: `已成功报名！`,
          icon: 'success'
        })  
      }, err => {
        wx.showToast({
          title: `网络错误`,
          icon: 'loading'
        })  
      })
    }

     
  },

  unsubscribeEvent: function () {
    let user = this.data.user
    let event = this.data.event
    // (1) update people_going to Event object in data base
    let peopleGoing = event.people_going
    // peopleGoing = peopleGoing === null ? "0" : peopleGoing;
    peopleGoing -= 1
    console.log(peopleGoing, typeof (peopleGoing))

    let Event = new wx.BaaS.TableObject('event') // (2) update people_going to Event object in data base
    let dbEvent = Event.getWithoutData(event.id)
    dbEvent.set("people_going", peopleGoing)
    dbEvent.update().then(res => {
      let event = res.data
      event = this.setDisplayDate(event)
      this.setData({ event })
      console.log(res)
    }, err => {
    })

    // change 'going' to false, if User Event already existing
    let userEvent = this.data.userEvent
    userEvent.going = false
    let UserEvent = new wx.BaaS.TableObject('user_event') // update going to User Event object in data base
    let dbUserEvent = UserEvent.getWithoutData(userEvent.id)
    dbUserEvent.set("going", userEvent.going)
    dbUserEvent.update().then(res => {
      let userEvent = res.data
      this.setData({ userEvent })
      this.getUserEvents(this.data.event.id)
      wx.showToast({
        title: `取消成功！`,
        icon: 'success'
      })
    }, err => {
      wx.showToast({
        title: `网络错误`,
        icon: 'loading'
      })  
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
      let event = res.data
      event = this.setDisplayDate(event)
      this.setData({ event })
    }, err => {
      wx.showToast({
        title: `网络错误`,
        icon: 'loading'
      })  
    })

    let userEvent = this.data.userEvent
    userEvent.saved = false

    let UserEvent = new wx.BaaS.TableObject('user_event') // update 'saved' to User Event object in data base
    let dbUserEvent = UserEvent.getWithoutData(userEvent.id)
    dbUserEvent.set("saved", userEvent.saved)
    dbUserEvent.update().then(res => {
      let userEvent = res.data
      this.setData({ userEvent })
      this.getUserEvents(this.data.event.id)
      wx.showToast({
        title: `成功取消收藏`,
        icon: 'success'
      })    
    }, err => {
      wx.showToast({
        title: `网络错误`,
        icon: 'loading'
      })  
     
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
      let event = res.data
      event = this.setDisplayDate(event)
      this.setData({ event })
    }, err => {
      wx.showToast({
        title: `网络错误`,
        icon: 'loading'
      })  
    })
    
    if (this.data.userEvent) { // updating "saved" to true in DB, if User Event already exists
      
      let userEvent = this.data.userEvent
      userEvent.saved = true

      let UserEvent = new wx.BaaS.TableObject('user_event') // update 'saved' to User Event object in data base
      let dbUserEvent = UserEvent.getWithoutData(userEvent.id)
      dbUserEvent.set("saved", userEvent.saved)
      dbUserEvent.update().then(res => {
        let userEvent = res.data
        this.setData({ userEvent })
        this.getUserEvents(this.data.event.id)
      }, err => {
        wx.showToast({
          title: `网络错误`,
          icon: 'loading'
        })  
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
        let userEvent = res.data
        this.setData({ userEvent })
        this.getUserEvents(this.data.event.id)
        wx.showToast({
          title: `已成功收藏！`,
          icon: 'success'
        })
      }, err => {
        wx.showToast({
          title: `网络错误`,
          icon: 'loading'
        })  
       
      })
     }
       
      },

  navigateToHome: function () {
    wx.switchTab({
      url: '/pages/home/home'
    })
  },

  openLocation: function () {
    
    let latitude = this.data.event.latitude
    let longitude = this.data.event.longitude
    wx.openLocation({
      latitude,
      longitude,
      scale: 18
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
    event.display_time = [date.getHours(), date.getMinutes()].map(this.formatNumber).join(':')
    return event
  },

  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  getUserEvents: function (eventId) {
    console.log("fetching user_events....")
    let query = new wx.BaaS.Query()
    let UserEvent = new wx.BaaS.TableObject('user_event')

    query.compare('event_id', '=', eventId)
    query.compare('going', '=', true)
    console.log("ready for query...")
    UserEvent.setQuery(query).expand(['user_id']).find().then(res => {
      console.log(res)
      console.log(res.data.objects)
      let user_events = res.data.objects;
      console.log(this.data.user_events);
      this.setData({ user_events })
      return user_events
    })
  },

  getUserEventsForDeletion: function (eventId) {
    let query = new wx.BaaS.Query()
    let UserEvent = new wx.BaaS.TableObject('user_event')
    query.compare('event_id', '=', eventId)
    console.log("ready for query...")
    UserEvent.setQuery(query).find().then(res => {
      let userEvents = res.data.objects;
      userEvents.forEach((userEvent) => {
        this.deleteUserEvent(userEvent.id)
      })
    })
  },

  deleteEvent: function () {
    let Event = new wx.BaaS.TableObject('event')
    let eventId = this.data.event.id
    Event.delete(eventId).then(res => {
      // success
      let eventId = this.data.event.id
      let userEvents = this.getUserEventsForDeletion(eventId)
      wx.showToast({
        title: `活动已删掉！`,
        icon: 'success'
      })
      this.navigateToHome()
    }, err => {
      // err
    })
  },

  deleteUserEvent: function (userEventId) {
    let UserEvent = new wx.BaaS.TableObject('user_event')
    UserEvent.delete(userEventId).then(res => {
      // success
    }, err => {
      // err
    })
  },

  fetchEventData: function (eventId) {
    let user = wx.getStorageSync('user')
    this.setData({user})
    this.getUserEvent(eventId, user.id)
    this.getUserEvents(eventId)
  },

  onLoad: function (options) {
    let eventId = options.id // Setting eventId from Page properties
    this.getEvent(eventId) // Getting Event object by search with Event ID
    this.fetchEventData(eventId)
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**

   * Lifecycle function--Called when page show
   */
  onShow: function (options) {

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
    return {
      title: '',
      path: `/pages/show/show?id=${this.data.event.id}`
    }
  }
})

