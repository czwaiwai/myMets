const ComparedBuild = () => import(/* webpackChunkName:'comparedBuild' */ '@/views/comparedBuild/index') // 整改对比
export default [{
  path: '/comparedBuild',
  name: 'compared_comparedBuild',
  component: ComparedBuild,
  meta: {
    title: '整改对比'
  }
}]
