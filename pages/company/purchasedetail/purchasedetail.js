// pages/company/purchasedetail/purchasedetail.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navbar: ['全部', '已采购', '未采购'],
    currentTab: 0,
    inputShowed: false,
    inputVal: "",
    array: [],
    allData: [],
    listData: [],
    showModalStatus: false,
    PurchaseOrderId: "",
    PurchaseId: "",

    ///弹框
    popId: "",
    popGoodsNo: "",
    popGoodsName: "",
    popQuantity: "",
    popStockNum: "",
    popBuyQuantity: "",
    popSumPrice: "",
    popUnitPrice: "",
    popRemark: "",
    popNum: "",
    popPrice: "",

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.screenList();
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
    this.screenList();
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
    this.screenList();
  },


  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },


  screenList: function () {
    var that = this;

    var allData = this.data.allData;
    var keyword = this.data.inputVal;
    var obj = new Array;

    if (keyword != null && keyword != "") {
      for (var i = 0; i < allData.length; i++) {
        if (allData[i].GoodsName.indexOf(keyword) != -1) {
          obj = obj.concat(allData[i]);
        }
      }
      that.setData({
        listData: obj
      })
    } else {
      that.setData({
        listData: allData
      })
    }


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;


    app.apirequest('Purchase/GainPurchaseDetailList', { "length": 10000, "searchParam": [{ "name": "PurchaseOrderId", "value": options.PurchaseOrderId }] }, function (res) {
      if (res.data.Status == 0) {
        that.setData({
          listData: res.data.Data.data.sort(function (a, b) {
            return (a.BuyQuantity - a.Quantity) < (b.BuyQuantity - b.Quantity)
          }),
          allData: res.data.Data.data.sort(function (a, b) {
            return (a.BuyQuantity - a.Quantity) < (b.BuyQuantity - b.Quantity)
          }),
          PurchaseOrderId: options.PurchaseOrderId,
          PurchaseId: options.PurchaseId
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
   * 修改数量
   */
  bindpopNum: function (e) {
    this.setData({
      popNum: e.detail.value
    })
  },
  /**
   * 修改金额
   */
  bindpopPrice: function (e) {
    this.setData({
      popPrice: e.detail.value
    })
  },
  /**
   * 修改备注
   */
  bindpopRemark: function (e) {
    this.setData({
      popRemark: e.detail.value
    })
  },
  /**
   * 修改总金额
   */
  bindpopSumPrice: function (e) {
    this.setData({
      popSumPrice: e.detail.value
    })
  },
  /**
   * 修改采购量
   */
  bindpopQuantity: function (e) {
    this.setData({
      popQuantity: e.detail.value
    })
  },
  /**
   * 保存修改的数据
   */
  powerOk: function (e) {
    var that = this;
    this.powerDrawer(e);

    var GoodsNo = this.data.popGoodsNo
    var Id = this.data.popId
    var Quantity = Math.round(Math.round(this.data.popQuantity * 100) + Math.round(this.data.popNum == "" ? 0 : this.data.popNum * 100)) / 100
    var SumPrice = Math.round(Math.round(this.data.popSumPrice * 100) + Math.round(this.data.popPrice == "" ? 0 : this.data.popPrice * 100)) / 100

    if (Quantity < 0 || SumPrice < 0) {
      wx.showToast({
        title: "请填写正确的数量",
        icon: 'none',
        duration: 2000
      })
    } else {
      app.apirequest('Purchase/SaveDetail', { "PurchaseOrderId": this.data.PurchaseOrderId, "GoodsNo": GoodsNo, "PurchaseId": this.data.PurchaseId, "DetailType": 3, "Id": this.data.popId, "SumPrice": SumPrice, "Quantity": Quantity, "Remark": this.data.popRemark }, function (res) {
        if (res.data.Status == 0) {
          wx.showToast({
            title: res.data.Error,
            icon: 'succeed',
            duration: 2000
          })
          that.GetDetail(Id)
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


  // 模态框
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    var that = this;
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu.statu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu.statu == "open") {
      this.GetDetail(currentStatu.goodsno)
      this.setData(
        {
          popName: currentStatu.goodsname,
          showModalStatus: true
        }
      );
    }
  },
  GetDetail: function (goodsno) {
    var that = this
    app.apirequest('Purchase/GetPurchaseOrderDetail', { "PurchaseOrderId": this.data.PurchaseOrderId, "GoodsNo": goodsno, "ReservoirAreaId": 173, "Id": 0 }, function (res) {
      if (res.data.Status == 0) {
        that.setData(
          {
            popGoodsName: res.data.Data.GoodsName,
            popId: res.data.Data.Id,
            popGoodsNo: res.data.Data.GoodsNo,
            popQuantity: res.data.Data.Quantity,
            popStockNum: res.data.Data.StockNum,
            popBuyQuantity: res.data.Data.BuyQuantity,
            popSumPrice: res.data.Data.SumPrice,
            popUnitPrice: res.data.Data.UnitPrice,
            popRemark: res.data.Data.Remark,
            popNum: "",
            popPrice: "",
            showModalStatus: true
          }
        )

        for (var i = 0; i < that.data.allData.length; i++) {

          var Id = 'allData[' + i + '].Id'
          var BuyQuantity = 'allData[' + i + '].BuyQuantity'
          var UnitPrice = 'allData[' + i + '].UnitPrice'
          var Quantity = 'allData[' + i + '].Quantity'
          var SumPrice = 'allData[' + i + '].SumPrice'
          if (that.data.allData[i].Id == res.data.Data.Id) {
            that.setData({
              [BuyQuantity]: res.data.Data.BuyQuantity,
              [UnitPrice]: res.data.Data.UnitPrice,
              [Quantity]: res.data.Data.Quantity,
              [SumPrice]: res.data.Data.SumPrice,
            })
            that.screenList();
            break;
          }
        }
      } else {
        wx.showToast({
          title: res.data.Error,
          icon: 'none',
          duration: 2000
        })
      }
    })
  }

})