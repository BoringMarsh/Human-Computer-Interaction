// pages/infoDetail/infoDetail.js
const db = wx.cloud.database();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        background: ['../../images/banner1.jpeg', '../../images/banner2.jpeg'],
        collectionIcon: ['../../images/collection1.png', '../../images/collection1_fill.png'],
        info: {},
        openid: '',
        from: ''
    },

    toCollection() {
        let { info, openid, from } = this.data;
        let collectionIcon = this.data.collectionIcon;
        let _id = info._id;
        let id = info.id;
        delete info['_id'];
        delete info['_openid'];
        if (collectionIcon[0] === '../../images/collection1.png') {
            console.log(123123);
            // 需要去收藏
            db.collection('collection').add({
                data: {
                    ...info,
                    id: from === 'collection' ? id : _id
                },
                success: (res) => {
                    console.log(res);
                    wx.showToast({
                      title: '收藏成功',
                      icon: 'none'
                    })
                    let last = collectionIcon.pop();
                    collectionIcon.unshift(last);
                    this.setData({
                        collectionIcon,
                    })
                },
                fail: (err) => {
                    console.log(err);
                }
            })
        } else {
            db.collection('collection').where({
                id: from === 'collection' ? id : _id,
                _openid: openid
            }).get({
                success: (res) => {
                    const { data } = res;
                    if (data.length > 0) {
                        const __id = data[0]._id;
                        db.collection('collection').doc(__id).remove({
                            success: (res) => {
                                wx.showToast({
                                    title: '取消成功',
                                    icon: 'none'
                                  })
                                let last = collectionIcon.pop();
                                collectionIcon.unshift(last);
                                this.setData({
                                   collectionIcon,
                                })
                            }
                        })
                    }
                }
            })
        }
    },

    getPhone() {
        const { info } = this.data;
        wx.showModal({
          title: '联系方式',
          content: info.phone,
          confirmText: '复制',
          success: (res) => {
            if (res.confirm) {
                wx.setClipboardData({
                  data: info.phone,
                  success: (res) => {
                      wx.showToast({
                        icon: 'none',
                        title: '内容已复制',
                      })
                  }
                })
            }
          }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
    //  第一种方式: 

       const { info, from } = options;
       const _info = JSON.parse(info);
       // JSON.stringify 将对象转为字符串
       // JSON.parse 将字符串转为对象
       if (info) {
           this.setData({
               info: _info,
               from
           })
       }

       // 1. 筛出当前详情数据的_id
       // 2. 获取缓存里的opneid
       // 3. 去collection表里, 根据_id和openid去查找
       // 4. 如果存在数据, 就说明当前用户收藏过当前物品
       const { _id, id } = _info;
       const openid = wx.getStorageSync('openid');
       this.setData({
           openid
       })
       let collectionIcon = this.data.collectionIcon;
       console.log(_id, openid);
       db.collection('collection').where({
           id: from === 'collection' ? id : _id,
           _openid: openid
       }).get({
           success: (res) => {
              console.log(res);
              if (res.data.length > 0) {
                let last = collectionIcon.pop();
                collectionIcon.unshift(last);
                this.setData({
                    collectionIcon,
                })
              }
           }
       })


    // 第二种方式:
        // const { id } = options;
        // db.collection('publish').where({
        //     _id: id
        // }).get({
        //     success: (res) => {
        //         console.log(res);
        //         const { data } = res;
        //         this.setData({
        //             info: data[0]
        //         })
        //     }
        // })
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