<template>
  <view>
    <view class="user-row">
      <userRow>
        <template v-slot:left> 头像 </template>
        <template v-slot:right>
          <image
            :src="tempInfo.avatar"
            class="portrait"
            @click="uploadPortrait"
            v-if="tempInfo.avatar"
          ></image>
          <image
            src="../../static/icons/user.png"
            class="portrait"
            @click="uploadPortrait"
            v-else
          ></image>
        </template>
      </userRow>
    </view>
    <!-- <view class="user-row">
      <userRow>
        <template v-slot:left> 手机号 </template>
        <template v-slot:right>
          <button
            class="getPhone"
            plain
            open-type="getPhoneNumber"
            @getphonenumber="getPhone"
          >
            {{ tempInfo.phoneNumber ? tempInfo.phoneNumber : "点击获取" }}
          </button>
        </template>
      </userRow>
    </view> -->
    <view @click="openPopup('popup2')" class="user-row">
      <userRow>
        <template v-slot:left> 昵称 </template>
        <template v-slot:right>
          {{ tempInfo.nickName }}
        </template>
      </userRow>
    </view>
    <view @click="openPopup('popup1')" class="user-row">
      <userRow>
        <template v-slot:left> 性别 </template>
        <template v-slot:right>
          {{ tempInfo.gender }}
        </template>
      </userRow>
    </view>
    <view @click="switchPage('/pages/feedback/feedback')" class="user-row">
      <userRow>
        <template v-slot:left> 反馈 </template>
        <template v-slot:right> 点击反馈 </template>
      </userRow>
    </view>
    <uni-popup ref="popup1" type="dialog">
      <uni-popup-dialog
        title="性别选择"
        @close="closeDilaog"
        @confirm="saveChange"
      >
        <view class="gender-choose">
          <view
            :class="{ maleActive: tempInfo.gender == '男' }"
            @click="changeGender('男')"
            >男</view
          >
          <view
            :class="{ femaleActice: tempInfo.gender == '女' }"
            @click="changeGender('女')"
            >女</view
          >
          <view
            :class="{ privacyActive: tempInfo.gender == '保密' }"
            @click="changeGender('保密')"
            >保密</view
          >
        </view>
      </uni-popup-dialog>
    </uni-popup>
    <uni-popup ref="popup2" type="dialog">
      <uni-popup-dialog
        title="修改昵称"
        @close="closeDilaog"
        @confirm="saveChange"
      >
        <view class="modify-nickname">
          <input
            v-model="tempInfo.nickName"
            maxlength="10"
            placeholder="请输入新昵称"
          />
        </view>
      </uni-popup-dialog>
    </uni-popup>
    <!-- #ifdef H5 || APP-PLUS  -->
    <button plain="true" class="logout" @click="logout">退出登录</button>
    <!-- #endif -->
  </view>
</template>

<script lang="ts">
import userRow from "../../components/user/edit-row.vue";
import { mapState } from "vuex";
import { User } from "@/typings";
import Vue from "vue";
import { getUserInfo, updateUser } from "@/api/user";
import { uploadFile } from "@/api/common";
import { getWechatPhone } from "@/api/wechat";
export default Vue.extend({
  //知识点组件,slot
  components: {
    userRow,
  },
  //计算属性,对数据进行统一操作
  computed: {
    //等价 userInfo:()=>{return this.$store.state.userInfo}
    ...mapState(["userInfo"]),
  },
  data() {
    return {
      tempInfo: {} as User,
    };
  },
  methods: {
    switchPage(value: string) {
      uni.navigateTo({ url: value });
    },
    initUserInfo() {
      uni.getUserProfile({
        desc: "用户完善资料",
        success: (res) => {
          const uf = res.userInfo as any;
          console.log(res.userInfo);

          let genderMap = { 0: "男", 1: "女", 2: "保密" };
          this.tempInfo.gender = genderMap[uf.gender];
          this.tempInfo.nickName = uf.nickName;
          this.tempInfo.avatar = uf.avatarUrl;
          this.saveChange();
        },
      });
    },
    getPhone(info: any) {
      let wxAuth = {
        encryptedData: info.detail.encryptedData,
        iv: info.detail.iv,
      };
      getWechatPhone(wxAuth).then((res) => {
        this.tempInfo.phoneNumber = res.data.phoneNumber;
        this.saveChange();
      });
    },
    onLoad() {
      //之所以要延迟是因为,onLoad开始执行的时候,userInfo还没加载进来。
      setTimeout(() => {
        //深拷贝一份tempInfo
        this.tempInfo = JSON.parse(JSON.stringify(this.userInfo)) as User;
        // #ifdef MP-WEIXIN
        if (!this.tempInfo.avatar) {
          uni.showModal({
            title: "完善信息",
            content: "是否同意获取您微信头像和昵称？",
            success: (res) => {
              if (res.confirm) {
                this.initUserInfo();
              }
            },
          });
        }
        // #endif
      }, 400);
    },
    logout() {
      uni.removeStorage({
        key: "token",
        success: () => {
          uni.navigateTo({
            url: "../login/login",
          });
        },
      });
    },
    //点击空白处,放弃更改
    closeDilaog() {
      this.closePopup("popup1");
      this.closePopup("popup2");
      //tempInfo复原
      this.tempInfo = JSON.parse(JSON.stringify(this.userInfo));
    },
    changeGender(active: string) {
      this.tempInfo.gender = active;
    },
    uploadPortrait() {
      //选择图片
      uni.chooseImage({
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        count: 1,
        success: (res) => {
          //将选择的图片返回给success,res代表选择的图片
          uploadFile(res.tempFilePaths[0]).then((res: any) => {
            this.tempInfo.avatar = res.data.url;
            this.saveChange();
          });
        },
      });
    },
    //点击确认,保存
    saveChange() {
      //关闭modal
      this.closePopup("popup1");
      this.closePopup("popup2");
      updateUser(this.tempInfo).then((res) => {
        if (res.data == true) {
          //将更改后的信息给userInfo
          this.$store.commit("updateUserInfo", this.tempInfo);
          uni.showToast({
            title: "更新成功",
          });
        }
      });
    },
    openPopup(name: string) {
      let popup = this.$refs[name] as any;
      popup.open();
    },
    closePopup(name: string) {
      let popup = this.$refs[name] as any;
      popup.close();
    },
  },
});
</script>

<style lang="scss">
//modal关键帧
@keyframes showModal {
  0% {
    transform: scale(2);
  }

  25% {
    transform: scale(1.7);
  }

  50% {
    transform: scale(1.4);
  }

  75% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.modal {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: grey;
  opacity: 0;
  //一定要设置成负数，要不然覆盖在别的元素上,虽然它是透明的。
  z-index: -1;

  // &.代表和modal并列,当
  &.show-modal {
    animation: showModal 0.1s linear;
    z-index: 10;
    opacity: 0.7;
  }

  .center {
    display: flex;
    flex-direction: column;
    background-color: white;
    width: 60vw;

    .title {
      text-align: center;
      border-bottom: 2rpx solid #e2e2e2;
      padding: 20rpx 0;
    }

    .footer {
      display: flex;
      justify-content: center;
      padding: 20rpx;
    }
  }
}

//modal里面只是中间的不一样,所以把中间部分抽取出来
.gender-choose {
  display: flex;
  justify-content: space-around;
  border-bottom: 2rpx solid #e2e2e2;
  padding: 30rpx 0;
  align-items: center;

  view {
    width: 80rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    border-radius: 50%;
    transition: background-color 0.5s;
  }

  .maleActive {
    background-color: #2775b6;
  }

  .femaleActice {
    background-color: #f1939c;
  }

  .privacyActive {
    background-color: #ababab;
  }
}

.modify-nickname {
  input {
    padding: 10rpx;
    margin: 20rpx;
    border-radius: 10rpx;
    box-shadow: 0px 1px 2px #d6d6d6;
  }
}

.portrait {
  width: 100upx;
  height: 100upx;
  border-radius: 20upx;
}
.logout {
  width: 300rpx;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  margin-top: 50rpx;
  margin-bottom: 30rpx;
  border: 0;
  color: black;
  box-shadow: 10rpx 10rpx 15rpx rgb(245, 245, 245);
  background: linear-gradient(to right, #fafafa 0%, #cccccc 100%);
}
.getPhone {
  border: 0 !important;
  padding: 0;
}
</style>
