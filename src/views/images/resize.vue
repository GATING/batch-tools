<template>
    <div>
        <a-form layout="inline">
            <a-form-item label="自定义宽高">
                <a-input-number
                    v-for="(diy, idx) in diyArr"
                    :key="idx"
                    :min="0"
                    v-model="diyArr[idx]"
                    :formatter="value => `${value}px`"
                    :parser="value => value.replace('px', '')"
                    style="margin-right:16px"
                />
            </a-form-item>
            <a-form-item>
                <a-checkbox v-model="isCover">
                    等比缩放（根据宽度）
                </a-checkbox>
            </a-form-item>
            <a-form-item>
                <a-button type="primary" @click="modify">确定修改</a-button>
            </a-form-item>
        </a-form>
        <output-settings
            @change="changeSettings"
            :enable.sync="enable"
            :ext.sync="ext"
        />
        <file-list :oldFiles="fileList" :newFiles="newFiles" />
    </div>
</template>
<script>
import { Divider, Form, Button, Checkbox, InputNumber } from "ant-design-vue";
import fileList from "@/components/fileList";
import outputSettings from "@/components/outputSettings";
import Emitter from "@/mixins/emitter";
import { getFileList } from "@/tools/file";
import { resize, getImagesList } from "@/helpers/images";
import { remote } from "electron";

export default {
    name: "resize",
    componentName: "files",
    mixins: [Emitter],
    components: {
        fileList,
        outputSettings,
        "a-divider": Divider,
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-button": Button,
        "a-checkbox": Checkbox,
        "a-input-number": InputNumber
    },
    computed: {
        newFiles() {
            return getImagesList(
                this.fileList,
                this.sourcePath,
                this.ext,
                this.enable
            );
        }
    },
    data() {
        return {
            fileList: [],
            enable: false,
            ext: ["", ""],
            diyArr: [0, 0],
            sourcePath: "",
            isCover: false
        };
    },
    methods: {
        async modify() {
            const diyArr = [...this.diyArr];
            const [width, height] = diyArr;
            if (~~width <= 0) {
                return this.$message.info(`请输入宽度`);
            }
            if (this.isCover) {
                diyArr.pop();
            }

            try {
                await resize(this.fileList, this.newFiles, diyArr);
                this.$message.success(`修改成功`);
            } catch (err) {
                this.$message.error(
                    `修改失败,失败原因: ${err.message || JSON.stringify(err)}`
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
    },
    mounted() {
        this.$on("drop", (...fileList) => {
            this.fileList = getFileList(fileList, this.fileList);
        });
    }
};
</script>
<style lang="scss" scoped>
</style>