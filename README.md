# My dashboard - Project Brief 

## What is this?
A single page analytics dashboard showing monthly business metrics. 
Think Shopify or a simple google analytics view 

## Data 
Generate a fake dataset as a JSON file (src/data/metrics.json)
12 months of data (jan-dec 2025), each month containing:
- revenue (dollar amount, tranding upward with some variation)
- visitors (number, seasonal pattern - higher in summer)
- conversions (percentage, fluctuates between 2-5%)
- orders (numbers, correlates with visitors)

## Layout (Vuetify)
- v-app bar at the top with the dashboard title and a month picker 
- the month picker should default showing all months 
- When a specific month is selected, all cards and charts filter to that month. When "all" is selected show the full year. 
- Below the app bar: a row of 4 summary cards (v-card) showing the key metrics - revnue, visitors, conversions, orders
- Bleow the cards: a row of 2 charts 
- left: bar chart showing monthly revenue 
- right: a line chart showing visitors over time 
- below that: one full with area chart showing conversions trend 
- use v-container, v-row, v-col for responsive grid layout

## interactions 
- month picker in the app bar filters EVERYTHING - Sumaary cards show that months numbers, charts hightlight or filter to that month 
- When "all" is selected, summary card show yearly totals/averages
- cards should show a small up/down arrow or color indicating change from previous month

## style 
- Clean slate color theme
- clean minimal, lots of white space
- charts should use cohesive color palette - not random colors
- mobile responsive - cards stack on smaller screens 

## Tech 
- vue 3 + typescript + vuetify 3
- charts.js via vue-charts for all charts 
- fake data from a local json file (no api calls)
- single page - no routing needed for this app