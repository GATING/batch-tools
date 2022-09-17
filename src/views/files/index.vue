<template>
  <div>
    <a-divider orientation="left">文件名设置</a-divider>
    <a-row type="flex" :gutter="16">
      <a-col
        :key="key"
        :span="setting.span"
        v-for="(setting, key) in fileSettings"
      >
        <template v-if="setting.isNum">
          <a-input-number
            style="width:100%"
            :placeholder="setting.placeholder"
            v-model="setting.value"
          />
        </template>
        <template v-else>
          <a-input
            :placeholder="setting.placeholder"
            v-model="setting.value"
            allowClear
          >
            <a-icon
              slot="prefix"
              :type="setting.type"
              style="color:rgba(0,0,0,.25)"
            />
          </a-input>
        </template>
      </a-col>
      <a-col :span="1">
        <a-button type="primary" @click="handleModify">
          确定修改
        </a-button>
      </a-col>
    </a-row>
    <output-settings
      @change="changeSettings"
      :enable.sync="enable"
      :ext.sync="ext"
    />
    <file-list :oldFiles="oldFiles" :newFiles="newFiles" />
  </div>
</template>

<script>
import {
  Input,
  Divider,
  Row,
  Col,
  Button,
  Icon,
  InputNumber
} from "ant-design-vue";
import fileList from "@/components/fileList";
import outputSettings from "@/components/outputSettings";
import { getNewFiles, getFileList } from "@/tools/file";
import { testserialNum } from "@/tools/regexp";
import Emitter from "@/mixins/emitter";
import { remote } from "electron";
import { renameFiles } from "@/helpers/file";

export default {
  name: "rename",
  componentName: "files",
  mixins: [Emitter],
  components: {
    fileList,
    outputSettings,
    "a-input": Input,
    "a-input-number": InputNumber,
    "a-divider": Divider,
    "a-row": Row,
    "a-col": Col,
    "a-button": Button,
    "a-icon": Icon
  },
  computed: {
    newFiles() {
      return getNewFiles(
        this.ext,
        this.oldFiles,
        this.enable,
        this.fileSettings,
        this.sourcePath
      );
    }
  },
  data() {
    return {
      oldFiles: [],
      enable: false,
      ext: ["", ""],
      fileSettings: {
        filename: {
          value: "",
          span: 5,
          type: "file",
          placeholder: "请输入新的文件名"
        },
        serialNum: {
          value: "",
          span: 5,
          type: "sort-descending",
          placeholder: "起始序号(纯数字或纯字母)"
        },
        increment: {
          value: 1,
          span: 2,
          placeholder: "增量",
          isNum: true
        },
        preReplaceWord: {
          value: "",
          span: 4,
          type: "file",
          placeholder: "替换前的字符"
        },
        replaceWord: {
          value: "",
          span: 4,
          type: "file",
          placeholder: "替换后的字符"
        }
      },
      sourcePath: ""
    };
  },
  methods: {
    async handleModify() {
      const serialNum = this.fileSettings.serialNum.value;
      if (testserialNum(serialNum) && serialNum) {
        return this.$message.error("请输入正确的序号，格式为纯数字或纯字母");
      }

      let newFiles = this.newFiles;
      let sourcePath = this.sourcePath;
      if (sourcePath) {
        newFiles = newFiles.map(file => ({
          ...file,
          path: `${sourcePath}\\${file.name}`
        }));
      }
      try {
        await renameFiles(this.oldFiles, this.newFiles);
        this.$message.success(`重命名成功`);
        this.oldFiles = [];
      } catch (err) {
        this.$message.error(
          `重命名失败,失败原因: ${err.message || JSON.stringify(err)}`
        );
      }
    },
    async changeSettings(e) {
      if (e) {
        const { filePaths } = await remote.dialog.showOpenDialog({
          title: "选择保存的地址",
          properties: ["openDirectory"]
        });
        this.sourcePath = filePaths[0];
      }
    }
    // getFileList(fileList) {
    //     this.oldFiles = getFileList(fileList, this.oldFiles);
    //     console.log(this.oldFiles);
    // }
  },
  mounted() {
    this.$on("drop", (...fileList) => {
      this.oldFiles = getFileList(fileList, this.oldFiles);
    });
  }
};
</script>
