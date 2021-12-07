export const uploadFile = (filePath: any) => {
  let promise = new Promise((resolve, reject) => {
	  console.log(filePath)
    uni.uploadFile({
      url: process.env.VUE_APP_UPLOAD_URL + '/upload/upload',
      header: {
        jctoken: uni.getStorageSync('token')
      },
      name:'name',
      filePath: filePath, 
      success: res => {
        console.log(res);
        resolve(JSON.parse(res.data))
      },
      fail: result => {
        console.log(result);
        reject(result)
      }
    })
  })
  return promise
}
export const dateFormat = function(date:Date) {
	var Y = date.getFullYear() + '-';
	var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
	var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
	var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
	var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
	var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
	return Y + M + D + h + m + s;
}