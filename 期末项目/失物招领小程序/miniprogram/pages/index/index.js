import { formatTime } from '../../utils/index';

const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    background: ['../../images/banner1.png', '../../images/banner2.png'],
    tabList: ['寻物', '寻主'],
    select: 0,
    list: [],
    login: false
  },

  getTab(e) {
    const select = e.detail;
    this.setData({
        select
    })
    this.onLoad();
  },

  toSearch() {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  toDetail(e) {
    const login = wx.getStorageSync('login');
    if (login) {
        const { item } = e.currentTarget.dataset;
        // 第一种:
        wx.navigateTo({
          url: `../infoDetail/infoDetail?info=${JSON.stringify(item)}`,
        })
    
        // 第二种: 
        // wx.navigateTo({
        //   url: `../infoDetail/infoDetail?id=${item._id}`,
        // })
    } else {
        wx.showToast({
          title: '请去个人中心登录',
          icon: 'none'
        })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { select } = this.data;
    this.setData({
        login: !!wx.getStorageSync('login')
    })

    db.collection('publish').where({
        type: String(select)
    }).get({
        success: (res) => {
            console.log(res);
            const { data } = res;
            this.setData({
                list: data.map(item => {
                    return {
                        ...item,
                        time: formatTime(item.time)
                    }
                })
            })
        }
    })

    const openid = wx.getStorageSync('openid');
    console.log(openid);
    if (!openid) {
    // 调用云函数, 获取当前用户的openid
    wx.cloud.callFunction({
        name: 'get_openid',
        success: (res) => {
            console.log(res);
            const { result: { openid } } = res;
            wx.setStorageSync('openid', openid);
        },
        fail: (err) => {
            console.log(err);
        }
    })
    }
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
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
            select: 0
        })
    }
    this.onLoad();
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