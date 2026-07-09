<template>
  <div class="home-page">
    <v-app-bar flat elevation="0">
      <div class="topnav" style="width:100%">
        <div class="brand">
          <div class="brand-mark">A</div>
          <div class="brand-text">
            <h1>Analytics Overview</h1>
            <p>Business performance dashboard</p>
          </div>
        </div>

        <div class="nav-controls">
          <v-select
            v-model="selected"
            :items="monthOptions"
            item-title="label"
            item-value="value"
            density="comfortable"
            hide-details
            class="month-select month-picker"
            :menu-props="{ maxHeight: '260' }"
            style="width:160px; font-size:13px"
          />

          <button class="export-btn">Export</button>
        </div>
      </div>
    </v-app-bar>

    <v-container fluid class="dashboard-shell">
      <section class="dashboard-header">
        <div>
          <div class="dashboard-label">Analytics dashboard</div>
          <h1>{{ selectedLabel }}</h1>
          <p class="dashboard-copy">Clean monthly performance for revenue, visitors, conversions, and orders.</p>
        </div>
      </section>

      <div class="cards">
        <div class="card" v-for="card in summaryCards" :key="card.title">
          <div class="card-top">
            <div :class="['card-icon', 'icon-' + card.className.replace('-card','')]">
              <template v-if="card.className==='revenue-card'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </template>
              <template v-else-if="card.className==='visitors-card'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              </template>
              <template v-else-if="card.className==='conversions-card'">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              </template>
              <template v-else>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2l1.5 5h9L18 2"/>
                  <path d="M3.5 7h17l-1.6 12a2 2 0 0 1-2 1.8H7.1a2 2 0 0 1-2-1.8L3.5 7z"/>
                  <line x1="9" y1="11" x2="9" y2="15"/>
                  <line x1="15" y1="11" x2="15" y2="15"/>
                </svg>
              </template>
            </div>
            <div :class="['card-delta', card.changeDirection==='up' ? 'delta-up' : 'delta-down']">{{ card.changeDirection==='up' ? '▲' : '▼' }} {{ Math.abs(Number(card.changeText.split('%')[0])) }}%</div>
          </div>
          <div>
            <div class="card-label">{{ card.title }}</div>
            <div class="card-value">{{ card.value }}</div>
          </div>
          <div class="card-sub">{{ card.note }}</div>
        </div>
      </div>

      <div class="charts">
        <div class="panel revenue-panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">Monthly Revenue</div>
              <div class="panel-subtitle">Jan – Dec, current year</div>
            </div>
          </div>
          <div class="panel-canvas-wrap">
            <div style="width:100%;height:100%"><RevenueBar :metrics="metrics" :selected="selected" /></div>
          </div>
        </div>

        <div class="pair-row">
          <div class="panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">Visitors Over Time</div>
                <div class="panel-subtitle">Unique site visits</div>
              </div>
            </div>
            <div class="panel-canvas-wrap">
              <div style="width:100%;height:100%"><VisitorsLine :metrics="metrics" :selected="selected" /></div>
            </div>
          </div>

          <div class="panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">Conversion Trend</div>
                <div class="panel-subtitle">Visits to purchase %</div>
              </div>
            </div>
            <div class="panel-canvas-wrap">
              <div style="width:100%;height:100%"><ConversionsArea :metrics="metrics" :selected="selected" /></div>
            </div>
          </div>
        </div>
      </div>
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
    className: 'revenue-card',
    value: selected.value === 'all' ? formatDollar(totalRevenue.value) : formatDollar(selectedMetric.value.revenue),
    note: selected.value === 'all' ? 'Yearly revenue' : `${selectedMetric.value.label} revenue`,
    arrow: revenueChange.value >= 0 ? '▲' : '▼',
    changeText: `${Math.abs(revenueChange.value)}% vs prior month`,
    changeDirection: revenueChange.value >= 0 ? 'up' : 'down',
  },
  {
    title: 'Visitors',
    className: 'visitors-card',
    value: selected.value === 'all' ? formatNumber(totalVisitors.value) : formatNumber(selectedMetric.value.visitors),
    note: selected.value === 'all' ? 'Yearly visitors' : `${selectedMetric.value.label} visitors`,
    arrow: visitorsChange.value >= 0 ? '▲' : '▼',
    changeText: `${Math.abs(visitorsChange.value)}% vs prior month`,
    changeDirection: visitorsChange.value >= 0 ? 'up' : 'down',
  },
  {
    title: 'Conversions',
    className: 'conversions-card',
    value: selected.value === 'all' ? formatPercent(averageConversions.value) : formatPercent(selectedMetric.value.conversions),
    note: selected.value === 'all' ? 'Average conversion rate' : `${selectedMetric.value.label} conversion rate`,
    arrow: conversionsChange.value >= 0 ? '▲' : '▼',
    changeText: `${Math.abs(conversionsChange.value)}% vs prior month`,
    changeDirection: conversionsChange.value >= 0 ? 'up' : 'down',
  },
  {
    title: 'Orders',
    className: 'orders-card',
    value: selected.value === 'all' ? formatNumber(totalOrders.value) : formatNumber(selectedMetric.value.orders),
    note: selected.value === 'all' ? 'Yearly orders' : `${selectedMetric.value.label} orders`,
    arrow: ordersChange.value >= 0 ? '▲' : '▼',
    changeText: `${Math.abs(ordersChange.value)}% vs prior month`,
    changeDirection: ordersChange.value >= 0 ? 'up' : 'down',
  },
])
</script>
