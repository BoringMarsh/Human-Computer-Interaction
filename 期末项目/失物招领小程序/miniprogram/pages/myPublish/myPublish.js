// pages/collection/collection.js
import { formatTime } from '../../utils/index';
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: ["寻主", "寻物"],
        list: [],
        select: 0
    },

    getDelete(e) {
        const id = e.detail;
        db.collection('publish').doc(id).remove({
            success: () => {
                db.collection('collection').where({
                    id
                }).remove();
                
                wx.showToast({
                    title: '删除成功!',
                    icon: 'none',
                    success: () => {
                        this.onLoad();
                    }
                })
            },
        })
    },

    getUpdate(e) {
        const id = e.detail;
        console.log(id);
        wx.navigateTo({
          url: `../publish/publish?id=${id}`,
        })
    },

    getTab(e) {
        const select = e.detail;
        this.setData({
            select
        })
        this.onLoad();
    },
    toDetail(e) {
        const { item } = e.currentTarget.dataset;
       // 第一种:
        wx.navigateTo({
           url: `../infoDetail/infoDetail?info=${JSON.stringify(item)}`,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const { select } = this.data;
        const openid = wx.getStorageSync('openid')
        db.collection('publish').where({
            type: String(select),
            _openid: openid
        }).get({
            success: (res) => {
                const { data } = res;
                console.log(data);
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
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})