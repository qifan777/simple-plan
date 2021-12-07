// const baseUrl =process.env.VUE_APP_BASE_URL
const baseUrl = "http://localhost/plan";
console.log(baseUrl);
import store from "@/store";
import { wechatLogin } from "@/api/auth";
const requestWithToken = (
  url: string,
  method:
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT",
  data: any
): Promise<any> => {
  let promise = new Promise((resolve, reject) => {
    let toekn = uni.getStorageSync("token");
    let requestOptions = {
      url: baseUrl + url,
      method: method,
      data: data,
      header: {
        jctoken: "",
      },
      dataType: "json",
      success: (res: any) => {
        if (res.data.code == 500) {
          uni.showToast({
            title: res.data.msg,
            icon: "none",
          });
        }
        if (res.data.code === 401 || res.data.code === 403) {
          // #ifdef H5 || APP-PLUS
          uni.navigateTo({ url: "/pages/login/login" });
          // #endif
          // #ifdef MP-WEIXIN
          wechatLogin();
          // #endif
          // store.commit('setLoginShow', true)
        } else {
          resolve(res.data);
        }
      },
      fail: (res: any) => {
        reject(res);
      },
    };
    if (toekn) {
      requestOptions.header.jctoken = toekn;
    }
    uni.request(requestOptions);
  });
  return promise;
};
export default requestWithToken;
