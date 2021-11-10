import requestWithToken from "@/uitls/request";

export const taskList = (data: any) => {
  return requestWithToken("/task/findAll", "GET", data);
};
export const createTask = (data: any) => {
  return requestWithToken("/task/save", "POST", data);
};
export const updateTask = (data: any) => {
  return requestWithToken("/task/update", "POST", data);
};
export const showTask = (data: any) => {
  return requestWithToken("/task/fineOne", "GET", data);
};
export const shareTask = (data: any) => {
  return requestWithToken("/task/share", "GET", data);
};
export const joinTask = (data: any) => {
  return requestWithToken("/task/join", "GET", data);
};
