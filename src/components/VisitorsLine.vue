<template>
  <div class="chart-wrapper">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale } from 'chart.js'
import type { ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale)

interface Metric { month: string; label: string; visitors: number }
const props = defineProps<{ metrics: Metric[]; selected: string }>()

const chartData = computed(() => ({
  labels: props.metrics.map((metric) => metric.label),
  datasets: [
    {
      label: 'Visitors',
      data: props.metrics.map((metric) => metric.visitors),
      borderColor: 'rgba(93, 58, 46, 1)',
      backgroundColor: 'rgba(93, 58, 46, 0.06)',
      pointBackgroundColor: props.metrics.map((metric) =>
        props.selected !== 'all' && props.selected === metric.month ? 'rgba(93, 58, 46, 1)' : 'rgba(93, 58, 46, 1)',
      ),
      pointRadius: 4,
      fill: false,
      tension: 0.35,
    },
  ],
}))

const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${Number(context.parsed.y).toLocaleString()} visitors`,
      },
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (value) => Number(value).toLocaleString(),
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
