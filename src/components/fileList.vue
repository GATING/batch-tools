<template>
    <div>
        <a-divider orientation="left">输出结果</a-divider>
        <div id="dragFiles" style="height:100px">
            <a-row :gutter="16">
                <a-col :span="12" :key="key" v-for="(key, idx) in listKeys">
                    <list
                        bordered
                        :fileList="(() => getFileList(key))()"
                        :listHeader="listHeader[key]"
                        :isDel="isDel[idx]"
                    />
                </a-col>
            </a-row>
        </div>
    </div>
</template>

<script>
import { Button, Row, Col, Divider } from "ant-design-vue";
import List from "@/components/list";

export default {
    name: "fileList",
    props: {
        oldFiles: {
            type: Array,
            required: true
        },
        newFiles: {
            type: Array,
            required: true
        }
    },
    components: {
        "a-button": Button,
        "a-row": Row,
        "a-col": Col,
        "a-divider": Divider,
        List
    },
    data() {
        return {
            listKeys: ["oldFiles", "newFiles"],
            isDel: [true, false],
            listHeader: {
                oldFiles: {
                    name: "原文件列表",
                    isChecked: false
                },
                newFiles: {
                    name: "新文件列表",
                    isChecked: false
                }
            },
            pagination: {
                pageSize: 10,
                showQuickJumper: true,
                hideOnSinglePage: true
            }
        };
    },
    methods: {
        getFileList(key) {
            return this[key];
        }
    }
};
</script>

