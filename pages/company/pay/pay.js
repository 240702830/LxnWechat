// pages/store/product/product.js
const time = require('../../../utils/util.js')

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    scancode: "",
    total_amount: "",
    client_sn: ""
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

  },

  /**
   * 扫一扫
   */
  bindScanPro: function (e) {
    wx.scanCode({
      success: (res) => {
        this.setData({
          scancode: res.result
        });
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'none',
          duration: 2000
        })
      },


    })
  },

  //文本改变事件
  changeEditCode: function (e) {
    e.detail.value = e.detail.value.trim()
    this.setData({
      scancode: e.detail.value,
    });
  },

  //文本改变事件
  changeEditNo: function (e) {
    e.detail.value = e.detail.value.trim()
    this.setData({
      client_sn: e.detail.value,
    });
  },

  //文本改变事件
  changeEditAmount: function (e) {
    e.detail.value = e.detail.value.trim()
    this.setData({
      total_amount: e.detail.value,
    });
  },
  
  addSave: function (e) {
    debugger;
    var that = this;

    app.apirequest('Pay/GeneralPay', {
      "terminal_sn": '100114020006129579', "client_sn": that.data.client_sn,
      "total_amount": that.data.total_amount, "dynamic_id": that.data.scancode, "subject": '测试交易', "operatoruser":'鲁小二'}, function (res) {
        debugger;
      if (res.data.Status == 0) {
        wx.showToast({
          title: res.data.Error,
          icon: 'succeed',
          duration: 1000
        })
      } else {
        wx.showToast({
          title: res.data.Error,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },

})