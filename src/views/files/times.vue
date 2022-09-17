<template>
    <div>
        <a-divider orientation="left">时间设置</a-divider>
        <a-tabs>
            <a-tab-pane
                :key="tab.tabLabel"
                :tab="tab.tabLabel"
                v-for="(tab, idx) in tabs"
            >
                <a-form>
                    <a-form-item
                        v-for="(item, idx) in tab.items"
                        :key="idx"
                        :label="labels[idx]"
                        :label-col="{ span: 5 }"
                        :wrapper-col="{ span: 12 }"
                    >
                        <template v-if="tab.isDays">
                            <a-input-number
                                :min="0"
                                placeholder="天数"
                                :disabled="idx === 0"
                                v-model="item.days"
                                style="margin-right:16px"
                            />
                            <a-time-picker
                                v-model="item.time"
                                :disabled="idx === 0"
                            />
                        </template>
                        <template v-else>
                            <a-date-picker
                                format="YYYY-MM-DD HH:mm:ss"
                                v-model="item.time"
                                showTime
                                :disabled="idx === 0"
                            />
                        </template>
                    </a-form-item>
                    <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
                        <a-button
                            type="primary"
                            html-type="submit"
                            @click="
                                () => {
                                    modifyTime(idx);
                                }
                            "
                        >
                            确定修改
                        </a-button>
                    </a-form-item>
                </a-form>
            </a-tab-pane>
        </a-tabs>
        <a-divider orientation="left">输出结果</a-divider>
        <list
            :fileList="fileList"
            :listHeader="listHeader"
            :pagination="pagination"
        />
    </div>
</template>

<script>
import {
    Divider,
    DatePicker,
    TimePicker,
    Input,
    InputNumber,
    Tabs,
    Form,
    Button
} from "ant-design-vue";
import { getFileList } from "@/tools/file";
import Emitter from "@/mixins/emitter";
import List from "@/components/list";
import moment from "moment";
import { modifyFileTime } from "@/helpers/file";

export default {
    name: "times",
    componentName: "files",
    mixins: [Emitter],
    components: {
        List,
        Input,
        "a-input-number": InputNumber,
        "a-divider": Divider,
        "a-date-picker": DatePicker,
        "a-time-picker": TimePicker,
        "a-tabs": Tabs,
        "a-tab-pane": Tabs.TabPane,
        "a-form": Form,
        "a-form-item": Form.Item,
        "a-button": Button
    },
    data() {
        return {
            fileList: [],
            labels: ["创建时间", "访问时间", "修改时间"],
            tabs: [
                {
                    tabLabel: "设定时间",
                    isDays: false,
                    items: [
                        { time: moment() },
                        { time: moment() },
                        { time: moment() }
                    ]
                },
                {
                    tabLabel: "更早一些",
                    isDays: true,
                    items: [
                        { time: moment(), days: "", operation: -1 },
                        { time: moment(), days: "", operation: -1 },
                        { time: moment(), days: "", operation: -1 }
                    ]
                },
                {
                    tabLabel: "更晚一些",
                    isDays: true,
                    items: [
                        { time: moment(), days: "", operation: 1 },
                        { time: moment(), days: "", operation: 1 },
                        { time: moment(), days: "", operation: 1 }
                    ]
                }
            ],
            listHeader: {
                name: "文件列表",
                isCheckbox: false
            },
            pagination: {
                pageSize: 5,
                showQuickJumper: true,
                hideOnSinglePage: true
            }
        };
    },
    methods: {
        add() {},
        getTime(times) {
            return times.reduce(
                (res, item) => [
                    ...res,
                    Number(
                        item["time"].add(
                            ~~item["operation"] * ~~item["days"],
                            "d"
                        )
                    ) / 1000
                ],
                []
            );
        },
        async modifyTime(idx) {
            const times = this.getTime(this.tabs[idx].items);
            try {
                await modifyFileTime(this.fileList, ...times);
                this.$message.success(`修改成功`);
            } catch (err) {
                this.$message.error(
                    `修改失败,失败原因: ${err.message || JSON.stringify(err)}`
                );
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