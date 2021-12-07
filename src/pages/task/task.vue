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
              <checkbox-group @change="stepCheck(step)">
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
                @click="removeStep(index)"
              ></image>
            </div>
            <div class="next" @click="addStep">
              <div class="label">+</div>
              <div>下一步</div>
            </div>
          </div>
        </div>
      </uni-forms-item>
      <uni-forms-item name="description" label="描述" class="form-item">
        <div class="row">
          <myeditor id="myEditor" ref="myEditor"></myeditor>
        </div>
      </uni-forms-item>

      <uni-forms-item label="分配任务" class="form-item">
        <div class="row" @click="share(task.taskId)">
          <image
            class="share-icon"
            src="@/static/icons/share.png"
            mode="widthFix"
          ></image>
          <div class="share">分配给</div>
        </div>
      </uni-forms-item>
      <uni-forms-item label="截至日期" name="deadline">
        <div class="row">
          <uni-datetime-picker
            :border="false"
            type="datetime"
            v-model="task.deadline"
          />
        </div>
      </uni-forms-item>
      <uni-forms-item label="附件" class="form-item">
        <uploader ref="uploader"></uploader>
      </uni-forms-item>
    </uni-forms>
    <button plain="true" class="submit" @click="submit">更新</button>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { myFile, Step, Task } from "@/typings";
import { createTask, shareTask, showTask, updateTask } from "@/api/tasks";
import { dateFormat } from "@/api/common";
import uploader from "@/components/uploader.vue";
import myeditor from "@/components/editor/editor.vue";
export default Vue.extend({
  components: { uploader, myeditor },
  data() {
    return {
      date: "选择截至日期",
      time: "设置提醒时间",
      task: {} as Task,
      steps: [] as Step[],
      rules: {
        title: {
          rules: [{ required: true, errorMessage: "请填写任务标题" }],
        },
      },
      myEditor: {} as any,
    };
  },
  methods: {
    stepCheck(step: any) {
      step.checked = !step.checked;
    },
    remindTimeChange(value: string) {
      if (value.length < 12) {
        uni.showToast({ title: "请选择详细时间", icon: "none" });
        return;
      }
      this.task.remindTime = value;
    },
    async submit() {
      //获取表单对象
      let form = this.$refs.form as any;
      //获取上传表单对象
      let up = this.$refs.uploader as any;
      let res = (await form.validate()) as any[];
      //获取富文本编辑器对象
      let myEditor = this.$refs.myEditor as any;
      //上传任务描述
      let html = await myEditor.store();
      this.task.description = html;
      //获取已经上传的文件
      let uploadFiles = up.getUploadFiles();
      if (uploadFiles.length != up.files.length) {
        uni.showToast({
          title: "有未上传文件",
          icon: "none",
        });
        return;
      }
      this.task.appendix = JSON.stringify(uploadFiles);
      this.task.steps = this.steps.filter((x) => x.content);
      if (this.task.deadline && this.task.deadline?.toString().length < 12) {
        this.task.deadline = this.task.deadline + "00:00:00";
      }
      updateTask(this.task).then((res) => {
        if (res.data == true) {
          uni.showToast({ title: "修改成功" });
          uni.navigateBack({});
        }
      });
    },
    addStep() {
      this.steps.push({ content: "", checked: false } as Step);
    },
    removeStep(index: number) {
      this.steps.splice(index, 1);
    },
    share(taskId: number) {
      if (!taskId) {
        return;
      }
      shareTask({ taskId: taskId }).then((res) => {
        uni.showModal({
          title: "确认复制分享链接",
          content: res.data,
          success: (result) => {
            if (result.confirm) {
              uni.setClipboardData({ data: res.data });
            }
          },
        });
      });
    },
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
    // setTimeout(() => {
    //   this.myEditor = this.$refs.myEditor as any;
    //   this.myEditor.setContent(this.task.description);
    // }, 1000);
  },
  onLoad(options: any) {
    showTask({ id: options.id }).then((res) => {
      let up = this.$refs.uploader as any;
      let data = res.data as Task & { steps: Step[] };
      this.steps = data.steps || [];
      if (data.appendix) {
        up.setFiles(JSON.parse(data.appendix) as myFile[]);
      }
      this.task = data;
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
    background: linear-gradient(to right, #f0ad4e 0%, #fddcad 100%);
  }
}
::v-deep .uni-forms-item__inner {
  padding: 10rpx;
  border-bottom: 1rpx solid rgba(143, 142, 142, 0.089);
}
</style>
