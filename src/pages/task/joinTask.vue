<template>
  <div class="list">
    <div class="title">加入任务</div>
    <uni-forms ref="form" :modelValue="from" :rules="rules">
      <uni-forms-item label="分享码" name="key">
        <uni-easyinput
          type="text"
          v-model="from.key"
          class="input"
          placeholder="请输入分享码"
        />
      </uni-forms-item>
      <button plain="true" class="submit" @click="submit">提交</button>
    </uni-forms>
  </div>
</template>
<script lang="ts">
import { joinTask } from "@/api/tasks";
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      rules: {
        key: {
          rules: [{ required: true, errorMessage: "请输入分享码" }],
        },
      },
      from: { key: "" },
    };
  },
  methods: {
    async submit() {
      let form = this.$refs.form as any;
      let res = (await form.validate()) as any[];
      joinTask(this.from).then((res) => {
        if (res.data == true) {
          uni.showToast({ title: "加入成功" });
          this.$emit("hide", false);
        }
      });
    },
  },
});
</script>
<style lang="scss" scoped>
.list {
  border-radius: 15rpx;
  margin: 0 20rpx;
  padding: 20rpx;
  background-color: white;
  overflow: hidden;
  .input {
    width: 400rpx;
  }
  .title {
    width: 100%;
    text-align: center;
    color: $uni-text-color-placeholder;
    padding: 20rpx;
    margin-bottom: 30rpx;
  }
  .row {
    overflow: hidden;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    // padding: 20rpx;
    font-size: 30rpx;
    border-bottom: 1rpx solid rgba(143, 142, 142, 0.089);
  }
  .submit {
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    margin-top: 50rpx;
    margin-bottom: 30rpx;
    border: 0;
    color: white;
    box-shadow: 10rpx 10rpx 15rpx rgb(245, 245, 245);
    background-color: rgb(0, 170, 255);
  }
}
</style>
