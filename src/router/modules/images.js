import Layout from '@/layout'
const imagesRouter = [{
    path: '/images',
    name: 'images',
    redirect: "/images/index",
    component: Layout,
    children: [{
        path: 'compress',
        name: 'compress',
        component: () => import('@/views/images/compress'),
    }, {
        path: 'resize',
        name: 'resize',
        component: () => import('@/views/images/resize'),
    }]
}]

export default imagesRouter