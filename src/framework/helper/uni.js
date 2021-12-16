/**
 * 扫码
 */
export const scanCode = params => {
  return new Promise(reslove => {
    uni.scanCode({
      ...params,
      success(res) {
        reslove(res);
      }
    });
  });
};

/**
 * 选择照片
 */
export const chooseImage = (params = {}) => {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      ...params,
      success(res) {
        resolve(res);
      },
      fail(error) {
        reject(error);
      }
    });
  });
};
