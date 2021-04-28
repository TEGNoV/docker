<template>
  <div>
    <v-row justify="center">
      <v-col cols="sm-12 xs-12">
        <v-card flat>
          <v-card-text>
            <line-chart
              v-if="options.loaded"
              :chart-data="performanceDatacollection"
              :options="performanceoptions"
            ></line-chart
          ></v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import axios from "axios";
import { mapState } from "vuex";
import LineChart from "./LineChart.js";

export default {
  components: {
    LineChart,
  },

  name: "Dashboard",
  data() {
    return {
      tabs: "Balance",
      myLineChartLimit: 2,
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
    };
  },

  created() {
    this.interval = setInterval(() => this.getData(), 60000);
  },
  mounted() {
    this.getData();
  },
    computed: mapState({
       cssPrimary() {
      return this.$vuetify.theme.themes[this.$store.getters.usedTheme].blue
        .accent2;
    },
    updateNeeded: (state) => state.dashboard.dashupdates.performance,
  }),
  

  watch: {
    updateNeeded: function () {
      if (this.$store.state.dashboard.dashupdates.performance != null) {
        this.getData();
      }
    },
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
      (this.performanceDatacollection = {
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
        .get("/api/getPerformanceLine", {
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
                this.$store.commit(
      "dashboard/setDashboardPerformanceUpdate", false
    );
            // eslint-disable-next-line
            this.linechartData = response.data.lineChartData.map(
              (value) => value.agg
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





