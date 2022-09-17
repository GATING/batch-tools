<template>
    <div>
        <a-divider orientation="left">文件名设置</a-divider>
        <a-row type="flex" :gutter="16">
            <a-col :span="5">
                <a-input
                    placeholder="请输入新的文件名"
                    v-model="filename"
                    allowClear
                >
                    <a-icon
                        slot="prefix"
                        type="file"
                        style="color:rgba(0,0,0,.25)"
                    />
                </a-input>
            </a-col>
            <a-col :span="4">
                <a-input placeholder="起始序号" v-model="orderNum" allowClear>
                    <a-icon
                        slot="prefix"
                        type="sort-descending"
                        style="color:rgba(0,0,0,.25)"
                    />
                </a-input>
            </a-col>
            <a-col :span="4">
                <a-input-number placeholder="增量" v-model="increment" />
            </a-col>
            <a-col :span="1">
                <a-button type="primary" @click="handleModify">
                    确定修改
                </a-button>
            </a-col>
        </a-row>
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
export default {
    name: "filenameSettings",
    components: {
        "a-input": Input,
        "a-input-number": InputNumber,
        "a-divider": Divider,
        "a-row": Row,
        "a-col": Col,
        "a-button": Button,
        "a-icon": Icon
    },
    data() {
        return {
            filename: "",
            orderNum: "",
            increment: 1
        };
    },
    methods: {
        handleModify() {
            const orderNum = this.orderNum;
            if (!/(^\d+$)|(^[a-zA-Z]+$)/.test(orderNum) && orderNum) {
                return this.$message.error(
                    "请输入正确的序号，格式为纯数字或纯字母"
                );
            }
        }
    }
};
</script>

<style lang="scss" scoped>
</style>