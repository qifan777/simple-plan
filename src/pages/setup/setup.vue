<template>
  <div class="start">
    <div class="box">
      <image src="@/static/img/setup.png" mode="aspectFill"></image>
    </div>
  </div>
</template>
<script lang="ts">
import { wechatLogin } from "@/api/auth";
import Vue from "vue";

export default Vue.extend({
  components: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  onLoad(options) {
    let token = uni.getStorageSync("token");
    if (!token) {
      wechatLogin();
    } else {
      setTimeout(() => {
        uni.reLaunch({
          url: "/pages/index/index",
        });
      },1500);
    }
    console.log("onLoad监听页面加载");
  },
  onReady() {
    console.log("onReady监听页面初次渲染完成");
  },
  onShow() {
    console.log("onShow监听页面显示");
  },
  onHide() {
    console.log("onHide监听页面隐藏");
  },
  onUnload() {
    console.log("onUnload监听页面卸载");
  },
});
</script>
<style scoped lang="scss">
.start {
  width: 100%;
  height: 100vh;
  // position: relative;

  .box {
    width: 100%;
    height: 100vh;

    image {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
