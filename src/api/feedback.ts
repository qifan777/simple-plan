import requestWithToken from "@/uitls/request"

export const saveFeedback=function(data:any){
    return requestWithToken('/feedback/save','POST',data)
}