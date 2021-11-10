<template>
  <view class="login-wrapper">
    <view class="left-bottom-sign"></view>
    <view class="right-top-sign"></view>
    <view class="left-top-sign">RGISTER</view>
    <view class="login-form">
      <view class="tip">注册</view>
      <input
        class="input"
        v-model="userName"
        placeholder="请输入账号"
        type="text"
      />
      <input
        class="input"
        v-model="password"
        placeholder="请输入密码"
        password="true"
      />
      <view class="reset" @click="switchPage('/pages/login/login')">去登录</view>
      <button class="submit" @click="submit">注册</button>
    </view>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { register } from "@/api/auth";
export default Vue.extend({
  data() {
    return {
      password: "",
      userName: "",
    };
  },
  methods: {
    submit() {
      register({ userName: this.userName, password: this.password }).then(
        (res) => {
          let { data } = res;
          uni.setStorageSync("token", data.tokenValue);
          uni.setStorageSync("tokenName", data.tokenName);
          uni.navigateTo({ url: "/pages/index/index" });
        }
      );
    },
    switchPage(value: string) {
      uni.navigateTo({ url: value });
    },
  },
});
</script>
<style lang="scss" scoped>
page {
  background-color: white;
  background: linear-gradient(to bottom, #f07f85 0%, #fae1e2 100%);
  height: 100vh;
}
.login-wrapper {
  position: relative;
  height: 100vh;
  overflow: hidden;
  .login-form {
    position: relative;
    margin: 20rpx;
    padding: 30rpx;
    top: 20vh;
    background-color: white;
    border-radius: 20rpx;
    .tip {
      color: #f07f85;
      font-size: 40rpx;
    }
    .reset {
      margin-top: 20rpx;
      position: relative;
      text-align: right;
      color: rgba(185, 185, 185, 0.699);
    }
    .input {
      margin: 0 auto;
      margin-top: 20rpx;
      height: 70rpx;
      width: 400rpx;
      padding: 0 30rpx;
      border-radius: 35rpx;
      background: rgba(233, 233, 233, 0.774);
    }
    .submit {
      margin-top: 30rpx;
      width: 400rpx;
      height: 70rpx;
      line-height: 70rpx;
      border-radius: 35rpx;
      border: 0;
      color: white;
      background: linear-gradient(to right, #f07f85 0%, #fae1e2 100%);
    }
  }
}
.left-top-sign {
  top: 40vw;
  font-size: 17.5vw;
  color: #f8f8f8;
  position: relative;
  left: -4px;
}
.right-top-sign {
  position: absolute;
  top: 20.3125vw;
  right: -15px;
  &:before,
  &:after {
    display: block;
    content: "";
    width: 62.5vw;
    height: 12.5vw;
    background: #f07f85;
  }
  &:before {
    transform: rotate(45deg);
  }

  &:after {
    position: absolute;
    right: -35.25vw;
    top: 0;
    transform: rotate(-45deg);
  }
}
.left-bottom-sign {
  position: absolute;
  left: -100px;
  bottom: -70px;
  border: 40px solid #fafcf4;
  border-radius: 50%;
  padding: 70px;
}
</style>
