// pages/detail/detail.js
import Notify from '@vant/weapp/notify/notify';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    list: [],
    show: true,
    fileList: [], //上传的图片
    my_star: 0, //我的评分
    my_rating: '', //我的评语
    fileIDS: [],//所有的图片云ID
    rows:[],//所有的promis对象
    isDisbol:false
  },

  onMyStarChange: function (event) { //评分修改后触发
    console.log(event.detail);
    this.setData({
      my_star: event.detail
    });
  },

  onMyRatingChange: function (event) { //评价框输入内容时触发
    //console.log(event.detail);
    this.setData({
      my_rating: event.detail
    });
  },

  afterRead(event) { //图片读取完毕后的操作
    const { file } = event.detail;
    //console.log(file.path);
    const {
      fileList = []
    } = this.data;
    fileList.push({
      ...file,
      url: file.path
    });
    this.setData({
      fileList
    });
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
  },

  clickDeletPic(event){//点击删除图片按钮
    let fiels = this.data.fileList;
    let ind = event.detail.index;
    fiels.splice(ind, 1);
    this.setData({
      fileList: fiels
    });
  },

  clickUp:function() {//点击发表按钮
    let rating = this.data.my_rating;
    let fileList = this.data.fileList;
    if (rating==""){
      Notify({ type: 'danger', message: '请填写评论' });
    } else if (fileList.length==0){
      Notify({ type: 'danger', message: '请上传图片' });
    }else{
      this.uploadAll();
    }

  },

  uploadAll: function () { //上传评论函数
    this.setData({ isDisbol:true });
    wx.showLoading({
      title: '发表中',
    });
    //1.图片上传至云存储
    let fileLists = this.data.fileList;//所有的图片
    let rows = [];
    for (var i = 0; i < fileLists.length; i++) {

      let newTime = new Date().getTime();//当前时间戳
      let file_path = fileLists[i].path;//文件的临时路径
      let file_name_end = file_path.match(/\.\w+$/)[0];//获取文件后缀名
      let fileName = parseInt(Math.random() * 9999) + newTime + file_name_end;//生成新的文件名,时间戳+文件后缀

      //console.log(fileName);

      rows[i] = new Promise((resolve, reject) => {
        wx.cloud.uploadFile({//上传
          // 指定上传到的云路径
          cloudPath: fileName,
          // 指定要上传的文件的小程序临时文件路径
          filePath: file_path,
          // 成功回调
          success: res => {
            //console.log('上传成功');
            this.data.fileIDS.push(res.fileID);
            resolve(res.fileID);
          },
        });
      });

    }
    this.setData({rows});
    //2.数据添加至数据库
    
    Promise.all(rows).then(res => {
      console.log(res);
      wx.hideLoading();
      //console.log(this.data.fileIDS);
      let db = wx.cloud.database();
      let star = this.data.my_star;
      let rating = this.data.my_rating;
      let fileIDS = this.data.fileIDS;
      let moveID = this.data.id;
      let createDate = new Date().getTime();
      let that = this;

      db.collection("mymovie").add({
        data:{
          moveID,star, rating, fileIDS,createDate
        }
      }).then(res=>{
        console.log(res);
        Notify({ type: 'success', message: '发表成功！', onClose:function(){
          that.setData({ isDisbol: false, my_star: 0, my_rating: "", fileList: [] });
        } });
        
      }).catch(err=>{
        console.log(err)
      })

    }).catch(err => {
      console.log(err)
    })

  },

  getDetails: function (id) {//获取电影详情
    wx.showLoading({
      title: '加载中',
    });
    let that = this;
    wx.cloud.callFunction({
      name: "getDoubanApi",
      data: {
        url: `http://api.douban.com/v2/movie/subject/${id}?apikey=0df993c66c0c636e29ecbb5344252a4a`
      }
    }).then(res => {
      wx.hideLoading();
      let obj = JSON.parse(res.result);
      console.log(obj);
      that.setData({
        list: obj,
        show: false
      });

      wx.setNavigationBarTitle({
        title: obj.title,
      });

    }).catch(err => console.log(err));
  },

  //获取用户评论
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {//页面加载获取id，并调用获取详情函数
    console.log(options.id);
    this.getDetails(options.id);
    this.setData({
      id: options.id
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})