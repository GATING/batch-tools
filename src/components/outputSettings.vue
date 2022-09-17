<template>
    <div>
        <a-divider orientation="left">输出设置</a-divider>
        <a-row>
            <a-col :span="10">
                <a-radio-group :defaultValue="0" @change="changeSettings">
                    <a-radio
                        :value="key"
                        :key="key"
                        v-for="(setting, key) in outputSettings"
                    >
                        {{ setting }}
                    </a-radio>
                </a-radio-group>
            </a-col>
            <a-col :span="14" v-if="isNeedExt">
                <a-row align="middle" type="flex">
                    <a-col :span="9">
                        <a-input
                            placeholder="*为所有拓展名,比较暴力"
                            v-model="ext[0]"
                            allowClear
                        />
                    </a-col>
                    <a-col :span="3" class="icon-wrap">
                        <a-icon type="double-right" />
                    </a-col>
                    <a-col :span="9">
                        <a-input
                            placeholder="请输入修改后的拓展名..."
                            v-model="ext[1]"
                            allowClear
                        />
                    </a-col>
                    <a-col :span="3" class="switch-wrap">
                        <a-switch
                            checkedChildren="启用"
                            unCheckedChildren="关闭"
                            :value="enable"
                            @change="changeEnableExt"
                        />
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { Radio, Divider, Input, Row, Col, Switch, Icon } from "ant-design-vue";
export default {
    name: "outputSettings",
    props: {
        outputSettings: {
            type: Array,
            default: () => ["(同名?)替换原文件", "另存到文件夹"]
        },
        enable: Boolean,
        ext: Array,
        isNeedExt: {
            type: Boolean,
            default: true
        }
    },
    components: {
        "a-radio": Radio,
        "a-radio-group": Radio.Group,
        "a-divider": Divider,
        "a-input": Input,
        "a-row": Row,
        "a-col": Col,
        "a-switch": Switch,
        "a-icon": Icon
    },
    methods: {
        changeSettings(e) {
            this.$emit("change", e.target.value);
        },
        changeEnableExt(checked) {
            this.$emit("update:enable", checked);
        }
    }
};
</script>

<style lang="scss" scoped>
.icon-wrap {
    font-size: 20px;
    text-align: center;
}
.switch-wrap {
    text-align: right;
}
</style>