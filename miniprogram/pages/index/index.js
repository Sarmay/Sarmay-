//index.js
//获取应用实例
const app = getApp()
import Dialog from 'vant-weapp/dialog/dialog';
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    cardCur: 0,
    swiperList: [],
    moveList: [],
    storyList: [],
    loadMore: false, //"上拉加载"的变量，默认false，隐藏  
    loadAll: false, //“没有数据”的变量，默认false，隐藏 
    loadStoryMore: false,
    loadStoryAll: false,
    currentPage: 0,
    currentStoryPage: 0,
    pageSize: 20, //每页显示多少数据
    pageStorySize: 20, //每页显示多少数据
    modalName: null,
    modalcontent: ''
  },
  //加载更多故事列表
  loadMoreStoryColumn() {
    let that = this;
    if (!that.data.loadMore) {
      that.setData({
        loadStoryMore: true, //加载中  
        loadStoryAll: false //是否加载完所有数据
      });
      //加载更多，这里做下延时加载
      setTimeout(function () {
        that.getStoryList()
      }, 100)
    }
  },
  //加载更多电影列表
  loadMoreVideColumn() {
    let that = this;
    if (!that.data.loadMore) {
      that.setData({
        loadMore: true, //加载中  
        loadAll: false //是否加载完所有数据
      });
      //加载更多，这里做下延时加载
      setTimeout(function () {
        that.getlVideoColumn()
      }, 100)
    }
  },
  admin:function(e){
    // 获取用户openid
    console.log(e)
    let that = this;
    wx.cloud.callFunction({
      name: 'login',
      complete: res => {
        var openid = res.result.openid;
        if (openid === 'oEgRa5KZlDwDwaNQ85q_J3l11Bw8' || openid === 'oEgRa5PG4Gi94G8UOYs-CpwsBDfU') {
          wx.navigateTo({
            url: `../admin/admin`,
          });
        }else{
          this.setData({
            modalName: 'Modal',
            modalcontent: 'تەك دەتال باسقارۋشىسى عانا كىرە الادى'
          });
        }
      }
    });
  },
  //隐藏提示框
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  storyid:function(e){
    let vid = e.currentTarget.dataset.vid;
    wx.navigateTo({
      url: `../story/story?vid=${vid}`,
    });
  },
  videoid:function(e){
    let vid = e.currentTarget.dataset.vid;
    wx.navigateTo({
      url: `../detail/detail?vid=${vid}`,
    });
  },
  //获取故事列表
  getStoryList: function () {//Story
    let that = this;
    //电影栏目分组开始
    let currentStoryPage = this.data.currentStoryPage; // 当前第几页,0代表第一页 
    let pageStorySize = this.data.pageStorySize; //每页显示多少数据

    //第一次加载数据
    if (currentStoryPage == 1) {
      this.setData({
        loadStoryMore: true, //把"上拉加载"的变量设为true，显示  
        loadStoryAll: false //把“没有数据”设为false，隐藏  
      })
    }
    wx.cloud.database().collection("readcolumn").skip(currentStoryPage * pageStorySize) //从第几个数据开始
      .limit(pageStorySize)
      .get().then(res => {
        if (res.data && res.data.length > 0) {
          that.setData({
            currentStoryPage: (currentStoryPage + 1)
          });
          //把新请求到的数据添加到dataList里  
          let list = that.data.storyList.concat(res.data)
          that.setData({
            storyList: list, //获取数据数组    
            loadStoryMore: false //把"上拉加载"的变量设为false，显示  
          });
          console.log("第" + currentStoryPage + "数据", typeof currentStoryPage);
          if (res.data.length < pageStorySize) {
            that.setData({
              loadStoryMore: false, //隐藏加载中。。
              loadStoryAll: true //所有数据都加载完了
            });
          }
        } else {
          that.setData({
            loadStoryAll: true, //把“没有数据”设为true，显示  
            loadStoryMore: false //把"上拉加载"的变量设为false，隐藏  
          });
        }
      })
      .catch(err => {
        console.log("请求失败", err);
        that.setData({
          loadStoryAll: false,
          loadStoryMore: false
        });
      });

  },
  //获取轮播图getIndexData
  getIndexData() {
    let that = this;
    const db = wx.cloud.database();
    db.collection('column').where({
      isBanner: true
    }).get().then(res => {
      //console.log(res.data)
      let obj = [];
      for (var i = 0; i < res.data.length; i++) {
        obj[obj.length] = {
          id: i,
          type: 'image',
          url: res.data[i].cimg,
          cid: res.data[i].cid
        };
      }
      that.setData({
        swiperList: obj
      });
      console.log(obj, res.data)
    });
  },
    //获取电影栏目
  getlVideoColumn:function(){
    let that = this;
    //电影栏目分组开始
    let currentPage = this.data.currentPage; // 当前第几页,0代表第一页 
    let pageSize = this.data.pageSize; //每页显示多少数据

    //第一次加载数据
    if (currentPage == 1) {
      this.setData({
        loadMore: true, //把"上拉加载"的变量设为true，显示  
        loadAll: false //把“没有数据”设为false，隐藏  
      })
    }
    wx.cloud.database().collection("column").skip(currentPage * pageSize) //从第几个数据开始
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


        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      })
      .catch(err => {
        console.log("请求失败", err);
        that.setData({
          loadAll: false,
          loadMore: false
        });
      });

    //电影栏目分组结束
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getIndexData();
    this.getlVideoColumn();
    this.getStoryList();
    this.towerSwiper('swiperList');
    // 在页面中定义插屏广告
    let interstitialAd = null

    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-4cbd4ee36b1553f0'
      })
      interstitialAd.onLoad(() => { })
      interstitialAd.onError((err) => { })
      interstitialAd.onClose(() => { })
    }

    setTimeout(function () {
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
      
    }, 5000)

  },
  
  DotStyle(e) {
    this.setData({
      DotStyle: e.detail.value
    })
  },
  // towerSwiper
  // 初始化towerSwiper
  towerSwiper(name) {
    let list = this.data[name];
    for (let i = 0; i < list.length; i++) {
      list[i].zIndex = parseInt(list.length / 2) + 1 - Math.abs(i - parseInt(list.length / 2))
      list[i].mLeft = i - parseInt(list.length / 2)
    }
    this.setData({
      swiperList: list
    })
  },
  // towerSwiper触摸开始
  towerStart(e) {
    this.setData({
      towerStart: e.touches[0].pageX
    })
  },
  // towerSwiper计算方向
  towerMove(e) {
    this.setData({
      direction: e.touches[0].pageX - this.data.towerStart > 0 ? 'right' : 'left'
    })
  },
  // towerSwiper计算滚动
  towerEnd(e) {
    let direction = this.data.direction;
    let list = this.data.swiperList;
    if (direction == 'right') {
      let mLeft = list[0].mLeft;
      let zIndex = list[0].zIndex;
      for (let i = 1; i < list.length; i++) {
        list[i - 1].mLeft = list[i].mLeft
        list[i - 1].zIndex = list[i].zIndex
      }
      list[list.length - 1].mLeft = mLeft;
      list[list.length - 1].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    } else {
      let mLeft = list[list.length - 1].mLeft;
      let zIndex = list[list.length - 1].zIndex;
      for (let i = list.length - 1; i > 0; i--) {
        list[i].mLeft = list[i - 1].mLeft
        list[i].zIndex = list[i - 1].zIndex
      }
      list[0].mLeft = mLeft;
      list[0].zIndex = zIndex;
      this.setData({
        swiperList: list
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      cardCur: 0,
      swiperList: [],
      moveList: [],
      storyList: [],
      loadMore: false, //"上拉加载"的变量，默认false，隐藏  
      loadAll: false, //“没有数据”的变量，默认false，隐藏 
      loadStoryMore: false,
      loadStoryAll: false,
      currentPage: 0,
      currentStoryPage: 0,
      pageSize: 6, //每页显示多少数据
      pageStorySize: 6, //每页显示多少数据
    });
    this.getIndexData();
    this.getlVideoColumn();
    this.getStoryList();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "ۇكىلى قىز كينو دەتالى",
      path: `/pages/index/index`
    }
  }

})
