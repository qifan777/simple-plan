import requestWithToken from "@/uitls/request";

export const getWechatPhone = function (data: any) {
  return requestWithToken("/wechat/phone", "GET", data);
};
