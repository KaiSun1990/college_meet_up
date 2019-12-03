Page({
  data: {
    time: undefined,
    date: undefined
  },

  uploadImage: function(e) {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
      }
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
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