// pages/company/purchase/purchase.js

var app = getApp()


Page({

  




  /**
   * 页面的初始数据
   */
  data: {
    arrays: [],
    index: 0,
    CreateUserId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.LoadList()

  },

  /**
   * 加载采购单信息
   */
  LoadList: function () {
    var that = this;
    app.pagerequest('Purchase/GainPurchaseOrderList', "purchase", "init", {}, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          arrays: res.data.Data.data
        })

        wx.stopPullDownRefresh({
          complete: function (res) {
            wx.hideToast()
          }
        })

      } else {
        wx.showToast({
          title: res.data.Error,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  /**
   * 用户登录
   */
  skipdetails: function (e) {
    wx.navigateTo({
      url: '../../../pages/company/purchasedetail/purchasedetail?PurchaseOrderId=' + e.currentTarget.dataset.id + '&PurchaseId=' + e.currentTarget.dataset.purchaseid
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
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    this.LoadList()
  },

  stopPullDownRefresh: function () {
    wx.stopPullDownRefresh({
      complete: function (res) {
        wx.hideToast()
        console.log(res, new Date())
      }
    })
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