const keyName = "topnet-";

/**
 * 同步存储Storage
 */
export const setStore = (params = {}) => {
  let { name, content } = params;
  name = keyName + name;
  let obj = {
    dataType: typeof content,
    content: content,
    datetime: new Date().getTime(),
  };
  uni.setStorageSync({
    key: name,
    data: JSON.stringify(obj),
  });
};

/**
 * 同步获取Storage
 */
export const getStore = (params = {}) => {
  let { name, debug } = params;
  name = keyName + name;
  let obj = {},
    content;
  obj = uni.getStorageSync(name);
  try {
    obj = JSON.parse(obj);
  } catch {
    return obj;
  }
  if (debug) {
    return obj;
  }
  if (obj.dataType == "string") {
    content = obj.content;
  } else if (obj.dataType == "number") {
    content = Number(obj.content);
  } else if (obj.dataType == "boolean") {
    content = eval(obj.content);
  } else if (obj.dataType == "object") {
    content = obj.content;
  }
  return content;
};

/**
 * 删除Storage
 */
export const removeStore = (params = {}) => {
  let { name } = params;
  name = keyName + name;
  uni.removeStorageSync(name);
};

/**
 * 清空全部Storage
 */
export const clearStore = () => {
  uni.clearStorageSync();
};
