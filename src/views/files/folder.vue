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
            <a-col>
                <a-tooltip
                    :title="sourcePath"
                    placement="topLeft"
                    @click="savePath"
                >
                    <a-button>选择保存的地址</a-button>
                </a-tooltip>
            </a-col>
            <a-col>
                <a-button type="primary" @click="handleCreate">
                    确定创建
                </a-button>
            </a-col>
        </a-row>

        <a-divider orientation="left">输出设置</a-divider>
        <a-row>
            <a-col>
                <a-radio-group v-model="setting">
                    <a-radio
                        :value="key"
                        :key="key"
                        v-for="(setting, key) in outputSettings"
                    >
                        {{ setting }}
                    </a-radio>
                </a-radio-group>
            </a-col>
        </a-row>

        <a-divider orientation="left">输出结果</a-divider>
        <list
            :fileList="fileList"
            :listHeader="listHeader"
            :isDel="false"
            :isFolder="!!setting"
        />
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
    InputNumber,
    Radio,
    Tooltip
} from "ant-design-vue";
import List from "@/components/list";
import { testOrderNum, testEmpty } from "@/tools/regexp";
import { getNewFiles, splitFilename } from "@/tools/file";
import { remote } from "electron";
import { createFilesOrFolders } from "@/helpers/file";

export default {
    name: "folder",
    components: {
        List,
        "a-input": Input,
        "a-input-number": InputNumber,
        "a-divider": Divider,
        "a-row": Row,
        "a-col": Col,
        "a-button": Button,
        "a-icon": Icon,
        "a-radio": Radio,
        "a-radio-group": Radio.Group,
        "a-tooltip": Tooltip
    },
    computed: {
        path() {
            if (!this.sourcePath) return "";
            return this.sourcePath + "\\" + this.fileSettings.filename.value;
        },
        fileList() {
            const { fileNum, filename } = this.fileSettings;
            let name = filename.value;
            if (testEmpty(name)) {
                return [];
            }

            const len = fileNum.value;
            const [value, ext] = splitFilename(name);

            return getNewFiles(
                ["*", ext],
                Array(~~len).fill({
                    name,
                    path: this.path
                }),
                true,
                { ...this.fileSettings, filename: { value } }
            );
        }
    },
    data() {
        return {
            fileSettings: {
                filename: {
                    value: "",
                    span: 6,
                    type: "file",
                    placeholder: "请输入新的文件名(文件需带后缀名)"
                },
                orderNum: {
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
                fileNum: {
                    value: 1,
                    span: 2,
                    type: "file",
                    placeholder: "创建个数",
                    isNum: true
                }
            },
            sourcePath: "",
            listHeader: {
                name: "文件列表",
                isChecked: false
            },
            setting: 0,
            outputSettings: ["生成文件", "生成文件夹"],
            isChecked: false
        };
    },
    methods: {
        async handleCreate() {
            const orderNum = this.fileSettings.orderNum.value;
            if (testOrderNum(orderNum) && orderNum) {
                return this.$message.error(
                    "请输入正确的序号，格式为纯数字或纯字母"
                );
            }
            if (!this.sourcePath) {
                return this.$message.error("请选择你要保存的地址");
            }
            try {
                await createFilesOrFolders(this.fileList, !!this.setting);
                this.$message.success(`创建成功`);
                this.fileList = [];
            } catch (err) {
                this.$message.error(
                    `创建失败,失败原因: ${err.message || JSON.stringify(err)}`
                );
            }
        },
        async savePath() {
            try {
                const { filePaths } = await remote.dialog.showOpenDialog({
                    title: "选择保存的地址",
                    properties: ["openDirectory"]
                });
                this.sourcePath = filePaths[0];
            } catch (err) {
                this.$message.error(
                    `获取文件路径失败,错误信息: ${err.message ||
                        JSON.stringify(err)}`
                );
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";
.list-header {
    @extend %flexSb;
}
</style>