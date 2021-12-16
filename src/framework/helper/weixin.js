/**
 * 获取用户授权功能提示
 * @param scope 授权功能列表，参考uni.authorize的api文档
 */
const getAuthorize = (scope) => {
  return new Promise((reslove, reject) => {
    uni.authorize({
      scope: scope,
      success() {
        reslove(true);
      },
      fail(e) {
        reject(false);
      },
    });
  });
};

/**
 * 获取地理位置
 */
const getLocationInfo = (type) => {
  return new Promise((reslove, reject) => {
    uni.getLocation({
      type,
      success(res) {
        reslove(res);
      },
      fail() {
        reject("获取位置失败，请确认是否打开导航");
      },
    });
  });
};

/**
 * 获取微信用户数据
 */

const getUserInfo = () => {
  return new Promise((reslove, reject) => {
    if (uni.getUserProfile) {
      uni.getUserProfile({
        desc: "用于完善会员资料",
        success: (res) => {
          reslove(res);
        },
        fail(error) {
          reject(false);
        },
      });
    } else {
      uni.getUserInfo({
        withCredentials: true,
        lang: "zh_CN",
        success(res) {
          reslove(res);
        },
        fail(error) {
          reject(false);
        },
      });
    }
  });
};

export const getWeixinUserInfo = async () => {
  try {
    // await getAuthorize('scope.userInfo');
    let res = await getUserInfo();
    return res;
  } catch (e) {
    return false;
    // return new Promise((resolve, reject) => {
    //   uni
    //     .showModal({
    //       title: '友情提示',
    //       content: '取消授权后，部分功能将无法正常使用，建议开启。',
    //       showCancel: false,
    //       confirmText: '确认授权'
    //     })
    //     .then(res => {
    //       if (res[1]['confirm']) {
    //         uni.openSetting({
    //           success(result) {
    //             if (result.authSetting['scope.userInfo']) {
    //               getUserInfo().then(result => {
    //                 resolve(result);
    //               });
    //             } else {
    //               resolve(result.authSetting['scope.userInfo']);
    //             }
    //           }
    //         });
    //       }
    //     });
    // });
  }
};

/**
 * 微信登录
 */

export const uniLogin = () => {
  return new Promise((resolve, reject) => {
    uni.login({
      success(res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(false);
        }
      },
    });
  });
};

/**
 * 获取位置授权
 */
export const getAuthLocation = async (type = "wgs84") => {
  try {
    await getAuthorize("scope.userLocation");
    let res = await getLocationInfo(type);
    return res;
  } catch (e) {
    return new Promise((resolve, reject) => {
      uni
        .showModal({
          title: "友情提示",
          content: "取消授权后，部分功能将无法正常使用，建议开启。",
          showCancel: false,
          confirmText: "确认授权",
        })
        .then((res) => {
          if (res[1]["confirm"]) {
            uni.openSetting({
              success(res) {
                if (res.authSetting["scope.userLocation"]) {
                  getLocationInfo().then((result) => {
                    resolve(result);
                  });
                } else {
                  resolve(res.authSetting["scope.userLocation"]);
                }
              },
            });
          }
        });
    });
  }
};

/**
 * 调用腾讯位置服务导航
 * @param {*} name 目的地的名称
 * @param {*} latitude 维度
 * @param {*} longitude 经度
 */
export const openWxLocation = async () => {
  uni.getLocation({
    type: "gcj02", //返回可以用于uni.openLocation的经纬度
    success: function (res) {
      const latitude = res.latitude;
      const longitude = res.longitude;
      uni.openLocation({
        latitude: latitude,
        longitude: longitude,
        success: function () {
          console.log("success");
        },
      });
    },
  });
};

/**
 * 选择相机
 */
export const takeCamera = (fnName = "takePhoto", params = {}) => {
  const cameraContext = uni.createCameraContext();
  return new Promise((resolve, reject) => {
    cameraContext[fnName]({
      ...params,
      success(res) {
        resolve(res);
      },
      fail(error) {
        reject(error);
      },
    });
  });
};
