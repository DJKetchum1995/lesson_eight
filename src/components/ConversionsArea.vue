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

interface Metric { month: string; label: string; conversions: number }
const props = defineProps<{ metrics: Metric[]; selected: string }>()

const chartData = computed(() => ({
  labels: props.metrics.map((metric) => metric.label),
  datasets: [
    {
      label: 'Conversion Rate',
      data: props.metrics.map((metric) => metric.conversions),
      borderColor: 'rgba(178, 140, 216, 1)',
      backgroundColor: 'rgba(178, 140, 216, 0.14)',
      fill: true,
      pointBackgroundColor: props.metrics.map((metric) =>
        props.selected !== 'all' && props.selected === metric.month ? 'rgba(178, 140, 216, 1)' : 'rgba(178, 140, 216, 1)',
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
        label: (context) => `${context.parsed.y}%`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${Number(value).toFixed(1)}%`,
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
