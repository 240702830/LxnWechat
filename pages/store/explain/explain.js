
const domain = require('../../../config').domain

Page({
  data: {
    list: [
      {
        id: 'view',
        name: '基础资料',
        open: false,
        pages: [{ id: 'jc', name: '商品、供应商、报价组操作说明' }, { id: 'cx', name:'促销操作说明'}]
      }, {
        id: 'content',
        name: '采购管理',
        open: false,
        pages: [{ id: 'kc', name: '订货、入库、返配、退货 操作说明' }]
      }, {
        id: 'form',
        name: '库存管理',
        open: false,
        pages: [{ id: 'kctz', name: '库存调整操作说明' }, { id: 'pd', name: '盘点管理操作说明' }]
      }
    ]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  previewdoc: function (e) {
    wx.showNavigationBarLoading();
    wx.downloadFile({
      url: domain + '/document/' + e.currentTarget.dataset.id+ '.docx',
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            wx.hideNavigationBarLoading()
            console.log('打开文档成功')
          }
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
})


