// pages/home/home.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    events: [],
    cardCur: 0,
    swiperList: [{
      id: 0,
      type: 'image',
      url: 'https://cn.bing.com/th?id=OIP.7gWe7BgHfE50dH7gSR1w4gHaE1&pid=Api&rs=1'
    }, {
      id: 1,
      type: 'image',
        url: 'https://cn.bing.com/th?id=OIP.MFZnOQcMxUfNcF-oR-Oo2AHaD4&pid=Api&rs=1',
    }, {
      id: 2,
      type: 'image',
        url: 'https://www.desicomments.com/wp-content/uploads/2018/10/Weekend-Loading.jpg'
    }],

    items: [
      {
        type: 'filter',
        label: '筛选',
        value: 'filter',
        checked: true,
        children: [
          {
            type: 'checkbox',
            label: '活动类型（复选）',
            value: 'tag',
            children: [{
              label: '娱乐',
              value: '娱乐',
              checked: true,
            },
            {
              label: '运动',
              value: '运动',
            },
            {
              label: '学习',
              value: '学习',
              checked: true, // 默认选中
            },
            {
              label: '约饭',
              value: '约饭',
            },
            {
              label: '购物',
              value: '购物',
            },
            ],
          },
        ],
        groups: ['001', '002', '003'],
      },
    ],
    filter:undefined,
  },

  onChange: function (e) {
    let filter = e.detail.checkedValues[0][0]
    this.setData({filter})
    console.log("filter",filter)
    let query = new wx.BaaS.Query()
    query.in('tag', filter) 
    let Product = new wx.BaaS.TableObject("event")
    Product.setQuery(query).find().then(res => {
      // success
      let data = res.data.objects
      let dates_array = []
      data.forEach((item) => {
        let event = this.setDisplayDate(item)
        dates_array.push(event)
      })
      this.setData({ events: dates_array })
    }, err => {
      // err
    })
  },

  getEvents: function (params = {}) {
    let query = new wx.BaaS.Query()
    let order = params.order || 'date'
    let Event = new wx.BaaS.TableObject('event')
    query.compare('created_at', '>', 0)

    Event.setQuery(query).orderBy(order).find()
      .then(res => {
        
        let data = res.data.objects
        let dates_array = []
        data.forEach((item) => {
          let event = this.setDisplayDate(item)
          dates_array.push(event)
        })
        this.setData({events: dates_array})
      })
  },

  navigateToShow(e) {
    let type = e.currentTarget.dataset.type
    let id = e.currentTarget.dataset.id
    console.log(e)
    wx.navigateTo({
      url: `/pages/show/show?id=${id}`
    })
  },

  setDisplayDate: function (event) {
    let date = new Date(event.date)

    // const dateArray = date.toLocaleString().split(', ')
    event.display_day = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    event.display_time = [date.getHours() + 8, date.getMinutes()].map(this.formatNumber).join(':')
    return event
  },

  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },


  loginWithWechat: function () {
    wx.BaaS.auth.loginWithWechat().then(user => {
      console.log(user)
      this.setData({user})
    }, err => {
      console.log(err);
      // 登录失败
    })
  },

  getCurrentUser: function () {
    wx.BaaS.auth.getCurrentUser().then(user => {
      // user 为 currentUser 对象
      console.log(user)
      this.setData({user})
    }).catch(err => {
      // HError
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })
  },

  onLoad: function (options) {
    this.getCurrentUser();
    this.getEvents();
    
  },

  onShow: function () {
    this.getCurrentUser();
    this.getEvents();
  },
})