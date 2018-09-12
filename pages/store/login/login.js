// pages/login/login.js

const apihost = require('../../../config').apihost

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LoginName: '',
    Password: ''
  },

  /**
   * 用户登录
   */
  loginuser: function (e) {
    // wx.setStorage({
    //   key: 'userinfo',
    //   data: {
    //     LoginName: '123',
    //     Password: '123456',
    //     StoreName: '东新路1',
    //     StoreId: '181'}
    // });
    //       wx.switchTab({
    //         url: '../../../pages/store/main/main'
    //       })

    wx.request({
      url: apihost + 'Login/UserLogin',
      // url: 'https://psme.xyz/api/Login/UserLogin',
      data: {
        "LoginName": this.LoginName,
        "Password": this.Password
        },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        success: function (res) {
        if (res.data.Status == 0) {
          var info= {
            lasttime: new Date().toLocaleDateString()
          }
          // es.data.Data.lasttime = new Date().toLocaleDateString()
          wx.setStorage({
            key: 'userinfo',
            data: Object.assign(info, JSON.parse(res.data.Data))
          });

          wx.switchTab({
            url: '../../../pages/store/main/main'
          })
        }else{
          wx.showToast({
            title: '失败',  
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //用户名
  bindInputNameBlur: function (e) {
    this.LoginName = e.detail.value
  },
  //密码
  bindInputPassBlur: function (e) {
    this.Password = e.detail.value
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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