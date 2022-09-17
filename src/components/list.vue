<template>
    <a-list
        bordered
        :dataSource="fileList"
        :pagination="pagination"
        class="dragFiles"
    >
        <div slot="header" class="list-header">
            <strong>
                {{ listHeader.name }}
            </strong>
            <div>
                <a-button type="danger" v-if="isDel" size="small" @click="clearFiles" style="margin-right:20px">
                    清空
                </a-button>
                <a-checkbox v-model="listHeader.isChecked">
                    显示全目录
                </a-checkbox>
            </div>
        </div>
        <a-list-item
            slot="renderItem"
            slot-scope="item, index"
            class="list-item"
        >
            <a-button
                slot="actions"
                type="danger"
                v-if="isDel"
                size="small"
                @click="
                    () => {
                        delCurrent(item.path);
                    }
                "
            >
                删除
            </a-button>
            <a-list-item-meta>
                <a-avatar slot="avatar" :src="getIcon(item.name)" />
                <a-tooltip slot="title" :overlayStyle="{ maxWidth: '500px' }">
                    <template slot="title">
                        {{ item.path }}
                    </template>
                    {{ listHeader.isChecked ? item.path : item.name }}
                </a-tooltip>
            </a-list-item-meta>
        </a-list-item>
    </a-list>
</template>

<script>
import { List, Checkbox, Button, Tooltip, Avatar } from "ant-design-vue";
import Emitter from "@/mixins/emitter";
import getIcon from "@/tools/extensions";
const { Item } = List;
export default {
    name: "list",
    mixins: [Emitter],
    props: {
        fileList: {
            type: Array,
            required: true
        },
        listHeader: {
            type: Object,
            required: true
        },
        isDel: {
            type: Boolean,
            default: true
        },
        pagination: {
            type: Object,
            default: () => ({
                pageSize: 6,
                showQuickJumper: true,
                hideOnSinglePage: true
            })
        },
        isFolder: {
            type: Boolean,
            default: false
        }
    },
    components: {
        "a-list": List,
        "a-list-item": Item,
        "a-list-item-meta": Item.Meta,
        "a-checkbox": Checkbox,
        "a-button": Button,
        "a-tooltip": Tooltip,
        "a-avatar": Avatar
    },
    methods: {
        delCurrent(path) {
            const current = this.fileList.findIndex(i => i.path === path);
            this.fileList.splice(current, 1);
        },
        clearFiles(){
            let len = this.fileList.length
            this.fileList.splice(0,len);
        },
        drop(e) {
            e.preventDefault();
            let realFiles = e.dataTransfer.files;
            let files = [...e.dataTransfer.items]
                .filter(file => file.webkitGetAsEntry().isFile)
                .map((item, idx) => {
                    const file = item.webkitGetAsEntry();
                    const { path, type } = realFiles[idx];
                    return {
                        isFile: file.isFile,
                        isDirectory: file.isDirectory,
                        name: file.name,
                        path,
                        type
                    };
                });
            this.dispatch("files", "drop", files);
        },
        getIcon(filename) {
            if (this.isFolder) {
                return require(`@/assets/icons/default_folder.svg`);
            }
            const icon = getIcon(filename.toLocaleLowerCase());
            return require(`@/assets/icons/${icon}`);
        }
    },
    mounted() {
        let $el = document.querySelector(".dragFiles").parentNode;
        this.$el = $el;
        if ($el) {
            $el.ondragenter = $el.ondragover = $el.ondragleave = () => false;
            $el.addEventListener("drop", this.drop, false);
        }
    },
    destroyed() {
        this.$el && this.$el.removeEventListener("drop", this.drop, false);
    }
};
</script>
<style lang="scss" scoped>
@import "@/styles/variables.scss";
.list-header {
    @extend %flexSb;
}
.list-item {
    /deep/ .ant-list-item-meta {
        align-items: center;
        .ant-list-item-meta-title {
            margin-bottom: 0;
            padding-right: 10px;
            word-break: break-all;
        }
    }
    /deep/ .ant-list-item-action {
        margin-left: 0px;
    }
}
</style>