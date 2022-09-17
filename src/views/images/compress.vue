<template>
    <div>
        <a-divider orientation="left">压缩设置</a-divider>
        <a-form layout="inline">
            <a-form-item label="压缩质量">
                <a-slider
                    :min="1"
                    :max="100"
                    v-model="quality"
                    style="width:52vw;"
                />
            </a-form-item>
            <a-form-item>
                <a-radio-group v-model="type" buttonStyle="solid">
                    <a-radio-button
                        :key="type"
                        :value="type"
                        v-for="type in compressTypes"
                    >
                        {{ type }}
                    </a-radio-button>
                </a-radio-group>
            </a-form-item>

            <a-form-item>
                <a-button type="primary" @click="compress">确定压缩</a-button>
            </a-form-item>
        </a-form>

        <output-settings
            :isNeedExt="false"
            @change="changeSettings"
        />
        <file-list :oldFiles="fileList" :newFiles="newFiles" />
    </div>
</template>

<script>
import { Divider, Form, Slider, Radio, Button } from "ant-design-vue";
import fileList from "@/components/fileList";
import outputSettings from "@/components/outputSettings";
import Emitter from "@/mixins/emitter";
const { Button: RadioButton, Group } = Radio;
import { getImagesList } from "@/helpers/images";
import { getFileList } from "@/tools/file";
import { compress } from "@/helpers/images";
import { remote } from "electron";
const compressTypes = ["无损压缩", "有损压缩"];

export default {
    name: "compress",
    componentName: "files",
    mixins: [Emitter],
    components: {
        fileList,
        outputSettings,
        "a-divider": Divider,
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-slider": Slider,
        "a-radio-button": RadioButton,
        "a-radio-group": Group,
        "a-button": Button
    },
    computed: {
        newFiles() {
            return getImagesList(
                this.fileList,
                this.sourcePath,
                ["", ""],
                false
            );
        }
    },
    data() {
        return {
            fileList: [],
            type: compressTypes[0],
            compressTypes,
            quality: 70,
            sourcePath: ""
        };
    },
    methods: {
        async compress() {
            try {
                const isLossy =  compressTypes.indexOf(this.type)
                await compress(
                    this.fileList,
                    this.quality,
                    !!isLossy,
                    this.sourcePath
                );
                this.$message.success(`压缩成功`);
                this.fileList = [];
            } catch (err) {
                this.$message.error(
                    `压缩失败,失败原因: ${err.message || JSON.stringify(err)}`
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
            this.fileList = getFileList(fileList, this.fileList).filter(i =>
                i.type.includes("image")
            );
        });
    }
};
</script>

<style lang="scss" scoped>
</style>