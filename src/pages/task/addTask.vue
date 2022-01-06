<template>
  <view class="task">
    <uni-forms ref="form" :modelValue="task" :rules="rules">
      <uni-forms-item required label="标题" name="title">
        <uni-easyinput
          type="text"
          v-model="task.title"
          placeholder="请输入任务名"
        />
      </uni-forms-item>
      <uni-forms-item label="步骤">
        <div class="row">
          <div class="step-wrapper">
            <div class="step" v-for="(step, index) in steps" :key="index">
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
      <uni-forms-item name="description" label="描述">
        <div class="row">
          <myeditor id="myEditor" ref="myEditor"></myeditor>
        </div>
      </uni-forms-item>
      <uni-forms-item label="截至日期" name="deadline">
        <div class="row">
          <uni-datetime-picker
            :border="false"
            type="date"
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
            v-model="task.remindTime"
            @change="remindTimeChange"
          />
        </div>
      </uni-forms-item>
      <!-- #endif -->
      <uni-forms-item label="附件">
        <uploader ref="uploader"></uploader>
      </uni-forms-item>
    </uni-forms>
    <button plain="true" class="submit" @click="subScribe">提交</button>
  </view>
</template>
<script lang="ts">
import Vue from "vue";
import { myFile, Step, Task } from "@/typings";
import { createTask } from "@/api/tasks";
import uploader from "@/components/uploader.vue";
import myeditor from "@/components/editor/editor.vue";

export default Vue.extend({
  components: {
    uploader,
    myeditor,
  },
  data() {
    return {
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
  methods: {
    subScribe() {
      if (this.task.remindTime) {
        uni.requestSubscribeMessage({
          tmplIds: ["qTYSkdd92d38CqXXt54yr3kz4wb0rZRuHXkEho73ato"],
          success: (res) => {
            if (
              res["qTYSkdd92d38CqXXt54yr3kz4wb0rZRuHXkEho73ato"] == "accept"
            ) {
              this.task.isSubscribe = true;
              this.submit();
            }
          },
          fail: (err) => {
            this.submit();
          },
        });
      } else {
        this.submit();
      }
    },
    remindTimeChange(value: string) {
      if (value.length < 12) {
        uni.showToast({ title: "请选择详细时间", icon: "error" });
        return;
      }
    },
    async submit() {
      //获取表单对象
      let form = this.$refs.form as any;
      //获取上传表单对象
      let up = this.$refs.uploader as any;
      console.log(this.task);

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
      if (this.task.deadline && this.task.deadline?.toString().length < 12) {
        this.task.deadline = this.task.deadline.toString().trim() + " 00:00:00";
      }
      if (
        this.task.remindTime &&
        this.task.remindTime?.toString().length < 12
      ) {
        uni.showToast({ title: "提醒日期不正确", icon: "error" });
        return;
      }
      this.task.appendix = JSON.stringify(uploadFiles);
      this.task.listId = this.listId;
      this.task.steps = this.steps.filter((x) => x.content);
      createTask(this.task).then((res) => {
        if (res.data == true) {
          uni.showToast({ title: "添加成功" });
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
  },
  onLoad(options: any) {
    this.listId = options.listId;
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
        margin-top: 10rpx;

        display: flex;
        align-items: center;
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
