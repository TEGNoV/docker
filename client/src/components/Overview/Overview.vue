<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-row class="grey lighten-5" style="height: 300px;">
          <v-card class="ma-3 pa-6" outlined tile>{{ dailyTradeCount }}</v-card>

          <v-card class="ma-3 pa-6" outlined tile>{{ dailySum }}</v-card>

          <v-card class="ma-3 pa-6" outlined tile>{{ dailyWinRate }}</v-card>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row justify="center">
          <v-col cols="6" md="2">
            <v-select label="Align"></v-select>
          </v-col>
          <v-col cols="6" md="2">
            <v-select label="Justify"></v-select>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "Overview",
  data() {
    return {
      dailyTradeCount: 0,
      dailySum: -10,
      dailyWinRate: 100
    };
  },
   created() {
    this.interval = setInterval(() => this.getData(), 60000);
  },
  mounted() {
   this.getData()
  },
  methods: {
    getData(){
      
      let settings = this.$store.getters.getSettings
      axios
        .get("/api/overview", {
          params: {
            options: {
              sender: "Overview.vue",
              lineChart: {
                
                limit: settings.Dashboard.LinechartLimit,
                order: this.lineChartOrder
              }
            }
          }
        }).then(
      response => {
        // eslint-disable-next-line
        this.dailyTradeCount = response.data.daily.tradeCount
        this.dailySum = response.data.daily.sum
        this.dailyWinRate = response.data.daily.winRate
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
