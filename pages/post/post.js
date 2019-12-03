Page({
  data: {
    event: {
      name: undefined,
      location: undefined,
      time: undefined,
      date: undefined,
      description: undefined,
      image: undefined
    }
  },

  uploadImage() {
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
    this.setData({
      "event.name": e.detail.value
    })
  },

  onChangeContent: function (e) {
    this.setData({
      "event.description": e.detail.value
    })
  },

  eventPackageSubmit: function (e) {
    let tableName = 'event'
    let Event = new wx.BaaS.TableObject(tableName)
    let event = Event.create()

    let newEvent = {
      name: this.data.event.name,
      location: this.data.event.location,
      date: this.data.event.date&this.data.event.time,
      description: this.data.event.description,
      image: this.data.event.image
    }
    console.log('My event package ----->' , newEvent)

    event.set(newEvent).save().then(res => {
      // success
      console.log(res)
    }, err => {
      //err 为 HError 对象
    })
  },


  getLocation() {
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

  }
})