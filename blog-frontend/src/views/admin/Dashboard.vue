<template>
  <div class="animate-fade-in-up">
    <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 border-b pb-4 dark:border-gray-700">控制台</h2>
    
    <!-- 数据统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div @click="$router.push('/admin/articles')" class="cursor-pointer bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <h3 class="text-white/80 text-sm font-medium uppercase tracking-wider">总文章数</h3>
          <span class="p-2 bg-white/20 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
          </span>
        </div>
        <p class="text-4xl font-bold text-white mt-4">{{ stats.totalArticles }}</p>
      </div>

      <div @click="$router.push('/admin/articles')" class="cursor-pointer bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <h3 class="text-white/80 text-sm font-medium uppercase tracking-wider">总阅读量</h3>
          <span class="p-2 bg-white/20 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
          </span>
        </div>
        <p class="text-4xl font-bold text-white mt-4">{{ stats.totalViews.toLocaleString() }}</p>
      </div>

      <div @click="$router.push('/admin/comments')" class="cursor-pointer bg-gradient-to-br from-rose-400 to-orange-500 rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-transform duration-300">
        <div class="flex items-center justify-between">
          <h3 class="text-white/80 text-sm font-medium uppercase tracking-wider">总互动/评论</h3>
          <span class="p-2 bg-white/20 rounded-lg">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
          </span>
        </div>
        <p class="text-4xl font-bold text-white mt-4">{{ stats.totalInteractions }}</p>
      </div>
    </div>

    <!-- ECharts 数据可视化区 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-96 flex flex-col">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">近七天访问趋势</h3>
        <div class="flex-1 min-h-0 relative">
          <v-chart class="absolute inset-0 w-full h-full" :option="lineChartOption" autoresize />
        </div>
      </div>
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 h-96 flex flex-col">
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">文章分类占比</h3>
        <div class="flex-1 min-h-0 relative">
          <v-chart class="absolute inset-0 w-full h-full" :option="pieChartOption" autoresize />
        </div>
      </div>
    </div>

    <!-- 快捷操作区 -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 border border-gray-100 dark:border-gray-700">
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-6">快捷操作</h3>
      <div class="flex gap-4">
        <button @click="$router.push('/admin/articles/edit')" class="flex flex-col items-center justify-center w-32 h-32 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors border border-dashed border-gray-200 dark:border-gray-600 hover:border-indigo-300">
          <svg class="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          <span class="text-sm font-medium">写新文章</span>
        </button>
        <button @click="$router.push('/admin/articles')" class="flex flex-col items-center justify-center w-32 h-32 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors border border-dashed border-gray-200 dark:border-gray-600 hover:border-emerald-300">
          <svg class="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
          <span class="text-sm font-medium">文章管理</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../../store'
import { computed, ref, onMounted } from 'vue'
import { getDashboardStats } from '../../api/admin'

// 引入 ECharts 核心和组件
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { provide } from 'vue'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
])

const appStore = useAppStore()

// 根据当前主题动态提供 ECharts 主题
provide(THEME_KEY, computed(() => (appStore.theme === 'dark' ? 'dark' : 'light')))

// 真实数据状态
const stats = ref({
  totalArticles: 0,
  totalViews: 0,
  totalInteractions: 0,
  categoryData: [] as any[]
})

onMounted(async () => {
  try {
    const res = await getDashboardStats()
    stats.value = res // 这里修复了：因为 api.get 已经解包了 res.data，所以直接赋值 res
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
})

// 折线图配置 (近七天访问量 Mock 数据)
const lineChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'axis'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: { lineStyle: { color: appStore.theme === 'dark' ? '#4b5563' : '#e5e7eb' } },
    axisLabel: { color: appStore.theme === 'dark' ? '#9ca3af' : '#6b7280' }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: appStore.theme === 'dark' ? '#374151' : '#f3f4f6' } },
    axisLabel: { color: appStore.theme === 'dark' ? '#9ca3af' : '#6b7280' }
  },
  series: [
    {
      name: '阅读量',
      type: 'line',
      smooth: true,
      lineStyle: { width: 3, color: '#6366f1' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(99, 102, 241, 0.4)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0.05)' }
          ]
        }
      },
      data: [12, 5, 23, 14, 30, 45, 10] // TODO: 这里未来可以替换为真实的每天阅读量数据
    }
  ]
}))

// 饼图配置 (使用真实的数据库分类占比数据)
const pieChartOption = computed(() => ({
  backgroundColor: 'transparent',
  tooltip: {
    trigger: 'item'
  },
  legend: {
    bottom: '5%',
    left: 'center',
    textStyle: { color: appStore.theme === 'dark' ? '#d1d5db' : '#374151' }
  },
  series: [
    {
      name: '分类占比',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: appStore.theme === 'dark' ? '#1f2937' : '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 20,
          fontWeight: 'bold',
          color: appStore.theme === 'dark' ? '#fff' : '#000'
        }
      },
      labelLine: { show: false },
      data: stats.value.categoryData.length > 0 ? stats.value.categoryData : [{ value: 0, name: '暂无数据' }]
    }
  ]
}))
</script>