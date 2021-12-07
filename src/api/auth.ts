import requestWithToken from "@/uitls/request";

export const login = (data: any) => {
  return requestWithToken("/auth/login", "POST", data);
};
export const register = (data: any) => {
  return requestWithToken("/auth/signUp", "POST", data);
};
export const wechatLogin = function () {
   console.log("微信登陆");
   
  uni.login({
    provider: "weixin",
    success: (res) => {
      let params = {
        code: res.code,
      };
      requestWithToken("/auth/wechat/login", "GET", params).then((res2) => {
        if (res2.data.tokenValue) {
          uni.setStorage({
            key: "token",
            data: res2.data.tokenValue,
            success: () => {
              setTimeout(() => {
                uni.reLaunch({
                  url: "/pages/index/index",
                });
              }, 1500);
            },
          });
        }
      });
    },
  });
};
