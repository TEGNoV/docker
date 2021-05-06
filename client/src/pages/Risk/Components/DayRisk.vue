<template>
  <div class="content">
      <div class="md-layout">
     <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="green">
          <template slot="header">
            <md-icon>store</md-icon>
          </template>

          <template slot="content">
            <p class="category">Week</p>
            <h3 class="title">$34,245</h3>
          </template>

          <template slot="content">
            <p class="category">Revenue</p>
            <h3 class="title">$34,245</h3>
             <risk-pie-chart v-if="loaded"        
                    :chart-data="chartDataDay"
                    :options="optionsDay">
             ></risk-pie-chart>
          </template>

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
            <md-icon>store</md-icon>
          </template>

          <template slot="content">
            <p class="category">Week</p>
            <h3 class="title">$34,245</h3>
          </template>

          <template slot="content">
            <p class="category">Revenue</p>
            <h3 class="title">$34,245</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              Last 24 Hours
            </div>
          </template>
        </vue-stats-card>
      </div>
             <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-33"
      >
        <vue-stats-card data-background-color="red">
<template slot="header">
  <v-icon>
    mdi-information-outline</v-icon>
</template>

<template slot="content">
  <p class="category">
    Fixed Issues</p>
  <h3 class="title">75</h3>
</template>

<template slot="footer">
  <div class="stats">
    <v-icon> mdi-information-outline</v-icon>
  
    Tracked from Github
  </div>
</template>
        </vue-stats-card>
      </div>
      </div>
    <v-row dense>
      <v-col>
        <v-col cols="12" sm="6" xs="6">
          <v-card height="270px">
            <v-col cols="12" sm="12" xs="12">
              <v-card
                flat
                height="200px"
                align="center"
                class="myText text-center"
              >
                <h5>Max Lose: {{ risk.allowedLose }}</h5>
                <v-card
                  flat
                  align="center"
                  class="myText text-center"
                  :height="perc_allowed"
                  color="#C3E4ED"
                >
                  {{ risk.availableRisk }}
                </v-card>
                <v-card
                  flat
                  align="center"
                  class="myText text-center"
                  :height="perc_open"
                  color="#FFFACD"
                >
                  {{ risk.openRisk }}
                </v-card>
                <v-card
                  flat
                  align="center"
                  class="myText text-center"
                  :height="perc_current"
                  :color="color.current"
                >
                  {{ risk.current }}
                </v-card>
              </v-card>
            </v-col>
          </v-card>
        </v-col>
      </v-col>
    </v-row>
  </div>
</template>


<script>
import axios from "axios";
import VueStatsCard from "./../../../components/Cards/VueStatsCard";
import RiskPieChart from "./RiskPieChart"
export default {
  name: "simple-table",
  components: {
    VueStatsCard,
    RiskPieChart
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
       loaded: false,
       chartDataDay : {
        labels: [
          'Red',    // Lost
          'Blue',   // Availible to lose  -  ( Win + Max Lose ) - ( Open Risk + Lost )
          'Yellow', // Open Risk
          'Green'   // Win
        ],
      datasets: [{
        label: 'My First Dataset',
        data: [500, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
      },
      optionsDay:{},
               
                    

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
          console.log(response.data.risk);
          this.risk = response.data.risk;
          this.chartDataDay.datasets[0].data = response.data.chartDataDay;
          if (this.risk.current > 0) {
            this.color.current = "#BCED91	";
          }

          this.loaded = true
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
