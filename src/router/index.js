import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () =>
    import ('../components/Login.vue')
const Home = () =>
    import ('../views/Home.vue')
const Welcom = () =>
    import ('../components/Welcome.vue')
const Users = () =>
    import ('../components/user/users.vue')
const Rights = () =>
    import ('../components/power/Rights.vue')
const Roles = () =>
    import ('../components/power/Roles.vue')
const Cate = () =>
    import ('../components/goods/Cate.vue')
const Goods = () =>
    import ('../components/goods/Goods.vue')
const Params = () =>
    import ('../components/goods/Params.vue')
const Add = () =>
    import ('../components/goods/Add.vue')
const Order = () =>
    import ('../components/order/Order.vue')
const Report = () =>
    import ('../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: {
            title: '登陆'
        }
    },
    {
        path: '/home',
        name: 'Home',
        redirect: '/home/welcom',
        component: Home,
        meta: {
            title: '主页'
        },
        children: [{
                path: 'welcom',
                component: Welcom,
                meta: {
                    title: '欢迎'
                }
            },
            {
                path: '/users',
                name: 'users',
                component: Users,
                meta: {
                    title: '用户管理'
                }
            },
            {
                path: '/roles',
                name: 'roles',
                component: Roles,
                meta: {
                    title: '角色列表'
                }
            },
            {
                path: '/rights',
                name: 'rights',
                component: Rights,
                meta: {
                    title: '权限列表'
                }
            },

            {
                path: '/goods',
                name: 'goods',
                component: Goods,
                meta: {
                    title: '商品列表'
                }
            },
            {
                path: '/goods/add',
                name: 'add',
                component: Add,
                meta: {
                    title: '添加商品'
                }
            },
            {
                path: '/params',
                name: 'params',
                component: Params,
                meta: {
                    title: '分类参数'
                }
            },
            {
                path: '/categories',
                name: 'categories',
                component: Cate,
                meta: {
                    title: '商品分类'
                }
            },
            {
                path: '/orders',
                name: 'orders',
                component: Order,
                meta: {
                    title: '订单列表'
                }
            },
            {
                path: '/reports',
                name: 'reports',
                component: Report,
                meta: {
                    title: '数据报表'
                }
            }
        ]
    }
]

const router = new VueRouter({
        routes,
        mode: 'history'
    })
    // 路由导航守卫控制权限
router.beforeEach((to, from, next) => {
    document.title = '管理系统'
    if (to.path === '/login') return next()
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) return next('/login')
    next()
})
export default router