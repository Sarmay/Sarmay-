//app.js
App({
  onLaunch: function () {
    try {
      const res = wx.getSystemInfoSync()
      let modelmes = res.model;
      if (modelmes.search('iPhone X') != -1){
        this.globalData.tabBarHeight = 20
        ;
      }
      this.globalData.navHeight = res.statusBarHeight
    } catch (e) {
      console.log(e)
    }

    // if (!wx.cloud) {
    //   console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    // } else {
    //   wx.cloud.init({
    //     traceUser: true,
    //   })
    // }
  },
  globalData:{
    navHeight: 0,
    tabBarHeight:0
  }
})
