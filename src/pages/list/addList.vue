<template>
  <div class="list">
    <div class="title">添加列表</div>
    <uni-forms ref="form" :modelValue="list" :rules="rules">
      <uni-forms-item label="列表名称" name="title">
        <uni-easyinput
          type="text"
          v-model="list.title"
          class="input"
          placeholder="请输入列表名称"
        />
      </uni-forms-item>
      <button plain="true" class="submit" @click="submit">提交</button>
    </uni-forms>
  </div>
</template>
<script lang="ts">
import { createList } from "@/api/lists";
import { List } from "@/typings";
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      rules: {
        title: {
          rules: [{ required: true, errorMessage: "请填写列表名" }],
        },
      },
      list: {title:''} as List,
    };
  },
  methods: {
    async submit() {
      let form = this.$refs.form as any;
      let res = (await form.validate()) as any[];
      createList(this.list).then((res) => {
        if (res.data == true) {
          uni.showToast({ title: "添加成功" });
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
    background: linear-gradient(to right, #f0ad4e 0%, #fddcad 100%);
  }
}
</style>
