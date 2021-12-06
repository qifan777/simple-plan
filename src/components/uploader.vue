<template>
  <div class="uploader">
    <div class="right">
      <div class="file" v-for="(file, index) in files" :key="index">
        <image
          class="enclosure"
          mode="widthFix"
          src="@/static/icons/enclosure.png"
        >
        </image>
        <div class="filename" @click="downLoadFile(file)">{{ file.name }}</div>
        <image
          class="close"
          src="@/static/icons/close.png"
          mode="widthFix"
          @click="removeFile(index)"
        ></image>
        <div class="loading" v-if="file.status == 'uploading'"></div>
        <image
          v-else-if="file.status == 'finish'"
          class="finish"
          src="@/static/icons/finish.png"
          mode="widthFix"
        ></image>
      </div>
      <image
        @click="chooseFile"
        class="choose"
        mode="widthFix"
        src="@/static/icons/upload.png"
      ></image>
      <button class="btn" @click="upload">开始上传</button>
    </div>
  </div>
</template>
<script lang="ts">
import { uploadFile } from "@/api/common";
import { myFile } from "@/typings";
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      files: [] as myFile[],
    };
  },
  methods: {
    chooseFile() {
      // #ifdef MP-WEIXIN
      wx.chooseMessageFile({
        count: 10,
        success: (result) => {
          let tempFiles = result.tempFiles;
          tempFiles.forEach((file) => {
            this.files.push({
              name: file.name,
              path: file.path,
              status: "ready",
            });
          });
        },
      });
      // #endif
      //#ifdef H5
      uni.chooseFile({
        success: (result) => {
          let tempFiles = result.tempFiles as (File & {
            path: string;
          })[];
          tempFiles.forEach((file) => {
            this.files.push({
              name: file.name,
              path: file.path,
              status: "ready",
            });
          });
        },
      });
      //#endif
      //#ifdef APP-PLUS
      const plugin = uni.requireNativePlugin("GuoWei-SelectFileModule") as any;
      plugin.chooseFile(
        {
          count: 10,
          rootDirName: "根目录",
          themeColor: "#00ff00",
          folderIconColor: "#ff0000",
          fileIconColor: "#0000ff",
        },
        (result: any) => {
          let tempFiles = result.files;
          console.log(tempFiles);
          tempFiles.forEach((file: any) => {
            this.files.push({
              name: file.name,
              path: file.url,
              status: "ready",
            });
          });
        }
      );
      //#endif
    },
    async upload() {
      let unUploadFiles = this.files.filter(
        (value) => !value.path.startsWith("http")
      );

      for (let index = 0; index < unUploadFiles.length; index++) {
        let file = unUploadFiles[index];
        file.status = "uploading";
        let res: any = await uploadFile(file.path);
        file.status = "finish";
        file.path = res.data.url;
      }
    },
    removeFile(index: number) {
      this.files.splice(index, 1);
    },
    getUploadFiles() {
      return this.files.filter((value) => value.path.startsWith("http"));
    },
    setFiles(filesArr: myFile[]) {
      this.files = filesArr;
    },
    downLoadFile(file: myFile) {
      let image = ["bmp", "jpg", "jpeg", "png", "gif"];
      let document = ["doc", "xls", "ppt", "pdf", "docx", "xlsx", "pptx"];
      let postFix = file.name.split(".").pop() as string;
      postFix = postFix.toLowerCase();
      if (image.includes(postFix)) {
        uni.previewImage({ urls: [file.path] });
      } else if (document.includes(postFix)) {
        uni.downloadFile({
          url: file.path,
          success: (res) => {
            uni.openDocument({ filePath: res.tempFilePath });
          },
        });
      } else {
        uni.downloadFile({
          url: file.path,
          success: (res) => {
            uni.saveFile({
              tempFilePath: res.tempFilePath,
              success: (res) => {
                uni.showModal({
                  title: "文件已保存到",
                  content: res.savedFilePath,
                });
              },
            });
          },
        });
      }
    },
  },
});
</script>
<style lang="scss" scoped>
@keyframes spin {
  100% {
    transform: rotate(-360deg);
  }
}

.uploader {
  .file {
    display: flex;
    align-items: center;

    .enclosure {
      width: 60rpx;
    }

    .filename {
      margin-left: 15rpx;
      color: blue;
      font-size: 20rpx;
      text-decoration: underline;
      word-wrap: break-all;
      width: 250rpx;
    }

    .finish {
      margin-left: 100rpx;

      width: 50rpx;
    }

    .close {
      margin-left: 20rpx;
      width: 40rpx;
    }
  }

  .choose {
    width: 90rpx;
  }

  .btn {
    margin: 0;
    margin-top: 10rpx;
    width: 160rpx;
    height: 40rpx;
    font-size: 20rpx;
    line-height: 40rpx;
  }
}

.loading {
  width: 16rpx;
  height: 16rpx;
  border-radius: 50%;
  margin-left: 100rpx;
  box-shadow: 0 -26rpx rgb(210, 245, 209),
    19.5rpx -19.5rpx rgba(210, 245, 209, 0.875),
    26rpx 0 rgba(210, 245, 209, 0.75),
    19.5rpx 19.5rpx rgba(210, 245, 209, 0.625), 0 26rpx rgba(210, 245, 209, 0.5),
    -19.5rpx 19.5rpx rgba(210, 245, 209, 0.375),
    -26rpx 0 rgba(210, 245, 209, 0.25),
    -19.5rpx -19.5rpx rgba(210, 245, 209, 0.125);
  animation: spin 1.2s linear infinite;
}
</style>
