const ComparedBuild = () => import(/* webpackChunkName:'comparedBuild' */ '@/views/comparedBuild/index') // 整改对比
const GroupInfo = () => import(/* webpackChunkName:'comparedBuild' */ '@/views/comparedBuild/groupInfo') // 整改对比
export default [{
  path: '/comparedBuild',
  name: 'compared_comparedBuild',
  component: ComparedBuild,
  meta: {
    title: '整改对比'
  },
  children: [{
    path: 'groupInfo',
    name: 'compared_groupInfo',
    component: GroupInfo,
    meta: {
      title: '切换组团'
    }
  }]
}]
