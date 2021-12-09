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
              <text
                class="name2"
                v-else
                @click.stop="switchPage('/pages/login/login')"
                >您还未登录,点击登录</text
              >
              <text class="tip">我的信息</text>
            </view>
            <image
              mode="aspectFill"
              :src="userInfo.avatar"
              v-if="userInfo.avatar"
            ></image>
            <image
              mode="aspectFill"
              src="@/static/icons/user.png"
              v-else
            ></image>
          </view>
        </view>
      </view>
    </view>
    <view class="divider">
      <view class="front">我的清单</view>
    </view>
    <div class="list-section" v-if="show">
      <div class="left-lists lists">
        <div v-for="(list, index) in lists" :key="index">
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
                  v-if="list.listId > 0"
                >
                </image>
                <div
                  class="tips"
                  v-show="activeMenu == index"
                  v-if="list.listId > 0"
                >
                  <ul>
                    <li
                      @click="
                        switchPage(`/pages/task/addTask?listId=${list.listId}`)
                      "
                    >
                      添加任务
                    </li>
                    <li @click="updateList(list)">编辑列表</li>
                    <li @click="deleteList(list.listId)">删除列表</li>
                  </ul>
                </div>
              </div>
            </div>
            <uni-swipe-action>
              <uni-swipe-action-item
                v-for="(task, index2) in list.tasks"
                :key="index2"
                :right-options="options"
                @click="bindClick($event, task.taskId, list.listId)"
                @change="swipeChange($event, index)"
                class="task-wrapper"
              >
                <div class="task" v-if="task.title">
                  <checkbox-group @change="checkTask(task)">
                    <checkbox
                      value="0"
                      :checked="task.checked"
                      color="#FFCC33"
                      style="transform: scale(0.7)"
                    />
                  </checkbox-group>
                  <div
                    :class="[
                      'title',
                      { checkedTask: task.leftTime == 0 },
                      {
                        todoTask:
                          task.leftTime &&
                          task.leftTime < 24 &&
                          task.leftTime >= 0,
                      },
                      {
                        undoTask: task.leftTime && task.leftTime < 0,
                      },
                    ]"
                  >
                    <div>{{ task.title }}</div>
                    <div class="leftTime" v-if="task.leftTime">
                      <image src="@/static/icons/leftTime.png"></image>
                      <span
                        :class="['time', { undoTask: task.leftTime < 0 }]"
                        >{{ moment(task.deadline).from(moment(), false) }}</span
                      >
                    </div>
                  </div>
                </div>
              </uni-swipe-action-item>
            </uni-swipe-action>
          </div>
        </div>
      </div>
      <div class="right-lists lists">
        <div v-for="(list, index) in lists" :key="index">
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
                  v-if="list.listId > 0"
                >
                </image>
                <div class="tips" v-show="activeMenu == index">
                  <ul>
                    <li
                      @click="
                        switchPage(`/pages/task/addTask?listId=${list.listId}`)
                      "
                    >
                      添加任务
                    </li>
                    <li @click="updateList(list)">编辑列表</li>
                    <li @click="deleteList(list.listId)">删除列表</li>
                  </ul>
                </div>
              </div>
            </div>
            <uni-swipe-action>
              <uni-swipe-action-item
                v-for="(task, index2) in list.tasks"
                :key="index2"
                :right-options="options"
                @click="bindClick($event, task.taskId, list.listId)"
                @change="swipeChange($event, index)"
                class="task-wrapper"
              >
                <div class="task" v-if="task.title">
                  <checkbox-group @change="checkTask(task)">
                    <checkbox
                      value="0"
                      :checked="task.checked"
                      color="#FFCC33"
                      style="transform: scale(0.7)"
                    />
                  </checkbox-group>
                  <div
                    :class="[
                      'title',
                      { checkedTask: task.leftTime == 0 },
                      {
                        todoTask:
                          task.leftTime &&
                          task.leftTime < 24 &&
                          task.leftTime >= 0,
                      },
                      {
                        undoTask: task.leftTime && task.leftTime < 0,
                      },
                    ]"
                  >
                    <div>{{ task.title }}</div>
                    <div class="leftTime" v-if="task.leftTime">
                      <image src="@/static/icons/leftTime.png"></image>
                      <span
                        :class="['time', { undoTask: task.leftTime < 0 }]"
                        >{{ moment(task.deadline).from(moment(), false) }}</span
                      >
                    </div>
                  </div>
                </div>
              </uni-swipe-action-item>
            </uni-swipe-action>
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
      <addList @hide="closePopup('popup')"></addList>
    </uni-popup>
    <uni-popup ref="popup2" type="dialog">
      <joinTask @hide="closePopup('popup2')"></joinTask>
    </uni-popup>
    <uni-popup ref="popup3" type="dialog">
      <updateListVue :list="list" @hide="closePopup('popup3')"></updateListVue>
    </uni-popup>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { List, Task, User } from "@/typings/index";
import addList from "../list/addList.vue";
import { deleteRelation, sharedTasks, updateTask } from "@/api/tasks";
import { deleteLists, listLists } from "@/api/lists";
import joinTask from "../task/joinTask.vue";
import updateListVue from "../list/updateList.vue";
import moment, { Moment } from "moment";
export default Vue.extend({
  data() {
    return {
      lists: [
        {
          listId: 0,
          title: "分配给我的",
          tasks: [] as Task[],
        },
      ] as List[],
      list: {} as List,
      show: true,
      activeMenu: -1,
      searchVO: {
        pageNum: 1,
      },
      finish: false,
      active: false,
      options: [
        {
          text: "删除",
          style: {
            marinTop: "10rpx",
            backgroundColor: "#007aff",
          },
        },
        {
          text: "详情",
          style: {
            marinTop: "10rpx",
            backgroundColor: "#dd524d",
          },
        },
      ],
      moment: moment,
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo as User;
    },
  },
  components: {
    addList,
    joinTask,
    updateListVue,
  },
  onLoad() {
    moment.locale("zh-cn");
    uni.getStorage({
      key: "token",
      success: (res) => {
        this.$store.dispatch("getUserInfo");
        this.loadShareTask();
      },
    });
  },
  onShow() {
    uni.getStorage({
      key: "token",
      success: (res) => {
        this.getList(true);
      },
    });
  },
  methods: {
    bindClick(e: any, taskId: number, listId: number) {
      if (e.content.text == "删除") {
        uni.showModal({
          title: "是否确认删除该任务?",
          success: (res) => {
            if (res.confirm) {
              deleteRelation({
                taskId,
                listId,
              }).then((res) => {
                if (res.data == true) {
                  this.getList(true);
                  this.loadShareTask();
                }
              });
            }
          },
        });
      } else {
        this.switchPage("/pages/task/task?id=" + taskId);
      }
    },
    swipeChange(e: any, index: number) {},
    computeLists(datas: List[]) {
      for (const list of datas) {
        if (!list.tasks) {
          continue;
        }
        for (const task of list.tasks) {
          if (task.checked) {
            this.$set(task, "leftTime", 0);
            continue;
          }
          if (task.deadline) {
            let toNow = moment(task.deadline).diff(moment(), "hours");
            this.$set(task, "leftTime", toNow);
          }
        }
      }
    },
    getList(init = false) {
      if (init) {
        this.activeMenu = -1;
        this.searchVO = {
          pageNum: 1,
        };
      }
      listLists(this.searchVO).then((res) => {
        if (init) {
          this.lists.splice(1, this.lists.length - 1);
        }
        let datas = res.data.records as List[];
        if (res.data.size > datas.length) {
          this.finish = true;
        }
        this.computeLists(datas);
        this.lists.push(...datas);
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
      uni.navigateTo({
        url: value,
      });
    },
    updateList(list: List) {
      this.list = list;
      this.openPopup("popup3");
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
      task.steps = [];
      updateTask(task).then((res) => {});
    },
    loadShareTask() {
      sharedTasks().then((res) => {
        this.lists[0].tasks = res.data;
        this.computeLists([this.lists[0]]);
      });
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
  onShareAppMessage() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
page {
  background-color: white;
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
  display: flex;
  padding: 40rpx 0 40rpx 40rpx;
  padding-top: 140rpx;
  align-items: flex-end;
  background-color: white;

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
  display: flex;
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
  // margin: 20rpx;
  padding: 20rpx;
  display: flex;
  justify-content: space-around;
  background-color: $uni-bg-color-grey;
  min-height: 200vh;
  border-radius: 40rpx;

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
          font-size: 25rpx;
          padding-inline: 0;

          li {
            margin-top: 20rpx;
          }
        }

        width: 110rpx;
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
    padding: 15rpx;
    background-color: white;
    border-radius: 15rpx;
    margin-top: 20rpx;
    min-height: 70rpx;
    .task {
      padding: 10rpx;
      background-color: rgba(245, 245, 245, 0.549);
      border-radius: 10rpx;
      display: flex;
      align-items: center;
      margin-top: 20rpx;
      .title {
        font-size: 25rpx;
        margin-right: 15rpx;
        flex: 1;
        color: $uni-text-color-grey;
        flex-shrink: 0;
        .leftTime {
          display: flex;
          align-items: center;
          // flex: 1;
          image {
            width: 20rpx;
            height: 20rpx;
            margin-right: 10rpx;
          }
          .time {
            font-size: 20rpx;
          }
        }
      }
      .checkedTask {
        text-decoration: line-through;
      }
      .todoTask {
        color: orange;
      }
      .undoTask {
        color: red;
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
  border: rgb(0, 170, 255) 1px solid;
  box-shadow: 10rpx 10rpx 15rpx rgba(0, 170, 255,0.1);
  transition: transform 0.3s ease-in;
}

.plus {
  @include base(rgba(0, 170, 255,0.7));

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

::v-deep .button-group--right {
  margin: 20rpx 0 0 20rpx;
  padding-left: 20rpx;
}
</style>
