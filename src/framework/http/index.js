/**
 * 全站http配置
 */
import Request from "../helper/request";
import { getStore } from "../helper";
import store from "../store";
import baseUrl from "@/config/baseUrl";
// 请求类
class HttpRequest {
  /**
   * http请求方法
   * @param {*} config 请求参数
   */
  request() {
    const instance = this._createAxios();
    this._requestInterceptors(instance);
    this._responseInterceptors(instance);
    return instance;
  }
  /**
   * 创建axios实例
   * @param {*} axios axios对象
   */
  _createAxios() {
    let _http = new Request();
    _http.setConfig((config) => {
      let _config = Object.assign(config, {
        baseURL: baseUrl || "/",
        timeout: 100000,
        // #ifdef H5
        withCredentials: true,
        // #endif
        header: {
          "Content-Type": "application/json;charset=UTF-8",
        },
        validateStatus: (status) => {
          return status >= 200 && status <= 500;
        },
      });
      return _config;
    });
    return _http;
  }
  /**
   * 请求拦截
   * @param {*} instance axios实例
   */
  _requestInterceptors(instance) {
    instance.interceptors.request.use(
      (config) => {
        const access_token = getStore({
          name: "access_token",
        });
        if (access_token) {
          config.header["access_token"] = access_token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }
  /**
   * 响应拦截
   * @param {*} instance axios实例
   */
  _responseInterceptors(instance) {
    instance.interceptors.response.use(
      (res) => {
        const code = res.data.code;
        const status = res.status;
        const message = res.data.msg;
        if (status === 401) {
          store.dispatch("userLogout").then(() => {
            // TODO 拦截401错误，重定向登录页面
          });
        }
        if (code && code !== 0 && res.config.method.toLowerCase() !== "get") {
          uni.showToast({
            title: message || "未知错误",
            icon: "none",
          });
          return Promise.reject(new Error(message));
        }
        if (code == 0 && res.config.method.toLowerCase() !== "get") {
          uni.showToast({
            title: message || "操作成功",
            icon: "success",
          });
        }
        return res.data;
      },
      (error) => {
        return Promise.reject(new Error(error));
      }
    );
  }
}

export default new HttpRequest().request();
