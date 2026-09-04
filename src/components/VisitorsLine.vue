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

interface Metric { month: string; label: string; onTimeDelivery: number }
const props = defineProps<{ metrics: Metric[]; selected: string }>()

const chartData = computed(() => ({
  labels: props.metrics.map((metric) => metric.label),
  datasets: [
    {
      label: 'On-Time Delivery',
      data: props.metrics.map((metric) => metric.onTimeDelivery),
      borderColor: 'rgba(13, 148, 136, 1)',
      backgroundColor: 'rgba(13, 148, 136, 0.08)',
      pointBackgroundColor: props.metrics.map((metric) =>
        props.selected !== 'all' && props.selected === metric.month ? 'rgba(13, 148, 136, 1)' : 'rgba(13, 148, 136, 1)',
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
        label: (context) => `${Number(context.parsed.y).toFixed(1)}% on time`,
      },
    },
  },
  scales: {
    y: {
      min: 90,
      max: 100,
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
