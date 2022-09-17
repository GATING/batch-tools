<template>
    <a-layout id="layout">
        <a-layout-sider :trigger="null" collapsible v-model="collapsed">
            <div class="logo">磨蹭先生著</div>
            <a-menu v-model="current" theme="dark" mode="inline">
                <a-sub-menu :key="menus.title" v-for="menus in menuList">
                    <span slot="title">
                        <a-icon :type="menus.icon" />
                        <span>{{ menus.title }}</span>
                    </span>
                    <a-menu-item
                        :key="menu.url"
                        v-for="menu in menus.children"
                    >
                        <router-link :to="menu.url">
                            {{ menu.name }}
                        </router-link>
                    </a-menu-item>
                </a-sub-menu>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; padding: 0">
                <a-icon
                    class="trigger"
                    :type="collapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="() => (collapsed = !collapsed)"
                />
            </a-layout-header>
            <a-layout-content
                :style="{
                    margin: '24px 16px',
                    padding: '24px',
                    background: '#fff',
                    minHeight: '280px'
                }"
            >
                <transition name="fade-transform" mode="out-in">
                    <keep-alive>
                        <a-locale-provider :locale="zh_CN">
                            <router-view />
                        </a-locale-provider>
                    </keep-alive>
                </transition>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>
<script>
import zh_CN from "ant-design-vue/lib/locale-provider/zh_CN";
import { Layout, Menu, Icon, LocaleProvider } from "ant-design-vue";
const { Header, Content, Sider } = Layout;
const { Item, SubMenu } = Menu;
export default {
    name: "layout",
    components: {
        "a-layout": Layout,
        "a-layout-header": Header,
        "a-layout-content": Content,
        "a-layout-sider": Sider,
        "a-menu": Menu,
        "a-sub-menu": SubMenu,
        "a-menu-item": Item,
        "a-icon": Icon,
        "a-locale-provider": LocaleProvider
    },
    watch:{
        $route() {
            this.routePath();
        }
    },
    data() {
        return {
            zh_CN,
            current:[],
            collapsed: false,
            menuList: [
                {
                    title: "文件处理",
                    icon: "file",
                    children: [
                        {
                            name: "文件名修改",
                            url: "/files/index"
                        },
                        {
                            name: "时间修改",
                            url: "/files/times"
                        },
                        {
                            name: "空白文件(夹)创建",
                            url: "/files/folder"
                        }
                    ]
                },
                {
                    title: "图片处理",
                    icon: "picture",
                    children: [
                        {
                            name: "图片压缩",
                            url: "/images/compress"
                        },
                        {
                            name: "尺寸修改",
                            url: "/images/resize"
                        }
                    ]
                }
            ]
        };
    },
    methods:{
         routePath() {
            this.current = [this.$route.path];
        },
    },
    mounted(){
        this.routePath();
    }
};
</script>
<style lang="scss" scoped>
#layout {
    height: 100vh;
    & .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        transition: color 0.3s;
    }

    & .trigger:hover {
        color: #1890ff;
    }

    & .logo {
        height: 32px;
        line-height: 32px;
        background: rgba(255, 255, 255, 0.2);
        margin: 16px;
        padding: 0 5px;
        text-align: center;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    /deep/ .ant-layout-content{
        overflow: auto
    }
}
</style>
