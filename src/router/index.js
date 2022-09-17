import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const modulesFiles = require.context('./modules', true, /\.js$/)
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
    const value = modulesFiles(modulePath)
    modules.push(...value.default)
    return modules
}, [])


const routes = [...modules, {
    path: '*',
    redirect: '/files'
}]

const router = new VueRouter({
    routes,
    scrollBehavior() {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router