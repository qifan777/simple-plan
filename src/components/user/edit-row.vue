<template>
  <view class="row">
    <view class="left">
      <slot name="left">昵称</slot>
    </view>
    <view class="right">
      <slot name="right">初七</slot>
      <uni-icons
        class="arrow-right"
        type="arrowright"
        color="#d1d1d1"
        size="28"
      ></uni-icons>
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
