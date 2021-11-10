<template>
  <view class="row">
    <view class="left">
      <slot name="left">昵称</slot>
    </view>
    <view class="right">
      <slot name="right">初七</slot>
      <uni-icons
        class="mr-30"
        type="icon-kongxincai"
        font-family="iconfont"
        color="#007AFF"
        size="20"
      ></uni-icons>

      <!-- <uni-icons
        class="arrow-right"
        color="#d1d1d1"
        size="28"
        name="arrowright"
      ></uni-icons> -->
    </view>
  </view>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  data() {
    return {};
  },
});
</script>

<style lang="scss">
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  border-bottom: 2rpx solid #d6d6d6;
  color: #333;
  font-size: 35rpx;
  background-color: white;
  .right {
    display: flex;
    align-items: center;
    .arrow-right {
      margin-left: 10rpx;
    }
  }
}
</style>
