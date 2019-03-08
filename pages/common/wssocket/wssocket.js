// pages/common/wssocket/wssocket.js
const wshost = require('../../../config').wshost
const apihost = require('../../../config').apihost
var ws; 
var url = "http://localhost:12979/WebSocket/ProcessRequest"; 


Page({

  /**
   * 页面的初始数据
   */
  data: {
      user:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.wsLogin()
  },

  wsLogin:function(){
    this.data.user = wx.getStorageSync('userinfo');
    if (this.data.user == null || this.data.user == '') {
      wx.reLaunch({
        url: '/pages/store/login/login'  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      })
      return
    }else{
      
    }
  },

  /**
   * 打开连接
   */
  open: function () {
    //建立连接
    wx.connectSocket({
      url: wshost + "?userKey=123",
      method: "Get"
    })

    //连接成功
    wx.onSocketOpen(function () {
      wx.sendSocketMessage({
        data: 'stock',
      })
    })


    //接收数据
    wx.onSocketMessage(function (data) {
      console.log(data);
    })

    //连接失败
    wx.onSocketError(function () {
      console.log('websocket连接失败！');
    })
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