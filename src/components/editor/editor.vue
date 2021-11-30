<template>
  <div>
    <view
      class="toolbar"
      @touchend.stop="format"
      :style="'bottom: ' + (isIOS ? keyboardHeight : 0) + 'px'"
    >
      <i class="iconfont icon-charutupian" @touchend.stop="insertImage"></i>
      <i
        :class="
          'iconfont icon-format-header-1 ' +
          (formats.header === 1 ? 'ql-active' : '')
        "
        data-name="header"
        :data-value="1"
        @touchend="format('header', 0)"
      ></i>
      <i
        :class="
          'iconfont icon-format-header-2 ' +
          (formats.header === 2 ? 'ql-active' : '')
        "
        data-name="header"
        :data-value="2"
        @touchend="format('header', 2)"
      ></i>
      <i
        :class="
          'iconfont icon-format-header-3 ' +
          (formats.header === 3 ? 'ql-active' : '')
        "
        data-name="header"
        :data-value="3"
        @touchend="format('header', 3)"
      ></i>
      <i
        :class="
          'iconfont icon-format-header-4 ' +
          (formats.header === 4 ? 'ql-active' : '')
        "
        data-name="header"
        :data-value="4"
        @touchend="format('header', 4)"
      ></i>
      <i
        :class="
          'iconfont icon-format-header-5 ' +
          (formats.header === 5 ? 'ql-active' : '')
        "
        data-name="header"
        :data-value="5"
        @touchend="format('header', 5)"
      ></i>
      <i
        :class="
          'iconfont icon-format-header-6 ' +
          (formats.header === 6 ? 'ql-active' : '')
        "
        data-name="header"
        :data-value="6"
        @touchend="format('header', 6)"
      ></i>
      <i
        :class="'iconfont icon-zitijiacu ' + (formats.bold ? 'ql-active' : '')"
        data-name="bold"
        @touchend="format('bold')"
      ></i>
      <i
        :class="
          'iconfont icon-zitishanchuxian ' + (formats.strike ? 'ql-active' : '')
        "
        data-name="strike"
        @touchend="format('strike')"
      ></i>
      <i
        :class="
          'iconfont icon-zitixieti ' + (formats.italic ? 'ql-active' : '')
        "
        data-name="italic"
        @touchend="format('italic')"
      ></i>
      <i
        :class="
          'iconfont icon-zuoduiqi ' +
          (formats.align === 'left' ? 'ql-active' : '')
        "
        data-name="align"
        data-value="left"
        @touchend="format('align', 'left')"
      ></i>
      <i
        :class="
          'iconfont icon-juzhongduiqi ' +
          (formats.align === 'center' ? 'ql-active' : '')
        "
        data-name="align"
        data-value="center"
        @touchend="format('align', 'center')"
      ></i>
      <i
        :class="
          'iconfont icon-youduiqi ' +
          (formats.align === 'right' ? 'ql-active' : '')
        "
        data-name="align"
        data-value="right"
        @touchend="format('align', 'right')"
      ></i>
      <i
        :class="
          'iconfont icon-zuoyouduiqi ' +
          (formats.align === 'justify' ? 'ql-active' : '')
        "
        data-name="align"
        data-value="justify"
        @touchend="format('align', 'justify')"
      ></i>
      <i
        :class="
          'iconfont icon-line-height ' + (formats.lineHeight ? 'ql-active' : '')
        "
        data-name="lineHeight"
        data-value="2"
        @touchend="format('lineHeight', '2')"
      ></i>
      <i
        :class="
          'iconfont icon-Character-Spacing ' +
          (formats.letterSpacing ? 'ql-active' : '')
        "
        data-name="letterSpacing"
        data-value="2em"
        @touchend="format('letterSpacing', '2em')"
      ></i>
      <i
        :class="
          'iconfont icon-722bianjiqi_duanqianju ' +
          (formats.marginTop ? 'ql-active' : '')
        "
        data-name="marginTop"
        data-value="20px"
        @touchend="format('marginTop', '20px')"
      ></i>
      <i
        :class="
          'iconfont icon-723bianjiqi_duanhouju ' +
          (formats.marginBottom  ? 'ql-active' : '')
        "
        data-name="marginBottom"
        data-value="20px"
        @touchend="format('marginBottom', '20px')"
      ></i>
      <i class="iconfont icon-clearedformat" @tap="removeFormat"></i>
      <i
        :class="'iconfont icon-font ' + (formats.fontFamily ? 'ql-active' : '')"
        data-name="fontFamily"
        data-value="Pacifico"
        @touchend="format('fontFamily', 'Pacifico')"
      ></i>
      <i
        :class="
          'iconfont icon-fontsize ' +
          (formats.fontSize === '24px' ? 'ql-active' : '')
        "
        data-name="fontSize"
        data-value="24px"
        @touchend="format('fontSize', '24px')"
      ></i>
      <i
        :class="
          'iconfont icon-text_color ' +
          (formats.color === fontColor ? 'ql-active' : '')
        "
        data-name="color"
        :data-value="fontColor"
        @tap="open"
      ></i>
      <i
        :class="
          'iconfont icon-fontbgcolor ' +
          (formats.backgroundColor === '#00ff00' ? 'ql-active' : '')
        "
        data-name="backgroundColor"
        data-value="#00ff00"
        @touchend="format('backgroundColor', '#00ff00')"
      ></i>
      <!-- 引用黄河浪的color取色器 -->
      <i class="iconfont icon-date" @tap="insertDate"></i>
      <i class="iconfont icon-undo" @tap="undo"></i>
      <i class="iconfont icon-redo" @tap="redo"></i>
      <i
        :class="
          'iconfont icon-zitixiahuaxian ' +
          (formats.underline ? 'ql-active' : '')
        "
        data-name="underline"
        @touchend="format('underline')"
      ></i>
      <i
        class="iconfont icon--checklist"
        data-name="list"
        data-value="check"
        @touchend="format('list', 'check')"
      ></i>
      <i
        :class="
          'iconfont icon-youxupailie ' +
          (formats.list === 'ordered' ? 'ql-active' : '')
        "
        data-name="list"
        data-value="ordered"
        @touchend="format('list', 'ordered')"
      ></i>
      <i
        :class="
          'iconfont icon-wuxupailie ' +
          (formats.list === 'bullet' ? 'ql-active' : '')
        "
        data-name="list"
        data-value="bullet"
        @touchend="format('list', 'bullet')"
      ></i>
      <i
        class="iconfont icon-outdent"
        data-name="indent"
        data-value="-1"
        @touchend="format('indent', '-1')"
      ></i>
      <i
        class="iconfont icon-indent"
        data-name="indent"
        data-value="+1"
        @touchend="format('indent', '+1')"
      ></i>
      <i class="iconfont icon-fengexian" @tap="insertDivider"></i>
      <i class="iconfont icon-preview" @tap="store" id="2"></i>
      <i
        :class="
          'iconfont icon-zitixiabiao ' +
          (formats.script === 'sub' ? 'ql-active' : '')
        "
        data-name="script"
        data-value="sub"
        @touchend="format('script', 'sub')"
      ></i>
      <i
        :class="
          'iconfont icon-zitishangbiao ' +
          (formats.script === 'super' ? 'ql-active' : '')
        "
        data-name="script"
        data-value="super"
        @touchend="format('script', 'super')"
      ></i>
      <!-- <i class="iconfont icon-quanping"></i> -->
      <i class="iconfont icon-shanchu" @tap="clear"></i>
      <i
        :class="
          'iconfont icon-direction-rtl ' +
          (formats.direction === 'rtl' ? 'ql-active' : '')
        "
        data-name="direction"
        data-value="rtl"
        @touchend="format('direction', 'rtl')"
      ></i>
      <i class="iconfont icon-baocun" @tap="store" id="1"></i>
    </view>

    <view class="container">
      <editor
        id="editor"
        show-img-size
        :read-only="isEdit"
        show-img-resize
        show-img-toolbar
        class="ql-container"
        :placeholder="placeholder"
        @statuschange="onStatusChange"
        @ready="onEditorReady"
      >
      </editor>
    </view>
  </div>
</template>
<script lang="ts">
import { uploadFile } from "@/api/common";
import Vue from "vue";
export default Vue.extend({
  data() {
    return {
      color: {
        r: 255,
        g: 0,
        b: 0,
        a: 0.6,
      },
      isEdit: false,
      fontColor: "#000",
      formats: {},
      readOnly: false,
      placeholder: "开始输入...",
      editorHeight: 300,
      keyboardHeight: 0,
      isIOS: false,
      editorCtx: {} as any,
    };
  },
  methods: {
    setContent(html: string) {        
      this.editorCtx.setContents({ html: html });
    },
    cancel() {
      this.isEdit = false;
    },
    open() {
      let picker = this.$refs.colorPicker as any;
      picker.open();
      this.isEdit = true;
      // uni.hideKeyboard();
    },
    hideKey() {
      uni.hideKeyboard();
    },
    async confirm(e: any) {
      this.isEdit = false;
      this.fontColor = await e.hex;
      this.onStatusChange({
        detail: {
          color: e.hex,
        },
      });
      this.$forceUpdate();
    },
    readOnlyChange() {
      this.readOnly = !this.readOnly;
    },
    onEditorReady() {
      uni
        .createSelectorQuery()
        .select("#editor")
        .context((res) => {
          this.editorCtx = res.context;
        })
        .exec();
    },
    undo() {
      this.editorCtx.undo();
    },

    redo() {
      this.editorCtx.redo();
    },

    blur() {
      this.editorCtx.blur();
    },

    format(name: string, value: string) {
      // this.hideKey();

      if (!name) return; 
      this.editorCtx.format(name, value);
    },

    onStatusChange(e: any) {
      this.formats = e.detail;
    },

    insertDivider() {
      this.editorCtx.insertDivider({
        success: function () {
          console.log("insert divider success");
        },
      });
    },

    store(e: any) {
      let promise = new Promise((resove, reject) => {
        this.editorCtx.getContents({
          success: function (res: any) {
            resove(res.html);
          },
        });
      });
      return promise;
    },

    clear() {
      this.editorCtx.clear({
        success: function (res: any) {
          console.log("clear success");
        },
      });
    },
    removeFormat() {
      this.editorCtx.removeFormat();
    },
    insertDate() {
      const date = new Date();
      const formatDate = `${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`;
      this.editorCtx.insertText({
        text: formatDate,
      });
    },
    insertImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          uploadFile(res.tempFilePaths[0]).then((res: any) => {
            this.editorCtx.insertImage({
              src: res.data.url,
              data: {
                id: "abcd",
                role: "god",
              },
              width: "80%",
              success: function () {
                console.log("insert image success");
              },
            });
          });
        },
      });
    },
  },
});
</script>
<style lang="scss" scoped>
@import "./editor.css";
</style>
