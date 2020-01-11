// miniprogram/pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    start:0,
    count:10
  },
  jumpComment:function(e){
    let id = e.target.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/detail/detail?id='+id,
    })
  },
  getMoveList:function(){
    let that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.cloud.callFunction({
      name:"getDoubanApi",
      data:{
        url:`http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=${this.data.start}&count=${this.data.count}`
      }
    }).then(res=>{
      wx.hideLoading();
      let obj = JSON.parse(res.result).subjects;
      console.log(obj);
      if (obj.length==0){
        console.log("无内容");
        wx.showToast({
          title: '无内容了',
          icon:'none'
        })
      }else{
        let start = that.data.start;
        let count = that.data.count;
        let list = that.data.list;
        that.setData({
          list: list.concat(obj),
          start: start += count
        });
      }   
    }).catch(err=>console.log(err));
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMoveList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.getMoveList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})