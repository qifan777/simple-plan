import requestWithToken from "@/uitls/request"

export const updateUser=(data:any)=>{
    return requestWithToken('/user/update','POST',data)
}
export const getUserInfo=()=>{
    return requestWithToken("/user/info", "GET", null)
}