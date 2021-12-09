<template>
  <view>
    <view class="main">
      <view class="feedback">
        <textarea v-model="value" placeholder="您的每一个反馈都会让简计划变得更好" maxlength="2000" />
      </view>
    </view>
    <view class="bottom">
      <button class="submit"  @click="submit">提交</button>
    </view>
  </view>
</template>

<script lang="ts">
import { saveFeedback } from "@/api/feedback";
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      value: "",
    };
  },
  methods: {
    submit() {
      saveFeedback({ content: this.value }).then((res) => {
        if (res.data == true) {
          uni.showToast({ title: "提交成功", icon: "success" });
          uni.navigateBack({})
        }
      });
    },
  },
});
</script>

<style lang="scss" scoped>
page {
  // background-color: black;
}
.submit {
  width: 600rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  border: 0;
  background-color: rgb(0, 170, 255);
  color: white;
}
.main {
  background-color: rgb(243, 243, 243) !important;
  padding: 30rpx;
}
.feedback {
  border-radius: 20rpx;
  padding: 20rpx;
  background-color: white;
  height: 83vh;
}

.bottom {
  background-color: white;
  position: fixed;
  bottom: 0;
  width: 100%;
  color: white;
  padding: 30rpx 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
