<template>
  <div>
    <dashboard-stats-filter></dashboard-stats-filter>

<div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="blue">
          <template slot="header">
            <v-icon>mdi-currency-eur</v-icon>
          </template>
          <template slot="content">
            <p class="category">Earnings</p>
            <h3 class="title">{{ stats.earnings }} €</h3>
          </template>
        </vue-stats-card>
      </div>

       <div
        class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="blue">
          <template slot="header">
            <v-icon>mdi-speedometer</v-icon>
          </template>
          <template slot="content">
            <p class="category">Winrate</p>
            <h3 class="title">{{ stats.winrate }} %</h3>
          </template>
        </vue-stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="blue">
          <template slot="header">
            <v-icon>mdi-chart-areaspline-variant</v-icon>
          </template>
          <template slot="content">
            <p class="category">Tradecount</p>
            <h3 class="title">{{ stats.tradecount }}</h3>
          </template>
        </vue-stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="blue">
          <template slot="header">
            <v-icon>mdi-trending-up</v-icon>
          </template>
          <template slot="content">
            <p class="category">biggestwin</p>
            <h3 class="title">{{ stats.biggestwin }} €</h3>
          </template>
        </vue-stats-card>
      </div>
 <div
        class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="blue">
          <template slot="header">
            <v-icon>mdi-trending-down</v-icon>
          </template>
          <template slot="content">
            <p class="category">biggestloss</p>
            <h3 class="title">{{ stats.biggestloss }} €</h3>
          </template>
        </vue-stats-card>
      </div>
       <div
        class="md-layout-item md-medium-size-33 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="blue">
          <template slot="header">
            <v-icon>mdi-swap-vertical-bold</v-icon>
          </template>
          <template slot="content">
            <p class="category">avg</p>
            <h3 class="title">{{ stats.avg }} €</h3>
          </template>
        </vue-stats-card>
      </div>
      </div>
      </div>


   
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import DashboardStatsFilter from "./DashboardStatsFilter";
//import CircleCard from "./../../../components/Circle/CircleCard";
import VueStatsCard from "./../../../components/Cards/VueStatsCard";
export default {
  name: "simple-table",
  components: {
    DashboardStatsFilter,
    VueStatsCard
  },

  data() {
    return {
      stats: {
        earnings: 2000,
        avg: 50,
        tradecount: 12,
        biggestwin: 24,
        biggestloss: 55,
        winrate: 40
      }
    };
  },
  created() {
    this.interval = setInterval(() => this.getData(), 60000);
  },
  mounted() {
    this.getData();
  },

  watch: {
    dashboardStatsUpdate: function() {
      this.getData();
    }
  },
  computed: mapState({
    dashboardStatsUpdate: state => state.dashboard.dashboardStatsUpdate
  }),
  methods: {
    getData() {
      axios
        .get("/api/dashboardStats", {
          params: {
            options: this.$store.state.dashboard.dashboardStatsFilter
          }
        })
        .then(
          response => {
            // eslint-disable-next-line
            this.stats = response.data.stats;
            this.$store.commit("dashboard/setDashboardStatsUpdate", false);
          },
          error => {
            // eslint-disable-next-line
            console.log(error);
          }
        );
    }
  }
};
</script>
<style>
.bigSize {
  font-size: 40px;
}
.mycard {
  width: 350px;
}
</style>
