<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import type { ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

interface Metric { month: string; label: string; revenue: number }
const props = defineProps<{ metrics: Metric[]; selected: string }>()

const chartData = computed(() => ({
  labels: props.metrics.map((metric) => metric.label),
  datasets: [
    {
      label: 'Revenue',
      data: props.metrics.map((metric) => metric.revenue),
      backgroundColor: props.metrics.map((metric) =>
        props.selected !== 'all' && props.selected === metric.month
          ? 'rgba(52, 211, 153, 0.95)'
          : 'rgba(52, 211, 153, 0.55)',
      ),
      borderRadius: 8,
    },
  ],
}))

const chartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { callbacks: { label: (context) => `$${context.parsed.y?.toLocaleString()}` } },
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => `$${Number(value).toLocaleString()}`,
      },
    },
  },
}
</script>

<style scoped>
.chart-wrapper {
  width: 100%;
  height: 100%;
  min-height: 100%;
}
</style>
