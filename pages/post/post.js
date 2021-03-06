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
  let formatDate = year + '/' + month + '/' + day;
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
    let dateOrigin = e.detail.value
    let dateSplit = dateOrigin.split("-")
    let y = dateSplit[0]
    let m = dateSplit[1]
    let d = dateSplit[2]
    let dateFormated = y + '/' + m + '/' + d
    this.setData({
      "event.date": dateFormated
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
    let eventDate = new Date(`${this.data.event.date} ${this.data.event.time}`)
    let newEvent = {
      name: this.data.event.name,
      address: this.data.event.address,
      longitude: this.data.event.longitude,
      latitude: this.data.event.latitude,
      date: (eventDate.toISOString()).toString(),
      description: this.data.event.description,
      image: this.data.event.image,
      creator_avatar: this.data.user.avatar,
      tag: this.data.event.tag
    }
    console.log('My event package ----->' , newEvent)

    event.set(newEvent).save().then(res => {
      wx.showToast({ title: 'Posted', icon: 'success' })
      wx.reLaunch({ url: '/pages/home/home' })
    }).catch(err => wx.showModal({title: "Error", content: err }))
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

  getUserInfoInStorage: function () {
    wx.getStorage({
      key: 'user',
      success: res => {
        let user = res.data
        this.setData({ user })
      }
    })
  },

  onLoad: function (options) {
    
  },

  onShow: function() {
    this.dateToday()
    this.getUserInfoInStorage()
  }
})