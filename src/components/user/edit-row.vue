<template>
  <view class="row">
    <view class="left">
      <slot name="left">昵称</slot>
    </view>
    <view class="right">
      <slot name="right">起凡</slot>
      <uni-icons
        class="arrow-right"
        type="arrowright"
        color="#d1d1d1"
        size="20"
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
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
  font-size: 35rpx;
  background-color: white;
  .left{
    color: rgba($color: #000000, $alpha: 0.3);
  }
  .right {
    color: black;
    display: flex;
    align-items: center;
    .arrow-right {
      margin-left: 10rpx;
    }
  }
}
</style>
