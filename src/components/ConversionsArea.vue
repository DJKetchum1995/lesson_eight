<template>
  <div class="chart-wrapper">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler } from 'chart.js'
import type { ChartOptions } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, LinearScale, CategoryScale, Filler)

interface Metric { month: string; label: string; exceptionRate: number }
const props = defineProps<{ metrics: Metric[]; selected: string }>()

const chartData = computed(() => ({
  labels: props.metrics.map((metric) => metric.label),
  datasets: [
    {
      label: 'Exception Rate',
      data: props.metrics.map((metric) => metric.exceptionRate),
      borderColor: 'rgba(234, 88, 12, 1)',
      backgroundColor: 'rgba(234, 88, 12, 0.14)',
      fill: true,
      pointBackgroundColor: props.metrics.map((metric) =>
        props.selected !== 'all' && props.selected === metric.month ? 'rgba(234, 88, 12, 1)' : 'rgba(234, 88, 12, 1)',
      ),
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
        label: (context) => `${(context.parsed.y ?? 0).toFixed(2)}% exception rate`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: false,
      ticks: {
        callback: (value) => `${Number(value).toFixed(2)}%`,
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
