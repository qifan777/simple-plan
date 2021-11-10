import requestWithToken from "@/uitls/request"

export const login=(data:any)=>{
   return requestWithToken('/user/login','POST',data)
}
export const register=(data:any)=>{
   return requestWithToken('/user/signUp','POST',data)
}