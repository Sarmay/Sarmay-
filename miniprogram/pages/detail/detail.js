// pages/detail/detail.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    moveList: [],
    loadMore: false, //"上拉加载"的变量，默认false，隐藏  
    loadAll: false, //“没有数据”的变量，默认false，隐藏 
    currentPage: 0,
    pageSize: 20, //每页显示多少数据
  },
  publicUrl: function(e){
    let lid = e.currentTarget.dataset.lid;
    //插入观看记录结束
    wx.navigateTo({
      url: `../link/link?lid=${lid}`,
    })
  },
  //获取电影列表
  getDetailVideo: function(){
    let id = this.data.id;
    let that=this;
    let currentPage = this.data.currentPage; // 当前第几页,0代表第一页 
    let pageSize = this.data.pageSize; //每页显示多少数据

    //第一次加载数据
    if (currentPage == 1) {
      this.setData({
        loadMore: true, //把"上拉加载"的变量设为true，显示  
        loadAll: false //把“没有数据”设为false，隐藏  
      })
    }
    wx.cloud.database().collection("list").where({
        cid: id, // 填入当前用户 openid
      }).skip(currentPage * pageSize) //从第几个数据开始
      .limit(pageSize)
      .get().then(res => {
        if (res.data && res.data.length > 0) {
          that.setData({
            currentPage: (currentPage + 1)
          });
          //把新请求到的数据添加到dataList里  
          let list = that.data.moveList.concat(res.data)
          that.setData({
            moveList: list, //获取数据数组    
            loadMore: false //把"上拉加载"的变量设为false，显示  
          });
          console.log("第" + currentPage + "数据", typeof currentPage);
          if (res.data.length < pageSize) {
            that.setData({
              loadMore: false, //隐藏加载中。。
              loadAll: true //所有数据都加载完了
            });
          }
        } else {
          that.setData({
            loadAll: true, //把“没有数据”设为true，显示  
            loadMore: false //把"上拉加载"的变量设为false，隐藏  
          });
        }
      })
      .catch(err => {
        console.log("请求失败", err);
        that.setData({
          loadAll: false,
          loadMore: false
        });
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.vid
    });
    this.getDetailVideo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let that=this;
    if (!that.data.loadMore) {
      that.setData({
        loadMore: true, //加载中  
        loadAll: false //是否加载完所有数据
      });
      //加载更多，这里做下延时加载
      setTimeout(function () {
        that.getDetailVideo()
      }, 100)
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let id = this.data.id;
    return {
      title: "ۇكىلى قىز كينو دەتالى",
      path: `/pages/detail/detail?vid=${id}`
    }
  }
})