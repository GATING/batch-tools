import Layout from '@/layout'
const filesRouter = [{
    path: '/files',
    name: 'files',
    redirect: "/files/index",
    component: Layout,
    children: [{
        path: 'index',
        name: "rename",
        component: () => import('@/views/files'),
    }, {
        path: 'times',
        name: 'times',
        component: () => import('@/views/files/times'),
    }, {
        path: 'folder',
        name: 'folder',
        component: () => import('@/views/files/folder'),
    }]
}]

export default filesRouter