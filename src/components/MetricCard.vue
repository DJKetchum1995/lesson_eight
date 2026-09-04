<template>
  <v-card class="metric-card" :class="tone">
    <div class="metric-card__header">
      <div class="metric-icon" :class="`icon-${tone}`">
        <v-icon :icon="icon" size="22" />
      </div>
      <div class="metric-trend" :class="trendDirection === 'up' ? 'positive' : 'negative'">
        {{ trendDirection === 'up' ? '▲' : '▼' }} {{ Math.abs(trendValue) }}%
      </div>
    </div>

    <div class="metric-card__body">
      <div class="metric-label">{{ label }}</div>
      <div class="metric-value">{{ value }}</div>
      <div class="metric-helper">{{ helperText }}</div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string
    value: string
    helperText: string
    trendValue: number
    trendDirection: 'up' | 'down'
    icon: string
    tone: 'shipment' | 'delivery' | 'exceptions' | 'routes'
  }>(),
  {
    trendDirection: 'up',
  },
)
</script>

<style scoped>
.metric-card {
  position: relative;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96));
  border: 1px solid rgba(148, 163, 184, 0.25);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
  height: 100%;
}

.metric-card::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 4px;
  background: linear-gradient(90deg, #2563eb, #38bdf8);
}

.metric-card.shipment::before {
  background: linear-gradient(90deg, #1d4ed8, #38bdf8);
}

.metric-card.delivery::before {
  background: linear-gradient(90deg, #0f766e, #2dd4bf);
}

.metric-card.exceptions::before {
  background: linear-gradient(90deg, #c2410c, #f97316);
}

.metric-card.routes::before {
  background: linear-gradient(90deg, #7c3aed, #a78bfa);
}

.metric-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 12px;
}

.metric-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.icon-shipment {
  background: linear-gradient(135deg, #2563eb, #60a5fa);
}

.icon-delivery {
  background: linear-gradient(135deg, #0f766e, #2dd4bf);
}

.icon-exceptions {
  background: linear-gradient(135deg, #c2410c, #f97316);
}

.icon-routes {
  background: linear-gradient(135deg, #7c3aed, #a78bfa);
}

.metric-trend {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.74rem;
  font-weight: 700;
}

.metric-trend.positive {
  background: rgba(16, 185, 129, 0.12);
  color: #047857;
}

.metric-trend.negative {
  background: rgba(239, 68, 68, 0.12);
  color: #b91c1c;
}

.metric-card__body {
  padding: 0 18px 18px;
}

.metric-label {
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.metric-value {
  margin-top: 10px;
  font-size: clamp(1.6rem, 2.2vw, 2.2rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  color: #0f172a;
}

.metric-helper {
  margin-top: 8px;
  color: #475569;
  font-size: 0.82rem;
}
</style>
