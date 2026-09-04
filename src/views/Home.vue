<template>
  <div class="home-page">
    <v-app-bar flat elevation="0">
      <div class="topnav">
        <div class="brand">
          <div class="brand-mark">F</div>
          <div class="brand-text">
            <h1>FastForward Logistics Dashboard</h1>
          </div>
        </div>

        <div class="nav-controls">
          <v-select
            v-model="selectedRegion"
            :items="regionOptions"
            item-title="title"
            item-value="value"
            density="comfortable"
            hide-details
            class="filter-select"
            variant="outlined"
            bg-color="white"
            :menu-props="{ maxHeight: '260' }"
          />

          <v-select
            v-model="selectedMonth"
            :items="monthOptions"
            item-title="label"
            item-value="value"
            density="comfortable"
            hide-details
            class="filter-select"
            variant="outlined"
            bg-color="white"
            :menu-props="{ maxHeight: '260' }"
          />

          <v-btn class="export-btn" size="small" variant="flat">Export</v-btn>
        </div>
      </div>
    </v-app-bar>

    <v-container fluid class="dashboard-shell">
      <section class="dashboard-header">
        <div>
          <div class="dashboard-label">Operations overview</div>
          <h2>{{ selectedLabel }}</h2>
          <p class="dashboard-copy">Leadership snapshot for shipment throughput, on-time delivery, network performance, and exception management.</p>
        </div>
        <v-chip color="primary" variant="tonal" class="status-chip">
          {{ selectedRegionLabel }} · {{ selectedMonthLabel }}
        </v-chip>
      </section>

      <div class="cards">
        <MetricCard
          v-for="card in summaryCards"
          :key="card.title"
          :label="card.title"
          :value="card.value"
          :helper-text="card.helper"
          :trend-value="card.trendValue"
          :trend-direction="card.trendDirection"
          :icon="card.icon"
          :tone="card.tone"
        />
      </div>

      <div class="charts">
        <div class="panel revenue-panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">Monthly Shipment Volume</div>
              <div class="panel-subtitle">Jan – Dec, current year</div>
            </div>
          </div>
          <div class="panel-canvas-wrap">
            <RevenueBar :metrics="shipmentChartMetrics" :selected="selectedMonth" />
          </div>
        </div>

        <div class="pair-row">
          <div class="panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">On-Time Delivery Trend</div>
                <div class="panel-subtitle">Current network delivery performance</div>
              </div>
            </div>
            <div class="panel-canvas-wrap">
              <VisitorsLine :metrics="deliveryChartMetrics" :selected="selectedMonth" />
            </div>
          </div>

          <div class="panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">Exception Rate Trend</div>
                <div class="panel-subtitle">Open exceptions as a share of volume</div>
              </div>
            </div>
            <div class="panel-canvas-wrap">
              <ConversionsArea :metrics="exceptionChartMetrics" :selected="selectedMonth" />
            </div>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MetricCard from '../components/MetricCard.vue'
import RevenueBar from '../components/RevenueBar.vue'
import VisitorsLine from '../components/VisitorsLine.vue'
import ConversionsArea from '../components/ConversionsArea.vue'
import rawMetrics from '../data/metrics.json'

interface RegionSnapshot {
  shipmentVolume: number
  onTimeDelivery: number
  openExceptions: number
  activeRoutes: number
}

interface Metric {
  month: string
  label: string
  shipmentVolume: number
  onTimeDelivery: number
  openExceptions: number
  activeRoutes: number
  exceptionTypes: Record<string, number>
  regionalPerformance: Record<string, RegionSnapshot>
}

const metrics = rawMetrics as Metric[]
const selectedMonth = ref('all')
const selectedRegion = ref('all')

const regionOptions = computed(() => [
  { value: 'all', title: 'All regions' },
  { value: 'Northeast', title: 'Northeast' },
  { value: 'Southeast', title: 'Southeast' },
  { value: 'Midwest', title: 'Midwest' },
  { value: 'Southwest', title: 'Southwest' },
  { value: 'West', title: 'West' },
])

const monthOptions = computed(() => [
  { value: 'all', label: 'All months' },
  ...metrics.map((metric) => ({ value: metric.month, label: metric.label })),
])

const selectedRegionLabel = computed(() => (selectedRegion.value === 'all' ? 'All regions' : selectedRegion.value))
const selectedMonthLabel = computed(() => {
  if (selectedMonth.value === 'all') return 'YTD'
  const month = metrics.find((item) => item.month === selectedMonth.value)
  return month ? month.label : 'YTD'
})

const selectedLabel = computed(() => {
  if (selectedMonth.value === 'all') {
    return selectedRegion.value === 'all' ? 'Annual operations overview' : `${selectedRegion.value} annual operations overview`
  }
  const current = metrics.find((item) => item.month === selectedMonth.value)
  return current ? `${current.label} ${selectedRegion.value === 'all' ? 'network overview' : `${selectedRegion.value} operations`}` : 'Operations overview'
})

function getRegionSnapshot(metric: Metric): RegionSnapshot {
  if (selectedRegion.value === 'all') {
    return {
      shipmentVolume: metric.shipmentVolume,
      onTimeDelivery: metric.onTimeDelivery,
      openExceptions: metric.openExceptions,
      activeRoutes: metric.activeRoutes,
    }
  }

  return metric.regionalPerformance[selectedRegion.value] ?? metric.regionalPerformance.Northeast
}

const selectedMetric = computed(() => {
  const current = selectedMonth.value === 'all' ? metrics[metrics.length - 1] : metrics.find((metric) => metric.month === selectedMonth.value) ?? metrics[metrics.length - 1]
  return getRegionSnapshot(current)
})

const previousMetric = computed(() => {
  if (selectedMonth.value !== 'all') {
    const index = metrics.findIndex((metric) => metric.month === selectedMonth.value)
    const previous = index > 0 ? metrics[index - 1] : metrics[0]
    return getRegionSnapshot(previous)
  }

  const previous = metrics[metrics.length - 2] ?? metrics[metrics.length - 1]
  return getRegionSnapshot(previous)
})

const shipmentChartMetrics = computed(() =>
  metrics.map((metric) => {
    const regionData = getRegionSnapshot(metric)
    return {
      month: metric.month,
      label: metric.label,
      shipmentVolume: regionData.shipmentVolume,
    }
  }),
)

const deliveryChartMetrics = computed(() =>
  metrics.map((metric) => {
    const regionData = getRegionSnapshot(metric)
    return {
      month: metric.month,
      label: metric.label,
      onTimeDelivery: regionData.onTimeDelivery,
    }
  }),
)

const exceptionChartMetrics = computed(() =>
  metrics.map((metric) => {
    const regionData = getRegionSnapshot(metric)
    const exceptionRate = regionData.shipmentVolume ? (regionData.openExceptions / regionData.shipmentVolume) * 100 : 0
    return {
      month: metric.month,
      label: metric.label,
      exceptionRate: Number(exceptionRate.toFixed(2)),
    }
  }),
)

const totalShipmentVolume = computed(() => shipmentChartMetrics.value.reduce((sum, metric) => sum + metric.shipmentVolume, 0))
const totalOpenExceptions = computed(() => metrics.reduce((sum, metric) => sum + getRegionSnapshot(metric).openExceptions, 0))
const averageOnTime = computed(() => {
  const total = deliveryChartMetrics.value.reduce((sum, metric) => sum + metric.onTimeDelivery, 0)
  return total / deliveryChartMetrics.value.length
})
const currentRoutes = computed(() => selectedMetric.value.activeRoutes)

function formatNumber(value: number) {
  return value.toLocaleString('en-US')
}

function formatPercent(value: number) {
  return `${value.toFixed(1)}%`
}

function changeScore(current: number, previous: number) {
  if (previous === 0) return 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

const shipmentChange = computed(() => changeScore(selectedMetric.value.shipmentVolume, previousMetric.value.shipmentVolume))
const deliveryChange = computed(() => changeScore(selectedMetric.value.onTimeDelivery, previousMetric.value.onTimeDelivery))
const exceptionsChange = computed(() => changeScore(selectedMetric.value.openExceptions, previousMetric.value.openExceptions))
const routesChange = computed(() => changeScore(selectedMetric.value.activeRoutes, previousMetric.value.activeRoutes))

const summaryCards = computed<Array<{
  title: string
  tone: 'shipment' | 'delivery' | 'exceptions' | 'routes'
  icon: string
  value: string
  helper: string
  trendValue: number
  trendDirection: 'up' | 'down'
}>>(() => [
  {
    title: 'Shipment Volume',
    tone: 'shipment',
    icon: 'mdi-truck-fast',
    value: selectedMonth.value === 'all' ? formatNumber(totalShipmentVolume.value) : formatNumber(selectedMetric.value.shipmentVolume),
    helper: selectedMonth.value === 'all' ? 'Total shipments year to date' : `${selectedMonthLabel} shipment volume`,
    trendValue: Math.abs(shipmentChange.value),
    trendDirection: shipmentChange.value >= 0 ? 'up' : 'down',
  },
  {
    title: 'On-Time Delivery Rate',
    tone: 'delivery',
    icon: 'mdi-clock-check-outline',
    value: selectedMonth.value === 'all' ? formatPercent(averageOnTime.value) : formatPercent(selectedMetric.value.onTimeDelivery),
    helper: selectedMonth.value === 'all' ? 'Average on-time performance' : `${selectedMonthLabel} delivery rate`,
    trendValue: Math.abs(deliveryChange.value),
    trendDirection: deliveryChange.value >= 0 ? 'up' : 'down',
  },
  {
    title: 'Open Exceptions',
    tone: 'exceptions',
    icon: 'mdi-alert-circle-outline',
    value: selectedMonth.value === 'all' ? formatNumber(totalOpenExceptions.value) : formatNumber(selectedMetric.value.openExceptions),
    helper: selectedMonth.value === 'all' ? 'YTD exception count' : `${selectedMonthLabel} open exceptions`,
    trendValue: Math.abs(exceptionsChange.value),
    trendDirection: exceptionsChange.value <= 0 ? 'up' : 'down',
  },
  {
    title: 'Active Routes',
    tone: 'routes',
    icon: 'mdi-map-marker-path',
    value: formatNumber(currentRoutes.value),
    helper: selectedMonth.value === 'all' ? 'Current active network routes' : `${selectedMonthLabel} active routes`,
    trendValue: Math.abs(routesChange.value),
    trendDirection: routesChange.value >= 0 ? 'up' : 'down',
  },
])
</script>

