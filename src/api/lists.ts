import requestWithToken from '@/uitls/request'

export const listLists = (data: any) => {
  return requestWithToken('/list/findAll', 'GET', data)
}
export const createList = (data: any) => {
  return requestWithToken('/list/save', 'POST', data)
}
export const deleteLists=(data:any)=>{
  return requestWithToken('/list/delete?ids='+data,'GET',null)
}
export const updateList=(data:any)=>{
  return requestWithToken('/list/update','POST',data)
}
