<template>
  <div>
    <v-row dense> 
      <v-col cols="lg-12 md-12 sm-12 xs-12">
        <v-card>
          <v-row justify="center" dense>
            <v-col cols="sm-11 xs-11">
              <v-card flat>
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
                <v-row justify="center">
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
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import axios from "axios";

import LineChart from "./LineChart.js";

export default {
  components: {
    LineChart,
  },

  name: "Dashboard",
  data() {
    return {
      myLineChartLimit: 5,
      dropLimit: [5, 10, 20, 50],
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
              0
            ),

            borderColor: this.$vuetify.theme.themes[
              this.$store.getters.usedTheme
            ].blue.accent2,
            data: this.balance,

            label: "Data One",
          },
           {
               backgroundColor: hexToRgbA(
              this.$vuetify.theme.themes[this.$store.getters.usedTheme].blue
                .accent2,
              0
            ),

            borderColor: '#14274e',
            data: this.t1,

            label: "Data two",
          },
                 {
            
   backgroundColor: hexToRgbA(
              this.$vuetify.theme.themes[this.$store.getters.usedTheme].blue
                .accent2,
              0
            ),
            borderColor: '#9ba4b4',
            data: this.t2,

            label: "Data two",
          },
        ],
      }),
        (this.options.loaded = true);
    },
    changeLineChartPeriod() {
      let settings = this.$store.getters.getSettings;
      settings.Dashboard.LinechartPeriod = this.myLineChartPeriod;
      this.$store.commit("setJournalInfoPopUp", settings);
      this.getData();
    },
    changeLineChartLimit() {
      let settings = this.$store.getters.getSettings;
      settings.Dashboard.LinechartLimit = this.myLineChartLimit;
      this.$store.commit("setJournalInfoPopUp", settings);
      this.getData();
    },
    getData() {
      let settings = this.$store.getters.getSettings;
      axios
        .get("/api/getTargetChart", {
          params: {
            options: {
              sender: "Dashboard.vue",
              lineChart: {
                limit: this.myLineChartLimit,
                period: settings.Dashboard.LinechartPeriod,
              },
            },
          },
        })
        .then(
          (response) => {
            // eslint-disable-next-line

   

            this.balance = response.data.lineChartData.map(
              (value) => value.kontostand
            );

            this.t1 = response.data.lineChartData.map(
              (value) => value.t1
            );
            this.t2 = response.data.lineChartData.map(
              (value) => value.t2
            );
            this.linechartLabels = response.data.lineChartData.map(
              (value) => value.label
            );

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





