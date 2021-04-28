<template>
  <div>
    
          <v-row dense justify="center">
            <v-col cols="sm-12">
              <v-card >
                <v-expansion-panels accordion flat>
                  <v-expansion-panel>
                    <v-expansion-panel-header></v-expansion-panel-header>
                    <v-expansion-panel-content>
                      <v-row justify="center">
                        <v-col cols="sm-4 xs-12">
                          <v-select
                            v-model="myLineChartLimit"
                            v-on:change="changeLineChartLimit"
                            :items="dropLimit"
                            label="Datapoints"
                            dense
                            outlined
                          ></v-select>
                        </v-col>
                        <v-col cols="sm-4 xs-12">
                          <v-select
                            v-model="myLineChartPeriod"
                            v-on:change="changeLineChartPeriod"
                            :items="dropTyp"
                            label="Accumulation Period"
                            dense
                            outlined
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-expansion-panel-content>
                  </v-expansion-panel>
                </v-expansion-panels>

           
                <v-tabs v-model="tabs">
             
                  <v-tab href="#Balance"> Balance </v-tab>
      
                 <v-tab href="#Performance"> Performance </v-tab> 

                 <v-tab href="#Performanceflow"> Performanceflow </v-tab> 
                 <v-tab href="#WinLoss"> Win Loss </v-tab> 
                 <v-tab href="#WinLossdistribution"> Win Loss Distribution </v-tab> 
                    <v-tab href="#WinLosspercentile"> WinLosspercentile </v-tab>
               

                  <v-tab-item   id="Balance"> 
                    <v-row dense justify="center">
                      <v-col cols="sm-12 xs-12">
                        <v-card flat>
                          <v-card-text>
                            <line-chart
                              v-if="options.loaded"
                              :chart-data="linedatacollection"
                              :options="lineoptions"
                            ></line-chart
                          ></v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-tab-item>
    <v-tab-item id="Performance">        
           <dashboard-line-performance></dashboard-line-performance>
    </v-tab-item>

   <v-tab-item id="Performanceflow">        
           <dashboard-line-performanceflow></dashboard-line-performanceflow>
    </v-tab-item>

        <v-tab-item id="WinLoss">        
           <dashboard-line-winloss></dashboard-line-winloss>
    </v-tab-item>

        <v-tab-item id="WinLossdistribution">        
           <dashboard-line-winlossdistribution></dashboard-line-winlossdistribution>
    </v-tab-item>
    
        <v-tab-item id="WinLosspercentile">        
           <dashboard-line-winlosspercentile></dashboard-line-winlosspercentile>
    </v-tab-item>

                </v-tabs>
              </v-card>
            </v-col>
          </v-row>
    
  </div>
</template>


<script>
import axios from "axios";

import LineChart from "./LineChart.js";
import DashboardLinePerformance from "./DashboardLinePerformance"
import DashboardLinePerformanceflow from "./DashboardLinePerformanceflow"
import DashboardLineWinloss from "./DashboardLineWinloss"
import DashboardLineWinlossdistribution from "./DashboardLineWinlossdistribution"
import DashboardLineWinlosspercentile from "./DashboardLineWinlosspercentile"

export default {
  components: {
    LineChart,
    DashboardLinePerformance,
    DashboardLineWinloss,
    DashboardLinePerformanceflow,
    DashboardLineWinlosspercentile,
    DashboardLineWinlossdistribution
  },

  name: "Dashboard",
  data() {
    return {
      
      tabs: "Balance",
      myLineChartLimit: 2,
      dropLimit: [3,4,5, 10, 20, 50, 100, 200, 500 , 1000 , 100000],
      myLineChartPeriod: "Day",
      dropTyp: ["Days", "Weeks", "Months", "Years"],
      lineChartLimit: 10,
      lineChartOrder: "day",
      myPrimary: "#fff",
      dailyTradeCount: 0,
      dailySum: -10,
      dailyWinRate: 100,
      weeklyTradeCount: 0,
      weeklySum: 0,
      weeklyWinRate: 0,
      datacollectionweek: null,
      datacollectionday: null,
      chartSum: null,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        loaded: false,
      },
      performanceDatacollection: null,
       performanceoptions: {
        responsive: true,
        maintainAspectRatio: false,
        loaded: false,
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: 50,
                suggestedMax: 100,
                beginAtZero: true,
                bezierCurve: false,
              },
            },
          ],
               },
      },
    
      linedatacollection: null,
      lineoptions: {
        responsive: true,
        maintainAspectRatio: false,
        loaded: false,
        scales: {
          yAxes: [
            {
              ticks: {
                suggestedMin: 50,
                suggestedMax: 100,
                beginAtZero: true,
                bezierCurve: false,
              },
            },
          ],
        },
      },
    };
  },
  computed: {
    cssPrimary() {
      return this.$vuetify.theme.themes[this.$store.getters.usedTheme].blue
        .accent2;
    },
  },
  created() {
    this.interval = setInterval(() => this.getData(), 60000);
  },
  mounted() {
    this.getData();
  },
  methods: {
    reducer(accumulator, currentValue) {
      if (accumulator != undefined && currentValue != undefined) {
        return accumulator + currentValue;
      } else {
        return 0;
      }
    },
    fillData() {
      (this.linedatacollection = {
        labels: this.linechartLabels,
        datasets: [
          {
            backgroundColor: hexToRgbA(
              this.$vuetify.theme.themes[this.$store.getters.usedTheme].blue
                .accent2,
              0.1
            ),

            borderColor: this.$vuetify.theme.themes[
              this.$store.getters.usedTheme
            ].blue.accent2,
            data: this.linechartData,

            label: "Data One",
          },
        ],
      }),
        (this.options.loaded = true);
    },
    changeLineChartPeriod() {
      let settings = this.$store.getters.getSettings;
      settings.Dashboard.LinechartPeriod = this.myLineChartPeriod;
      this.$store.commit("setJournalInfoPopUp", settings);
                    this.$store.commit(
      "dashboard/setDashboardPerformanceUpdate", true
    );
                    this.$store.commit(
      "dashboard/setDashboardWinlossUpdate", true
    );
      this.getData();
    },
    changeLineChartLimit() {
      let settings = this.$store.getters.getSettings;
      settings.Dashboard.LinechartLimit = this.myLineChartLimit;
      this.$store.commit("setJournalInfoPopUp", settings);
                    this.$store.commit(
      "dashboard/setDashboardPerformanceUpdate", true
    );
                       this.$store.commit(
      "dashboard/setDashboardWinlossUpdate", true
    );
      this.getData();
    },
    getData() {
      let settings = this.$store.getters.getSettings;
      axios
        .get("/api/overview", {
          params: {
            options: {
              sender: "Dashboard.vue",
              lineChart: {
                limit: settings.Dashboard.LinechartLimit,
                period: settings.Dashboard.LinechartPeriod,
              },
            },
          },
        })
        .then(
          (response) => {
            // eslint-disable-next-line

            this.dailyTradeCount = response.data.daily.tradeCount;
            this.dailySum = response.data.daily.sum;
            this.dailyWinRate = response.data.daily.winRate;
            this.chartSumWeek = response.data.barChartWeek.map(
              (value) => value.betrag
            );

            this.chartSumDay = response.data.barChartDay.map(
              (value) => value.betrag
            );

            this.linechartData = response.data.lineChartData.map(
              (value) => value.kontostand
            );

            this.linechartLabels = response.data.lineChartData.map(
              (value) => value.label
            );

            this.weeklyTradeCount = response.data.weekly.tradeCount;
            this.weeklySum = response.data.weekly.sum;
            this.weeklyWinRate = response.data.weekly.winRate;
            this.fillData();
          },
          (error) => {
            // eslint-disable-next-line
            console.log(error);
          }
        );
    },
  },
};

function hexToRgbA(hex, trans) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split("");
    if (c.length == 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = "0x" + c.join("");
    return (
      "rgba(" +
      [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(",") +
      ", " +
      trans +
      ")"
    );
  }
  throw new Error("Bad Hex");
}
</script>





