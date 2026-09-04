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

interface Metric { month: string; label: string; shipmentVolume: number }
const props = defineProps<{ metrics: Metric[]; selected: string }>()

const chartData = computed(() => ({
  labels: props.metrics.map((metric) => metric.label),
  datasets: [
    {
      label: 'Shipment Volume',
      data: props.metrics.map((metric) => metric.shipmentVolume),
      backgroundColor: props.metrics.map((metric) =>
        props.selected !== 'all' && props.selected === metric.month
          ? 'rgba(37, 99, 235, 0.95)'
          : 'rgba(96, 165, 250, 0.65)',
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
    tooltip: { callbacks: { label: (context) => `${context.parsed.y?.toLocaleString()} shipments` } },
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
