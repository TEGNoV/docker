<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="green">
          <template slot="header">
            <md-icon>Day</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total  {{ day.total }} €</p>
            <p class="category">Max Risk  {{ day.maxRisk }} €</p>
            <risk-pie-chart
              v-if="loaded"
              :chart-data="chartDataDay"
              :options="optionsDay"
            >
              ></risk-pie-chart
            >
          </template>
          <template slot="content"> </template>

          <template slot="footer">
            <div class="stats">
              <v-icon>mdi-date-range</v-icon>
              Last 24 Hours
            </div>
          </template>
        </vue-stats-card>
      </div>


            <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="green">
          <template slot="header">
            <md-icon>Week</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total  {{ week.total }} €</p>
            <p class="category">Max Risk  {{ week.maxRisk }} €</p>
            
            <risk-pie-chart
              v-if="loaded"
              :chart-data="chartDataWeek"
              :options="optionsWeek"
            >
              ></risk-pie-chart
            >
          </template>
          <template slot="content"> </template>

          <template slot="footer">
            <div class="stats">
              <v-icon>mdi-date-range</v-icon>
              Last 24 Hours
            </div>
          </template>
        </vue-stats-card>
      </div>


            <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="green">
          <template slot="header">
            <md-icon>Month</md-icon>
          </template>

          <template slot="content">
             <p class="category">Total  {{ month.total }} €</p>
            <p class="category">Max Risk  {{ month.maxRisk }} €</p>
            <risk-pie-chart
              v-if="loaded"
              :chart-data="chartDataMonth"
              :options="optionsMonth"
            >
              ></risk-pie-chart
            >
          </template>
          <template slot="content"> </template>

          <template slot="footer">
            <div class="stats">
              <v-icon>mdi-date-range</v-icon>
              Last 24 Hours
            </div>
          </template>
        </vue-stats-card>
      </div>

    </div>
    
  </div>
</template>


<script>
import axios from "axios";
import VueStatsCard from "./../../../components/Cards/VueStatsCard";
import RiskPieChart from "./RiskPieChart";
export default {
  name: "simple-table",
  components: {
    VueStatsCard,
    RiskPieChart,
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      day: {
        maxRisk: 10,
        total: 1
      },
      week: {
        maxRisk: 10,
        total: 1
      },
      month: {
        maxRisk: 10,
        total: 1
      },
      loaded: false,
      chartDataDay: {
        labels: [
          "Lost", // Lost
          "Availible", // Availible to lose  -  ( Win + Max Lose ) - ( Open Risk + Lost )
          "Open", // Open Risk
          "Win", // Win
          "Over Budget",
        ],
        datasets: [
          {
            label: "My First Dataset",
            data: [500, 50, 100],
            backgroundColor: [
              "#FF0000",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "#008000",
              "#8B0000",
            ],
            hoverOffset: 4,
          },
        ],
      },
      optionsDay: {
        legend: {
          display: false,
        },
      },

 chartDataWeek: {
        labels: [
          "Lost", // Lost
          "Availible", // Availible to lose  -  ( Win + Max Lose ) - ( Open Risk + Lost )
          "Open", // Open Risk
          "Win", // Win
          "Over Budget",
        ],
        datasets: [
          {
            label: "My First Dataset",
            data: [500, 50, 100],
            backgroundColor: [
              "#FF0000",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "#008000",
              "#8B0000",
            ],
            hoverOffset: 4,
          },
        ],
      },
      optionsWeek: {
        legend: {
          display: false,
        },
      },
 chartDataMonth: {
        labels: [
          "Lost", // Lost
          "Availible", // Availible to lose  -  ( Win + Max Lose ) - ( Open Risk + Lost )
          "Open", // Open Risk
          "Win", // Win
          "Over Budget",
        ],
        datasets: [
          {
            label: "My First Dataset",
            data: [500, 50, 100],
            backgroundColor: [
              "#FF0000",
              "rgb(54, 162, 235)",
              "rgb(255, 205, 86)",
              "#008000",
              "#8B0000",
            ],
            hoverOffset: 4,
          },
        ],
      },
      optionsMonth: {
        legend: {
          display: false,
        },
      },
      
      emailsSubscriptionChart: {
        data: {
          labels: [
            "Ja",
            "Fe",
            "Ma",
            "Ap",
            "Mai",
            "Ju",
            "Jul",
            "Au",
            "Se",
            "Oc",
            "No",
            "De",
          ],
          series: [
            [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895],
          ],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 1000,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },
      color: {
        current: "#ffa07a",
      },
      risk: {
        allowedLose: 50,
        openRisk: 25,
        current: 10,
      },
      perc_allowed: "50%",
      perc_open: "20%",
      perc_current: "30%",
    };
  },
  created() {
    this.interval = setInterval(() => this.getData(), 60000);
  },
  mounted() {
    this.getData();
  },
  methods: {
    calculatePercent() {
      let total =
        this.risk.allowedLose + this.risk.openRisk + this.risk.current;
      this.perc_allowed = (this.risk.allowedLose / total) * 100;
      this.perc_allowed = this.perc_allowed + "%";

      this.perc_open = (this.risk.openRisk / total) * 100;
      this.perc_open = this.perc_open + "%";

      this.perc_current = (this.risk.current / total) * 100;
      this.perc_current = this.perc_current + "%";
    },
    getData() {
      axios.get("/api/getDayRisk").then(
        (response) => {
          // eslint-disable-next-line
          this.day = response.data.chartDataDay;
          console.log(response.data.chartDataDay)
          this.chartDataDay.datasets[0].data =
            response.data.chartDataDay.chartdata;

                    this.month = response.data.chartDataMonth;
          this.chartDataMonth.datasets[0].data =
            response.data.chartDataMonth.chartdata;

                      this.week = response.data.chartDataWeek;
          this.chartDataWeek.datasets[0].data =
            response.data.chartDataWeek.chartdata;


          if (this.risk.current > 0) {
            this.color.current = "#BCED91	";
          }

          this.loaded = true;
        },
        (error) => {
          // eslint-disable-next-line
          console.log(error);
        }
      );
      this.calculatePercent();
    },
  },
};
</script>

<style>
.text {
  font-weight: bold;
}

.myText {
}
</style>
