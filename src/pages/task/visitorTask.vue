<template>
  <view class="task">
    <uni-forms ref="form" :modelValue="task" :rules="rules">
      <uni-forms-item required label="标题" name="title" class="form-item">
        <uni-easyinput
          type="text"
          v-model="task.title"
          :border="false"
          placeholder="请输入任务名"
        />
      </uni-forms-item>
      <uni-forms-item label="步骤" class="form-item">
        <div class="row">
          <div class="step-wrapper">
            <div class="step" v-for="(step, index) in steps" :key="index">
              <checkbox-group>
                <checkbox
                  value="0"
                  :checked="step.checked"
                  color="#FFCC33"
                  style="transform: scale(0.7)"
                />
              </checkbox-group>
              <uni-easyinput
                type="text"
                v-model="step.content"
                placeholder="步骤描述"
              />
              <image
                class="close"
                src="@/static/icons/close.png"
                mode="widthFix"
              ></image>
            </div>
          </div>
        </div>
      </uni-forms-item>
      <uni-forms-item name="description" label="描述" class="form-item">
        <div class="row">
          <myeditor id="myEditor" ref="myEditor"></myeditor>
        </div>
      </uni-forms-item>
      <uni-forms-item label="截至日期" name="deadline">
        <div class="row">
          <uni-datetime-picker
            :border="false"
            type="date"
            disabled
            v-model="task.deadline"
          />
        </div>
      </uni-forms-item>
      <!-- #ifdef MP-WEIXIN -->
      <uni-forms-item label="提醒日期" name="remindTime">
        <div class="row">
          <uni-datetime-picker
            :border="false"
            type="datetime"
            disabled
            v-model="task.remindTime"
          />
        </div>
      </uni-forms-item>
      <!-- #endif -->
      <uni-forms-item label="附件" class="form-item">
        <uploader ref="uploader" :disable="true"></uploader>
      </uni-forms-item>
    </uni-forms>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { myFile, Step, Task } from "@/typings";
import { showTask } from "@/api/tasks";
import uploader from "@/components/uploader.vue";
import myeditor from "@/components/editor/editor.vue";
export default Vue.extend({
  components: {
    uploader,
    myeditor,
  },
  data() {
    return {
      originRemindTime: "",
      listId: -1,
      date: "选择截至日期",
      task: { title: "" } as Task,
      steps: [] as Step[],
      rules: {
        title: {
          rules: [{ required: true, errorMessage: "请填写任务标题" }],
        },
      },
    };
  },
  onShareAppMessage() {
    let title = this.task.title as string;
    let taskId = this.task.taskId as number;
    return {
      title: title,
      path: "/pages/task/visitorTask?id=" + taskId,
    };
  },
  onReady() {
    uni
      .createSelectorQuery()
      .in(this.$refs.myEditor)
      .select("#editor")
      .context((res) => {
        let ctx = res.context as UniApp.EditorContext;
        ctx.setContents({ html: this.task.description });
      })
      .exec();
  },
  onLoad(options: any) {
    showTask({ id: options.id }).then((res) => {
      let up = this.$refs.uploader as any;
      let data = res.data as Task & { steps: Step[] };
      this.steps = data.steps || [];
      if (data.remindTime) {
        this.originRemindTime = data.remindTime as string;
      }
      if (data.appendix) {
        up.setFiles(JSON.parse(data.appendix) as myFile[]);
      }
      this.task = data;
      console.log(data);
    });
  },
});
</script>
<style lang="scss" scoped>
page {
  background-color: $uni-bg-color-grey;
}
.task {
  border-radius: 15rpx;
  margin: 0 20rpx;
  padding: 20rpx;
  background-color: white;
  overflow: hidden;

  .row {
    overflow: hidden;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0;
    font-size: 30rpx;
    .desc {
      width: 500rpx;
    }
    .share-icon {
      width: 50rpx;
      margin-right: 10rpx;
    }
    .share {
      text-align: center;
    }
    .date {
      width: 400rpx;
      color: $uni-text-color-placeholder;
    }
    .time {
      width: 400rpx;
      color: $uni-text-color-placeholder;
    }
    .step-wrapper {
      .step {
        display: flex;
        align-items: center;
        margin-top: 10rpx;

        .close {
          margin-left: 20rpx;
          width: 40rpx;
        }
      }
      .next {
        display: flex;
        align-items: center;
        color: lightblue;
        .label {
          font-size: 50rpx;
          margin-right: 20rpx;
        }
      }
    }
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
::v-deep .uni-forms-item__inner {
  border-bottom: 1rpx solid rgba(143, 142, 142, 0.089);
  padding: 10rpx 0 !important;
}
</style>
