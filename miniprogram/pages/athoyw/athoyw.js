// pages/athoyw/athoyw.js
import Toast from 'vant-weapp/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stars: 5,
    dataList: [], //放置返回数据的数组
    searchList: [],
    loadMore: false, //"上拉加载"的变量，默认false，隐藏  
    loadAll: false, //“没有数据”的变量，默认false，隐藏 
    loadSearchMore: false, //"上拉加载"的变量，默认false，隐藏  
    loadSearchAll: false, //“没有数据”的变量，默认false，隐藏 
    currentPage: 0, // 当前第几页,0代表第一页 
    pageSize: 20, //每页显示多少数据
    currentSearchPage: 0, // 当前第几页,0代表第一页 
    pageSearchSize: 20, //每页显示多少数据
    activeName: '1',
    searchName: '',
    active: 'home',
    isSearch:false,
    nofound: false
  },
  //下方按钮点击
  onFootTabChange(event) {
    console.log(event.detail);
    if(event.detail == 'mine'){
      wx.reLaunch({
        url: '../profile/profile'
      })
    }
    if (event.detail == 'news') {
      wx.reLaunch({
        url: '../news/news'
      })
    }
  },

  onMySearch(event) {
    let serchname = event.detail;
    this.setData({
      searchName: serchname.trim(),
      searchList: [],
      nofound: false,
      currentSearchPage: 0, // 当前第几页,0代表第一页 
      pageSearchSize: 20 //每页显示多少数据
    });
 
    if (this.data.searchName.length == 0) {
     this.setData({
       isSearch: false,
       dataList: [],
       nofound: false,
       searchList: [],
       currentPage: 0, // 当前第几页,0代表第一页 
       pageSize: 20, //每页显示多少数据
       currentSearchPage: 0, // 当前第几页,0代表第一页 
       pageSearchSize: 20 //每页显示多少数据
     });
     this.getData();
   }else{
     this.getSearchData();
   }
  },

  onTheSearch: function () {
    console.log(this.data.searchName)
  },

  

  onNameChange(event) {
    this.setData({
      activeName: event.detail
    });
  },

  //获取意思
  getMean: function(event){
    wx.navigateTo({
      url: `../mean/mean?nameid=${event.target.dataset.nameid}`,
    });
  },

  //访问网络,请求数据  
  getData() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0,
      message: 'اشىلۋدا ...'
    });
    let that = this;
    let currentPage = this.data.currentPage; // 当前第几页,0代表第一页 
    let pageSize = this.data.pageSize; //每页显示多少数据 
    //第一次加载数据
    if (currentPage == 1) {
      this.setData({
        loadMore: true, //把"上拉加载"的变量设为true，显示  
        loadAll: false //把“没有数据”设为false，隐藏  
      })
    }
    //云数据的请求
    wx.cloud.database().collection("my_name")
      .orderBy('name', 'asc').skip(currentPage * pageSize) //从第几个数据开始
      .limit(pageSize)
      .get({
        success(res) {
          Toast.clear();
          if (res.data && res.data.length > 0) {
            
            that.setData({
              currentPage: currentPage+1    
            });
            //把新请求到的数据添加到dataList里  
            let list = that.data.dataList.concat(res.data)
            that.setData({
              dataList: list, //获取数据数组    
              loadMore: false //把"上拉加载"的变量设为false，显示  
            });
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
        },
        fail(res) {
          Toast.clear();
          console.log("请求失败", res)
          that.setData({
            loadAll: false,
            loadMore: false
          });
        }
      })
  },

  //搜索  
  getSearchData() {
    Toast.loading({
      mask: true,
      forbidClick: true,
      loadingType: 'spinner',
      duration: 0,
      message: 'اشىلۋدا ...'
    });
    let that = this;
    let currentSearchPage = this.data.currentSearchPage; // 当前第几页,0代表第一页 
    let pageSearchSize = this.data.pageSearchSize; //每页显示多少数据 


    //第一次加载数据
    if (currentSearchPage == 1) {
      this.setData({
        loadSearchMore: true, //把"上拉加载"的变量设为true，显示  
        loadSearchAll: false //把“没有数据”设为false，隐藏  
      })
    }
    this.setData({
      isSearch: true,
    });
    //云数据的请求
    wx.cloud.database().collection("my_name").where({
      name: {
        $regex: '^' + this.data.searchName + '.*$',
        $options: 'i'
      }
    }).orderBy('name', 'asc').skip(currentSearchPage * pageSearchSize) //从第几个数据开始
      .limit(pageSearchSize).get().then(res => {

        if (currentSearchPage == 0 && res.data.length == 0) {
          that.setData({
            nofound: true
          });
        }
        
    //nofound: false,
        Toast.clear();
        if (res.data && res.data.length > 0) {
          that.setData({
            currentSearchPage: currentSearchPage + 1
          });
          //把新请求到的数据添加到dataList里  
          let list = that.data.searchList.concat(res.data)
          that.setData({
            searchList: list, //获取数据数组    
            loadSearchMore: false //把"上拉加载"的变量设为false，显示  
          });
          if (res.data.length < pageSearchSize) {
            that.setData({
              loadSearchMore: false, //隐藏加载中。。
              loadSearchAll: true //所有数据都加载完了
            });
          }
        } else {
          that.setData({
            loadSearchAll: true, //把“没有数据”设为true，显示  
            loadSearchMore: false //把"上拉加载"的变量设为false，隐藏  
          });
        }
      }).catch(err => {
        Toast.clear();
        console.log("请求失败", err);
        that.setData({
          loadSearchAll: false,
          loadSearchMore: false
        });
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
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

      // 显示顶部刷新图标
      wx.showNavigationBarLoading();
      this.setData({
        dataList: [],
        loadMore: false, //"上拉加载"的变量，默认false，隐藏  
        loadAll: false, //“没有数据”的变量，默认false，隐藏 
        currentPage: 0, // 当前第几页,0代表第一页 
        pageSize: 20 //每页显示多少数据
      });
      Toast.loading({
        mask: true,
        forbidClick: true,
        loadingType: 'spinner',
        duration: 0,
        message: 'جاڭالانۋدا ...'
      });
      let that = this;
      let currentPage = this.data.currentPage; // 当前第几页,0代表第一页 
      let pageSize = this.data.pageSize; //每页显示多少数据 
      //第一次加载数据
      if (currentPage == 1) {
        this.setData({
          loadMore: true, //把"上拉加载"的变量设为true，显示  
          loadAll: false //把“没有数据”设为false，隐藏  
        })
      }
      //云数据的请求
      wx.cloud.database().collection("my_name")
        .orderBy('name', 'asc').skip(currentPage * pageSize) //从第几个数据开始
        .limit(pageSize)
        .get({
          success(res) {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
            Toast.clear();
            if (res.data && res.data.length > 0) {
              //console.log("请求成功", res.data)

              that.setData({
                currentPage: currentPage + 1
              });
              //把新请求到的数据添加到dataList里  
              let list = that.data.dataList.concat(res.data)
              that.setData({
                dataList: list, //获取数据数组    
                loadMore: false //把"上拉加载"的变量设为false，显示  
              });
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
          },
          fail(res) {
            // 隐藏导航栏加载框
            wx.hideNavigationBarLoading();
            // 停止下拉动作
            wx.stopPullDownRefresh();
            wx.hideLoading();
            console.log("请求失败", res)
            that.setData({
              loadAll: false,
              loadMore: false
            });
          }
        })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    let isSearch = this.data.isSearch;
    if (!isSearch){
      let that = this
      if (!that.data.loadMore) {
        that.setData({
          loadMore: true, //加载中  
          loadAll: false //是否加载完所有数据
        });
        //加载更多，这里做下延时加载
        setTimeout(function () {
          that.getData()
        }, 100)
      }
    }else{

      let that = this
      if (!that.data.loadSearchMore) {
        that.setData({
          loadSearchMore: true, //加载中  
          loadSearchAll: false //是否加载完所有数据
        });
        //加载更多，这里做下延时加载
        setTimeout(function () {
          that.getSearchData()
        }, 100)
      }

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'بالاعا ات قويۋ سەستاماسى',
      path: '/pages/athoyw/athoyw',
      //imageUrl: '/images/btshare.jpg'
    }
  }
})