Page({
  data: {
    event: {
      name: undefined,
      location: undefined,
      time: undefined,
      date: undefined,
      description: undefined,
      image: undefined
    },
    dateNow: undefined
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
      location: this.data.event.location,
      date: this.data.event.date.concat(" ", this.data.event.time),
      description: this.data.event.description,
      image: this.data.event.image
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


  getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
      }
    })
  },

  onLoad: function() {
  },

  onShow: function() {
    this.dateToday()
  }
})