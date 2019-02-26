const Home = () => import(/* webpackChunkName:'pos' */ '@/views/appPosLayout/home')
const Login = () => import(/* webpackChunkName:'pos' */ '@/views/appPosLayout/login')
const My = () => import(/* webpackChunkName:'pos' */ '@/views/appPosLayout/my')
export default [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/my',
    name: 'my',
    component: My
  }
]
