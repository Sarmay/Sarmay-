// miniprogram/pages/custom-tab-bar/index.js
Component({
  data: {
    active: 'index'
  },
  attached() {},
  methods: {
    onChange(e) {
      const url = `/pages/${e.detail}/${e.detail}`
      wx.switchTab({
        url
      })
    }
  }
})