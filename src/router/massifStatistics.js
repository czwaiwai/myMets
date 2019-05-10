const MassifStatistics = () => import(/* webpackChunkName:'comparedBuild' */ '@/views/massifStatistics/index') // 地块统计
export default [{
  path: '/massifStatistics',
  name: 'massifStatistics',
  component: MassifStatistics,
  meta: {
    title: '地块统计'
  }
}]
