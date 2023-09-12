
import { formatTime } from '../../utils/index';
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabList: ["寻主", "寻物"],
        list: [],
        select: 0,
        text: '',
        from: ''
    },

    getTab(e) {
        const { text, from } = this.data;
        const select = e.detail;
        this.setData({
            select
        })
        this.onLoad({ text, from });
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
        const { text, from } = options;
        this.setData({
            text,
            from
        })
        const { select } = this.data;
        if (from === 'classify') {
            db.collection('publish').where({
                type: String(select),
                classify2: text
            }).get({
                success: (res) => {
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
        } else if (from === 'search') {
            db.collection('publish').where({
                type: String(select),
                name: db.RegExp({
                  regexp: text,
                  options:'i'
                })
            }).get({
                success: (res) => {
                    const { data } = res;
 
                    this.setData({
                        list: data
                    })
                }
            })
        }
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