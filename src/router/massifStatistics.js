const MassifStatistics = () => import(/* webpackChunkName:'comparedBuild' */ '@/views/massifStatistics/index') // 地块统计
const MassifStatisticsReport = () => import(/* webpackChunkName:'comparedBuild' */ '@/views/massifStatistics/report') // 地块统计
export default [{
  path: '/massifStatistics',
  name: 'massifStatistics',
  component: MassifStatistics,
  meta: {
    title: '地块统计'
  }},
{
  path: '/massifStatisticsReport',
  name: 'massifStatisticsReport',
  component: MassifStatisticsReport,
  meta: {
    title: '地块统计'
  }
}
]
