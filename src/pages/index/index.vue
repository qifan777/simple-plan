<template>
  <div>
    <view class="user-head">
      <image
        class="background"
        mode="widthFix"
        src="@/static/img/background.jpg"
      ></image>
      <view class="user-wrapper">
        <view class="user-section">
          <view class="user-info" @click="switchPage('/pages/user/user-edit')">
            <view class="username">
              <text class="name" v-if="userInfo.nickName">{{
                "Hello," + userInfo.nickName
              }}</text>
              <text class="name2" v-else>您还未登录,点击登录</text>
              <text class="tip">我的信息</text>
            </view>
            <image
              mode="widthFix"
              :src="userInfo.avatar"
              v-if="userInfo.avatar"
            ></image>
            <image mode="widthFix" src="@/static/icons/user.png" v-else></image>
          </view>
        </view>
      </view>
    </view>
    <view class="divider">
      <view class="front">我的看板</view>
    </view>
    <div class="list-section" v-if="show">
      <div class="left-lists lists">
        <div v-for="(list, index) in lists">
          <div class="list" v-if="index % 2 == 0">
            <div class="top">
              <div class="title">
                {{ list.title }}
              </div>
              <div class="btns">
                <image
                  :class="['icon', { activeIcon: index == activeMenu }]"
                  mode="widthFix"
                  src="../../static/icons/more.png"
                  @click="showMenu(index)"
                ></image>
                <div class="tips" v-show="activeMenu == index">
                  <ul>
                    <li
                      @click="
                        switchPage(`/pages/task/addTask?listId=${list.listId}`)
                      "
                    >
                      添加任务
                    </li>
                    <li>编辑列表</li>
                    <li @click="deleteList(list.listId)">删除列表</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="task-wrapper" v-for="(task, index2) in list.tasks">
              <div class="task" v-if="task.title">
                <checkbox-group @change="checkTask(task)">
                  <checkbox
                    value="0"
                    :checked="task.checked"
                    color="#FFCC33"
                    style="transform: scale(0.7)"
                  />
                </checkbox-group>
                <div :class="['title', { checkedTask: task.checked }]">
                  {{ task.title }}
                </div>
                <div class="detail">
                  <image
                    @click="switchPage('/pages/task/task?id=' + task.taskId)"
                    class="icon"
                    mode="widthFix"
                    src="../../static/icons/arrow-right.png"
                  ></image>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-lists lists">
        <div v-for="(list, index) in lists">
          <div class="list" v-if="index % 2 != 0">
            <div class="top">
              <div class="title">
                {{ list.title }}
              </div>
              <div class="btns">
                <image
                  :class="['icon', { activeIcon: index == activeMenu }]"
                  mode="widthFix"
                  src="../../static/icons/more.png"
                  @click="showMenu(index)"
                ></image>
                <div class="tips" v-show="activeMenu == index">
                  <ul>
                    <li
                      @click="
                        switchPage(`/pages/task/addTask?listId=${list.listId}`)
                      "
                    >
                      添加任务
                    </li>
                    <li>编辑列表</li>
                    <li @click="deleteList(list.listId)">删除列表</li>
                  </ul>
                </div>
              </div>
            </div>
            <div class="task-wrapper" v-for="(task, index2) in list.tasks">
              <div class="task" v-if="task.title">
                <checkbox-group @change="checkTask(task)">
                  <checkbox
                    value="0"
                    :checked="task.checked"
                    color="#FFCC33"
                    style="transform: scale(0.7)"
                  />
                </checkbox-group>
                <div :class="['title', { checkedTask: task.checked }]">
                  {{ task.title }}
                </div>
                <div class="detail">
                  <image
                    @click="switchPage('/pages/task/task?id=' + task.listId)"
                    class="icon"
                    mode="widthFix"
                    src="../../static/icons/arrow-right.png"
                  ></image>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <view :class="[{ active: active }, 'plus']" @click="active = !active"
      >+</view
    >
    <view :class="[{ active: active }, 'plus1']" @click="openPopup('popup')">
      <image mode="widthFix" src="../../static/icons/write.png"></image>
    </view>
    <view :class="[{ active: active }, 'plus2']">
      <image
        mode="widthFix"
        src="../../static/icons/share.png"
        @click="openPopup('popup2')"
      ></image>
    </view>
    <uni-popup ref="popup" type="dialog">
      <addList @hide="closePopup('popup2')"></addList
    ></uni-popup>
    <uni-popup ref="popup2" type="dialog">
      <joinTask @hide="closePopup('popup2')"></joinTask>
    </uni-popup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { List, ListTask, Task, User } from "@/typings/index";
import addList from "../list/addList.vue";
import { updateTask } from "@/api/tasks";
import { deleteLists, listLists } from "@/api/lists";
import joinTask from "../task/joinTask.vue";
export default Vue.extend({
  data() {
    return {
      lists: [] as List[],
      show: true,
      activeMenu: -1,
      searchVO: {
        pageNum: 1,
      },
      finish: false,
      active: false,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo as User;
    },
  },
  components: { addList, joinTask },
  onLoad() {
    uni.getStorage({
      key: "token",
      success: (res) => {
        console.log(res);
        this.$store.dispatch("getUserInfo");
        this.getList(true);
      },
    });
  },
  methods: {
    getList(init = false) {
      if (init) {
        this.activeMenu = -1;
        this.searchVO = { pageNum: 1 };
      }
      listLists(this.searchVO).then((res) => {
        if (init) {
          this.lists = [];
        }
        if (res.data.size > res.data.records.length) {
          this.finish = true;
        }
        this.lists.push(...res.data.records);
        this.searchVO.pageNum++;
      });
    },
    showMenu(index: number) {
      if (index == this.activeMenu) {
        this.activeMenu = -1;
      } else {
        this.activeMenu = index;
      }
    },
    switchPage(value: string) {
      uni.navigateTo({ url: value });
    },
    openPopup(name: string) {
      let popup = this.$refs[name] as any;
      popup.open();
    },
    closePopup(name: string) {
      let popup = this.$refs[name] as any;
      popup.close();
      this.getList(true);
    },
    checkTask(task: Task) {
      task.checked = !task.checked;
      updateTask(task).then((res) => {
        console.log(res);
      });
      console.log(task);
    },
    deleteList(id: number) {
      uni.showModal({
        title: "是否确认删除该任务清单?",
        success: (res) => {
          if (res.confirm) {
            deleteLists([id]).then((res) => {
              if (res.data == true) {
                this.getList(true);
              }
            });
          }
        },
      });
    },
  },
  onReachBottom() {
    if (!this.finish) {
      this.getList();
    }
  },
});
</script>

<style lang="scss" scoped>
page {
  background-color: $uni-bg-color-grey;
}
@keyframes mymove {
  0% {
    transform: scale(1);
  }
  25% {
    transform: scale(0.8);
  }
  50% {
    transform: scale(1.1);
  }

  75% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes scaleMenu {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
}

.divider {
  margin-top: 90upx;
  display: flex;
  padding: 40rpx 0 10rpx 40rpx;
  align-items: flex-end;

  .front {
    font-size: 35rpx;
    font-weight: bold;
    margin-right: 10rpx;
  }

  .rear {
    font-size: 25rpx;
    color: #c3c3c3;
  }
}
.user-head {
  position: relative;

  .background {
    position: relative;
    max-width: 100%;
    max-height: 500.35upx;
    width: 100%;
  }

  .user-wrapper {
    position: absolute;
    width: 100%;
    display: flex;
    justify-content: center;
    bottom: -120rpx;

    .user-section {
      box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
      position: relative;
      width: 100%;
      height: 210rpx;
      background-color: white;
      float: right;
      margin: 20upx 40upx;
      padding: 20upx;
      border-radius: 10upx;

      .user-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        image {
          width: 140.67rpx;
          height: 140.67rpx;
          border-radius: 50%;
          margin-right: 50rpx;
          box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
        }

        .username {
          margin-left: 20rpx;
          display: flex;
          flex-direction: column;

          .name {
            font-weight: bold;
            font-size: 45rpx;
            margin-right: 20rpx;
            margin-bottom: 30rpx;
          }

          .name2 {
            font-weight: bold;
            font-size: 35rpx;
            margin-right: 20rpx;
            margin-bottom: 30rpx;
          }

          .tip {
            color: #dfdfdf;
            font-size: 27rpx;
          }
        }
      }
    }
  }
}
.list-section {
  margin: 20rpx;
  display: flex;
  justify-content: space-around;

  .top {
    display: flex;
    .title {
      font-size: 30rpx;
    }
    .btns {
      position: relative;
      flex: 2;
      display: flex;
      justify-content: flex-end;
      .icon {
        transition: transform 0.2s;
        width: 40rpx;
      }
      .activeIcon {
        transform: rotate(90deg);
      }
      .tips {
        z-index: 2;
        animation: scaleMenu 0.2s ease-out alternate;
        ul {
          padding-inline: 0;
          li {
            margin-top: 10rpx;
          }
        }
        width: 100rpx;
        border-radius: 15rpx;
        padding: 20rpx 20rpx 20rpx 40rpx;
        background-color: white;
        box-shadow: 10rpx 10rpx 20rpx whitesmoke;
        position: absolute;
        font-size: 20rpx;
        right: 40rpx;
      }
    }
  }
  .lists {
    flex: 1;
  }
  .left-lists {
    margin-right: 10rpx;
  }
  .right-lists {
    margin-left: 10rpx;
  }
  .list {
    // width: 300rpx;
    padding: 15rpx;
    background-color: white;
    border-radius: 15rpx;
    margin-top: 20rpx;
    .task {
      margin-top: 20rpx;
      padding: 10rpx;
      margin-right: 20rpx;
      background-color: rgba(245, 245, 245, 0.549);
      border-radius: 10rpx;
      display: flex;
      align-items: center;

      .checkedTask {
        text-decoration: line-through;
      }
      .title {
        font-size: 25rpx;
        margin-right: 15rpx;
        color: $uni-text-color-grey;
      }
      .detail {
        flex: 2;
        display: flex;
        justify-content: flex-end;
        .icon {
          opacity: 0.5;
          width: 30rpx;
        }
      }
    }
  }
}
@mixin base($color) {
  position: fixed;
  bottom: 300rpx;
  right: 60rpx;
  border-radius: 50%;
  background-color: $color;
  width: 100rpx;
  height: 100rpx;
  line-height: 90rpx;
  text-align: center;
  font-size: 90rpx;
  color: white;
  border: rgb(255, 167, 3) 1px solid;
  box-shadow: 10rpx 10rpx 15rpx rgba(245, 222, 179, 0.725);
  transition: transform 0.3s ease-in;
}
.plus {
  @include base(wheat);
  &.active {
    z-index: 1;
    animation: mymove 0.5s ease-in-out;
  }
}
.plus1 {
  @include base(white);
  image {
    width: 70rpx;
    height: 70rpx;
  }
  z-index: -9;
  &.active {
    z-index: 1;
    transform: translate(-75rpx, -129rpx) scale(0.8);
  }
}
.plus2 {
  @include base(white);
  image {
    width: 70rpx;
    height: 70rpx;
  }
  z-index: -9;
  &.active {
    z-index: 1;
    transform: translate(-150rpx, 0rpx) scale(0.8);
  }
}
</style>
