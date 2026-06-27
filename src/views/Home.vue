<template>
  <div class="home-page">
    <v-app-bar flat color="white" elevation="1">
      <v-toolbar-title>My Dashboard</v-toolbar-title>
      <v-spacer />
      <v-select
        v-model="selected"
        :items="monthOptions"
        item-title="label"
        item-value="value"
        density="comfortable"
        hide-details
        label="Month"
        class="month-picker"
      />
    </v-app-bar>

    <v-container fluid class="dashboard-shell">
      <section class="dashboard-header">
        <div>
          <div class="dashboard-label">Analytics dashboard</div>
          <h1>{{ selectedLabel }}</h1>
          <p class="dashboard-copy">Clean monthly performance for revenue, visitors, conversions, and orders.</p>
        </div>
      </section>

      <v-row dense class="summary-row">
        <v-col cols="12" md="3" v-for="card in summaryCards" :key="card.title">
          <v-card elevation="1" class="metric-card">
            <v-card-text>
              <div class="metric-title">{{ card.title }}</div>
              <div class="metric-value">{{ card.value }}</div>
              <div class="metric-note">{{ card.note }}</div>
            </v-card-text>
            <v-card-actions>
              <div :class="['metric-change', card.changeDirection]">
                <span>{{ card.arrow }}</span>
                <span>{{ card.changeText }}</span>
              </div>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense class="charts-row">
        <v-col cols="12">
          <v-card elevation="1" class="charts-pair-card">
            <v-card-text class="charts-pair-body">
              <v-row dense class="charts-pair-inner">
                <v-col cols="12" md="6">
                  <v-card elevation="0" class="chart-card small-card">
                    <v-card-title class="chart-title">Monthly revenue</v-card-title>
                    <v-card-text class="chart-body">
                      <RevenueBar :metrics="metrics" :selected="selected" />
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card elevation="0" class="chart-card small-card">
                    <v-card-title class="chart-title">Visitors over time</v-card-title>
                    <v-card-text class="chart-body">
                      <VisitorsLine :metrics="metrics" :selected="selected" />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12">
          <v-card elevation="1" class="chart-card full-width-chart">
            <v-card-title class="chart-title">Conversion trend</v-card-title>
            <v-card-text class="chart-body">
              <ConversionsArea :metrics="metrics" :selected="selected" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import RevenueBar from '../components/RevenueBar.vue'
import VisitorsLine from '../components/VisitorsLine.vue'
import ConversionsArea from '../components/ConversionsArea.vue'
import rawMetrics from '../data/metrics.json'

interface Metric {
  month: string
  label: string
  revenue: number
  visitors: number
  conversions: number
  orders: number
}

const metrics = rawMetrics as Metric[]
const selected = ref('all')

const monthOptions = computed(() => [
  { value: 'all', label: 'All months' },
  ...metrics.map((metric) => ({ value: metric.month, label: metric.label })),
])

const selectedLabel = computed(() => {
  if (selected.value === 'all') return 'Annual performance'
  const record = metrics.find((metric) => metric.month === selected.value)
  return record ? `${record.label} 2025 overview` : 'Annual performance'
})

const selectedIndex = computed(() => {
  if (selected.value === 'all') return metrics.length - 1
  return metrics.findIndex((metric) => metric.month === selected.value)
})

const selectedMetric = computed(() => {
  if (selected.value === 'all') return metrics[metrics.length - 1]
  return metrics.find((metric) => metric.month === selected.value) ?? metrics[metrics.length - 1]
})

const previousMetric = computed(() => {
  const index = selectedIndex.value - 1
  return index >= 0 ? metrics[index] : selectedMetric.value
})

const totalRevenue = computed(() => metrics.reduce((sum, metric) => sum + metric.revenue, 0))
const totalVisitors = computed(() => metrics.reduce((sum, metric) => sum + metric.visitors, 0))
const averageConversions = computed(() => metrics.reduce((sum, metric) => sum + metric.conversions, 0) / metrics.length)
const totalOrders = computed(() => metrics.reduce((sum, metric) => sum + metric.orders, 0))

function formatDollar(value: number) {
  return `$${value.toLocaleString('en-US')}`
}

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

const revenueChange = computed(() => changeScore(selectedMetric.value.revenue, previousMetric.value.revenue))
const visitorsChange = computed(() => changeScore(selectedMetric.value.visitors, previousMetric.value.visitors))
const conversionsChange = computed(() => changeScore(selectedMetric.value.conversions, previousMetric.value.conversions))
const ordersChange = computed(() => changeScore(selectedMetric.value.orders, previousMetric.value.orders))

const summaryCards = computed(() => [
  {
    title: 'Revenue',
    value: selected.value === 'all' ? formatDollar(totalRevenue.value) : formatDollar(selectedMetric.value.revenue),
    note: selected.value === 'all' ? 'Yearly revenue' : `${selectedMetric.value.label} revenue`,
    arrow: revenueChange.value >= 0 ? '▲' : '▼',
    changeText: `${Math.abs(revenueChange.value)}% vs prior month`,
    changeDirection: revenueChange.value >= 0 ? 'up' : 'down',
  },
  {
    title: 'Visitors',
    value: selected.value === 'all' ? formatNumber(totalVisitors.value) : formatNumber(selectedMetric.value.visitors),
    note: selected.value === 'all' ? 'Yearly visitors' : `${selectedMetric.value.label} visitors`,
    arrow: visitorsChange.value >= 0 ? '▲' : '▼',
    changeText: `${Math.abs(visitorsChange.value)}% vs prior month`,
    changeDirection: visitorsChange.value >= 0 ? 'up' : 'down',
  },
  {
    title: 'Conversions',
    value: selected.value === 'all' ? formatPercent(averageConversions.value) : formatPercent(selectedMetric.value.conversions),
    note: selected.value === 'all' ? 'Average conversion rate' : `${selectedMetric.value.label} conversion rate`,
    arrow: conversionsChange.value >= 0 ? '▲' : '▼',
    changeText: `${Math.abs(conversionsChange.value)}% vs prior month`,
    changeDirection: conversionsChange.value >= 0 ? 'up' : 'down',
  },
  {
    title: 'Orders',
    value: selected.value === 'all' ? formatNumber(totalOrders.value) : formatNumber(selectedMetric.value.orders),
    note: selected.value === 'all' ? 'Yearly orders' : `${selectedMetric.value.label} orders`,
    arrow: ordersChange.value >= 0 ? '▲' : '▼',
    changeText: `${Math.abs(ordersChange.value)}% vs prior month`,
    changeDirection: ordersChange.value >= 0 ? 'up' : 'down',
  },
])
</script>
