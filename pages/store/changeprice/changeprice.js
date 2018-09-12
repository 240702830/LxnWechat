// pages/store/product/product.js
const time = require('../../../utils/util.js')

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [],
    storearray: [],
    index: 0,
    keyword: "",
    scancode: ""
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
        this.GetPro();
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
  //编辑搜索条码
  bindEditCode: function (e) {
    e.detail.value = e.detail.value.trim()
    if (e.detail.value != this.data.keyword) {
      this.setData({
        scancode: e.detail.value,
        keyword: e.detail.value
      });
      this.GetPro();
    }
  },
  //文本改变事件
  changeEditCode: function (e) {
    e.detail.value = e.detail.value.trim()
    if (e.detail.value != this.data.keyword) {
      this.setData({
        scancode: e.detail.value,
        keyword: e.detail.value
      });
      this.GetPro();
    }
  },
  //离开售价文本框事件
  blurEditPrice: function (e) {
    var that = this;
    if (e.detail.value === "") {
      wx.showToast({
        title: "未填写售价,价格将不会被修改",
        icon: 'none',
        duration: 1500
      })
    } else {
      for (var i = 0; i < that.data.storearray.length; i++) {
        if (that.data.storearray[i].Id == e.target.id) {
          if (e.detail.value >= 0 && e.detail.value !== "") {
            var Price = 'storearray[' + i + '].Price'
            that.setData({
              [Price]: e.detail.value.trim()
            })
          }
        }
      }
    }
  },

  //离开排序文本框事件
  blurEditSort: function (e) {
    var that = this;
    if (e.detail.value === "") {
      wx.showToast({
        title: "未填写排序,排序将不会被修改",
        icon: 'none',
        duration: 1500
      })
    } else {
      for (var i = 0; i < that.data.storearray.length; i++) {
        if (that.data.storearray[i].Id == e.target.id) {
          if (e.detail.value != "" && e.detail.value !== "") {
            var Sort = 'storearray[' + i + '].Sort'
            that.setData({
              [Sort]: e.detail.value.trim()
            })
          }
        }
      }
    }
  },
  /**
   * 获取产品信息
   */
  GetPro: function () {
    var that = this;
    if (that.data.scancode != "") {
      app.apirequest('Product/GetProductComDtoList', { "Name": that.data.scancode, "Type": 5 }, function (res) {
        if (res.data.Status == 0) {
          that.setData({
            index: 0,
            array: res.data.Data
          })
          for (var i = 0; i < that.data.array.length; i++) {
            var IsPurchase = 'array[' + i + '].IsPurchase'
            that.setData({
              [IsPurchase]: that.data.array[i].IsPurchase == true ? '否' : '是'
            })
          }


          that.UpProInfo();
        } else {
          wx.showToast({
            title: res.data.Error,
            icon: 'none',
            duration: 2000
          })
        }

      })
    }
  },

  /**
   * 更新产品信息
   */
  UpProInfo: function () {
    var that = this;
    app.apirequest('Product/GetProductComPriceList', { "Id": that.data.array[that.data.index].Id }, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          storearray: res.data.Data
        })

        for (var i = 0; i < that.data.storearray.length; i++) {
          var LastModifyTime = 'storearray[' + i + '].LastModifyTime'
          that.setData({
            [LastModifyTime]: that.data.storearray[i].LastModifyTime.substring(5, 16),
          })
        }

      } else {
        wx.showToast({
          title: res.data.Error,
          icon: 'none',
          duration: 2000
        })
        that.setData({
          storearray: []
        })
      }
    })
  },

  addSave: function (e) {
    var that = this;
    var list = [];

    for (var i = 0; i < that.data.storearray.length; i++) {
      var model = {
        "Id" : that.data.storearray[i].Id,
        "Price" : that.data.storearray[i].Price,
        "Sort": that.data.storearray[i].Sort,
        "PriceGroupId": that.data.storearray[i].PriceGroupId
      }
      list.push(model);
    }

    app.apirequest('Product/AlterProductDtoList', { "ProductId": that.data.array[that.data.index].Id, "PriceGroupDetailList": list }, function (res) {
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

  /**
   * 下拉改变值事件
   */
  bindPickerChange: function (e) {
    var that = this;
    console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      index: e.detail.value
    });
    that.UpProInfo();
  }

})