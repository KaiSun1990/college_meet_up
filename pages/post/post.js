Page({
  data: {
    event: {
      name: undefined,
      location: undefined,
      time: undefined,
      date: undefined,
      description: undefined,
      image: undefined,
      address: undefined,
      latitude: undefined,
      longitude: undefined
    },
    dateNow: undefined,
    items: [
      { name: '娱乐', value: '娱乐' },
      { name: '运动', value: '运动' },
      { name: '学习', value: '学习' },
      { name: '约饭', value: '约饭' },
      { name: '购物', value: '购物' },
    ]},

  checkboxChange: function (e) {
    this.setData({
      "event.tag": e.detail.value
  })
    console.log(this.data.event.tag)
  },



dateToday: function () {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  let formatDate = year + '-' + month + '-' + day;
  console.log(formatDate)
  this.setData({
    "dateNow": formatDate
  })
},

uploadImage: function () {
    let self = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        let MyFile = new wx.BaaS.File()
        let fileParams = { filePath: res.tempFilePaths[0] }
        let metaData = { categoryName: 'SDK' }

        MyFile.upload(fileParams, metaData).then(res => {
          console.log('MyFile Result ----->', res)
          let path = res.data.path
          self.setData({
            [`event.image`]: path
          })
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  bindDateChange: function (e) {
    this.setData({
      "event.date": e.detail.value
    })
  },

  bindTimeChange: function(e) {
    this.setData({
      "event.time": e.detail.value
    })
  },

  onChangeName: function (e) {
    console.log(e)
    this.setData({
      "event.name": e.detail.value,
    })
  },

  onChangeContent: function (e) {
    console.log(e)
    this.setData({
      "event.description": e.detail.value,
    })
  },

  eventPackageSubmit: function (e) {
    let tableName = 'event'
    let Event = new wx.BaaS.TableObject(tableName)
    let event = Event.create()

    let newEvent = {
      name: this.data.event.name,
      address: this.data.event.address,
      longitude: this.data.event.longitude,
      latitude: this.data.event.latitude,
      date: this.data.event.date.concat(" ", this.data.event.time),
      description: this.data.event.description,
      image: this.data.event.image,
      creator_avatar: this.data.user.avatar,
      tag: this.data.event.tag 
    }
    console.log('My event package ----->' , newEvent)

    event.set(newEvent).save().then(res => {
      // success
      console.log("My upload package----->", res)
      wx.showToast({
      title: 'Posted',
      icon: 'success',
      })
      wx.reLaunch({
        url: '/pages/home/home',
      })
    }, err => {
      //err 为 HError 对象
    })
  },


  getMapLocation: function () {
    let page = this
    wx.chooseLocation({
      success: function (res) {
        console.log(res)
        page.setData ({
          "event.address": res.address,
          "event.latitude": res.latitude,
          "event.longitude": res.longitude
        })
      }
    })
  },

  onLoad: function (options) {
    wx.BaaS.auth.getCurrentUser().then(user => {

      // user 为 currentUser 
      console.log(user)
      console.log(user.nickname)
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

  onShow: function() {
    this.dateToday()
  }
})