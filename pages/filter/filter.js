Page({
  

  data: {
    items: [
   
    {
      type: 'sort',
      label: '时间',
      value: 'time',
      groups: ['003'],
    },
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
  },
  onLoad() {
    this.getRepos()
  },
  onChange(e) {
    const { checkedItems, items, checkedValues } = e.detail
    const params = {}

    console.log(checkedItems, items, checkedValues)

    checkedItems.forEach((n) => {
      if (n.checked) {
        if (n.value === 'time') {
          const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
          params.sort = n.value
          params.order = selected
        } else if (n.value === 'filter') {
          n.children.filter((n) => n.selected).forEach((n) => {
            if (n.value === 'tag') {
              const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
              params.query = selected
            }
          })
        }
      }
    })

    console.log('params', params)

    this.getRepos(params)
  },
  
  getRepos(params = {}) {
    const language = params.language || 'javascript'
    const query = params.query || 'react'
    const q = `${query}+language:${language}`
    const data = Object.assign({
      q,
      order: 'desc',
    }, params)

    wx.showLoading()
    wx.request({
      url: `https://api.github.com/search/repositories`,
      data,
      success: (res) => {
        console.log(res)

        wx.hideLoading()

        this.setData({
          repos: res.data.items.map((n) => Object.assign({}, n, {
            date: n.created_at.substr(0, 7),
          })),
        })
      },
    })
  },
  onOpen(e) {
    this.setData({ opened: true })
  },
  onClose(e) {
    this.setData({ opened: false })
  },
  /**
   * 阻止触摸移动
   */
  noop() { },
})
