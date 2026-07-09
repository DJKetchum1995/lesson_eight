<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Welcome to My Dashboard</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <SampleChart />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import SampleChart from '../components/SampleChart.vue'
</script>
