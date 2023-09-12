// pages/publish/publish.js
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 展示的两列数据源
        multiArray: [
            ['卡片、证件类', '生活用品', '数码产品', '美妆护肤类', '衣服物品类', '饰品', '文娱', '其它'], 
            ['身份证', '校园卡', '学生证', '水卡', '公交卡', '银行卡', '其它']
        ],
        // 第二列的储备数据源
        pickerList: [
            ['身份证', '校园卡', '学生证', '水卡', '公交卡', '银行卡', '其它'],
            ['水杯', '雨伞', '小风扇', '钥匙/钥匙扣', '其它'],
            ['手机', '相机', 'U盘/硬盘', '充电宝', '平板电脑', '鼠标', '充电线', '耳机', '手写笔', '支架', '音箱', 'MP3', '其它'],
            ['口红', '粉底', '眉笔', '腮红', '眼影', '防晒', '喷雾', '香水', '其它'],
            ['男装', '女装', '男鞋', '女鞋', '包包', '其它'],
            ['手表', '项链', '手链', '戒指', '耳饰', '眼镜', '帽子', '发饰', '其它'],
            ['教材', '笔记', '文具', '球/球拍', '护具', '跳绳', '自行车', '棋牌', '其它'],
            ['药品', '零食', '周边', '其它']
        ],
        multiIndex: [0, 0],
        select: false,
        name: '',
        date: '',
        region: '',
        phone: '',
        desc: '',
        imgList: [],
        type: '',
        type_check: false,
        name_check: false,
        date_check: false,
        region_check: false,
        phone_check: false,
        id: ''
    },

    toPublish() {
        /**
         *  type: 失物招领的类型  0 => 寻物  1 => 寻主
         *  classify1: 一级分类
         *  classify2: 二级分类
         *  name: 物品名称
         *  date: 丢失/拾取时间
         *  region: 丢失/拾取地点
         *  phone: 联系方式
         *  desc: 物品描述
         *  imgList: 上传的图片
         *  time: 发布时间
         */

        // multiArray[0][multiIndex[0]]
        const {
            type, 
            multiArray, 
            multiIndex,  
            name,
            date,
            region,
            phone,
            desc,
            imgList,
            select,
            id
        } = this.data;
        if (!type) {
            this.setData({
                type_check: true
            })
        }
        if (!name) {
            this.setData({
                name_check: true
            })
        }
        if (!date) {
            this.setData({
                date_check: true
            })
        }
        if (!region) {
            this.setData({
                region_check: true
            })
        }
        if (!phone) {
            this.setData({
                phone_check: true
            })
        }
        if (!type || !select || !name || !date || !region || !phone) {
            wx.showToast({
              title: '未填写必填项',
              icon: 'none',
            });
            return;
        }

        if (id) {
            db.collection('publish').doc(id).update({
                data: {
                    type,
                    classify1: multiArray[0][multiIndex[0]],
                    classify2: multiArray[1][multiIndex[1]],
                    name,
                    date,
                    region,
                    phone,
                    desc,
                    imgList,
                    time: new Date().getTime()
                },
                success: () => {
                    db.collection('collection').where({
                        id,
                    }).update({
                        data: {
                            type,
                            classify1: multiArray[0][multiIndex[0]],
                            classify2: multiArray[1][multiIndex[1]],
                            name,
                            date,
                            region,
                            phone,
                            desc,
                            imgList,
                            time: new Date().getTime()
                        }
                    })
                    wx.switchTab({
                        url: '../index/index',
                        success: () => {
                            wx.showToast({
                              icon: 'none',
                              title: '修改成功!',
                            })
                        }
                     })
                }
            })
        } else {
            db.collection('publish').add({
                data: {
                    type,
                    classify1: multiArray[0][multiIndex[0]],
                    classify2: multiArray[1][multiIndex[1]],
                    name,
                    date,
                    region,
                    phone,
                    desc,
                    imgList,
                    time: new Date().getTime()
                },
                // 成功回调函数
                success: (res) => {
                    console.log(res);
                    wx.switchTab({
                        url: '../index/index',
                        success: () => {
                            wx.showToast({
                              icon: 'none',
                              title: '发布成功!',
                            })
                        }
                     })
                    // wx.showToast({
                    //   icon: 'none',
                    //   title: '发布成功',
                    //   duration: 1500,
                    //   success: () => {
                    //     setTimeout(() => {
                    //         wx.switchTab({
                    //             url: '../index/index',
                    //           })
                    //     }, 1500);
                    //   }
                    // })
    
                }
            })
        }

    },

    backPage() {
        // wx.navigateBack();
        wx.switchTab({
          url: '../index/index',
        })
    },

    selectType(e) {
        const { id } = e.currentTarget.dataset;
        this.setData({
            type: id,
            type_check: false
        })
    },

    deleteImg(e) {
        let { index } = e.currentTarget.dataset;
        let { imgList } = this.data;
        imgList.splice(index, 1);

        this.setData({
            imgList
        })
    },

    deleteDesc() {
        this.setData({
            desc: ''
        })
    },

    uploadImg() {
        let { imgList } = this.data;
        wx.chooseMedia({
            count: 6 - imgList.length,
            mediaType: ['image'],
            sourceType: ['album', 'camera'],
            success: (res) => {
                const { tempFiles } = res;

                tempFiles.forEach(item => {
                    wx.showLoading({
                      title: '上传中',
                    })
                    wx.cloud.uploadFile({
                        cloudPath: `publish/${Math.floor(Math.random() * 10000)}-${new Date().getTime()}.png`,
                        filePath: item.tempFilePath,
                        success: res => {
                            console.log('上传成功', res)
                            imgList.unshift(res.fileID);
                            console.log(imgList);

                            this.setData({
                                imgList
                            })
                            wx.hideLoading();
                        },
                    })
                })
            }
        })
    },

    getName(e) {
        console.log(e.detail.value)
        this.setData({
            name: e.detail.value,
            name_check: false
        })
    },

    getDate(e) {
        this.setData({
            date: e.detail.value,
            date_check: false
        })
    },

    getRegion(e) {
        this.setData({
            region: e.detail.value,
            region_check: false
        })
    },

    getPhone(e) {
        this.setData({
            phone: e.detail.value,
            phone_check: false
        })
    },

    getDesc(e) {
        // 如果不希望去掉多余空格, 就去掉.trim()
        this.setData({
            desc: e.detail.value.trim()
        })
    },

    closeSelect() {
        this.setData({
            select: false,
            multiIndex: [0, 0],
        })
    },

    bindMultiPickerChange(e) {
        this.setData({
            select: true
        })
    },

    bindMultiPickerColumnChange(e) {
        let { column, value } = e.detail;
        let data = this.data;
        let { multiArray, pickerList } = this.data;
        if (column === 0) {
            // 替换展示的数据源
            multiArray[1] = pickerList[value];
        }
        data.multiArray = multiArray;
        data.multiIndex[column] = value;
        this.setData(data);
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options);
        const { id } = options;
        const { multiArray, pickerList } = this.data;
        if (id) {
            db.collection('publish').where({
                _id: id
            }).get({
                success: (res) => {
                    console.log(res);
                    const { data } = res;
                    const { type, classify1, classify2, name, date, region, phone, desc, imgList } = data[0];
                    const index1 = multiArray[0].findIndex(item => item === classify1);
                    const index2 = pickerList[index1].findIndex(item => item === classify2);
                    console.log(index1, index2);
                    this.setData({
                        type,
                        select: true,
                        multiArray: [
                            multiArray[0],
                            pickerList[index1]
                        ],
                        multiIndex: [index1, index2],
                        name,
                        date,
                        region,
                        phone,
                        desc,
                        imgList,
                        id
                    })
                }
            })
        }
        const userInfo = wx.getStorageSync('userInfo');
        if (userInfo && userInfo.phone) {
            this.setData({
                phone: userInfo.phone
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