<template>
  <div>
    
        
   
                <dashboard-stats-filter></dashboard-stats-filter>
                <v-row justify="center" dense>
                 <v-col cols="12" sm="4" xs="6">
                  
                    <v-card class=" ">
                      <v-card-title class="justify-center"
                        >Earnings</v-card-title
                      >
                      <v-card-text class="text-center">
                        <v-row justify="start">
                          <v-col cols="12" sm="4">
                            <v-icon
                              size="60"
                              :style="
                                'color:' +
                                $vuetify.theme.themes[$store.getters.usedTheme]
                                  .blue.accent2
                              "
                              >mdi-currency-eur</v-icon
                            >
                          </v-col>
                          <v-col class="d-flex align-center" cols="12" sm="8">
                            <div class="bigSize">{{ stats.earnings }}</div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                  <v-col cols="12" sm="4" xs="6">
                    <v-card class=" ">
                      <v-card-title class="justify-center">Trades</v-card-title>
                      <v-card-text class="text-center">
                        <v-row justify="start">
                          <v-col cols="12" sm="4">
                            <v-icon
                              size="60"
                              :style="
                                'color:' +
                                $vuetify.theme.themes[$store.getters.usedTheme]
                                  .blue.accent2
                              "
                              >mdi-chart-areaspline-variant</v-icon
                            >
                          </v-col>
                          <v-col class="d-flex align-center" cols="12" sm="8">
                            <div class="bigSize">{{ stats.tradecount }}</div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>

                   <v-col cols="12" sm="4" xs="6">
                    <v-card class=" ">
                      <v-card-title class="justify-center"
                        >Winrate
                      </v-card-title>
                      <v-card-text class="text-center">
                        <v-row justify="start">
                          <v-col cols="12" sm="4">
                            <v-icon
                              size="60"
                              :style="
                                'color:' +
                                $vuetify.theme.themes[$store.getters.usedTheme]
                                  .blue.accent2
                              "
                              >mdi-speedometer</v-icon
                            >
                          </v-col>
                          <v-col class="d-flex align-center" cols="12" sm="8">
                            <div class="bigSize">{{ stats.winrate }}</div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>

                   <v-col cols="12" sm="4" xs="6">
                    <v-card class=" ">
                      <v-card-title class="justify-center"
                        >Biggest Win</v-card-title
                      >
                      <v-card-text class="text-center">
                        <v-row justify="start">
                          <v-col cols="12" sm="4">
                            <v-icon
                              size="60"
                              :style="
                                'color:' +
                                $vuetify.theme.themes[$store.getters.usedTheme]
                                  .blue.accent2
                              "
                              >mdi-trending-up</v-icon
                            >
                          </v-col>
                          <v-col class="d-flex align-center" cols="12" sm="8">
                            <div class="bigSize">{{ stats.biggestwin }}</div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>

                   <v-col cols="12" sm="4" xs="6">
                    <v-card class=" ">
                      <v-card-title class="justify-center"
                        >Biggest Loss</v-card-title
                      >
                      <v-card-text class="text-center">
                        <v-row justify="center">
                          <v-col cols="12" sm="4">
                            <v-icon
                              size="60"
                              :style="
                                'color:' +
                                $vuetify.theme.themes[$store.getters.usedTheme]
                                  .blue.accent2
                              "
                              >mdi-trending-down</v-icon
                            >
                          </v-col>
                          <v-col class="d-flex align-center" cols="12" sm="8">
                            <div class="bigSize">{{ stats.biggestloss }}</div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>

                   <v-col cols="12" sm="4" xs="6">
                    <v-card class=" ">
                      <v-card-title class="justify-center">AVG</v-card-title>
                      <v-card-text class="text-center">
                        <v-row justify="center">
                          <v-col cols="12" sm="4">
                            <v-icon
                              size="60"
                              :style="
                                'color:' +
                                $vuetify.theme.themes[$store.getters.usedTheme]
                                  .blue.accent2
                              "
                              >mdi-swap-vertical-bold</v-icon
                            >
                          </v-col>
                          <v-col class="d-flex align-center" cols="12" sm="8">
                            <div class="bigSize">{{ stats.avg }}</div>
                          </v-col>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
           
        
    
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import DashboardStatsFilter from "./DashboardStatsFilter";
//import CircleCard from "./../../../components/Circle/CircleCard";
export default {
  name: "simple-table",
  components: {
    DashboardStatsFilter,
  },

  data() {
    return {
      stats: {
        earnings: 2000,
        avg: 50,
        tradecount: 12,
        biggestwin: 24,
        biggestloss: 55,
        winrate: 40,
      },
    };
  },
  created() {
    this.interval = setInterval(() => this.getData(), 60000);
  },
  mounted() {
    this.getData();
  },

  watch: {
    dashboardStatsUpdate: function () {
   
      this.getData();
    },
  },
  computed: mapState({
    dashboardStatsUpdate: (state) => state.dashboard.dashboardStatsUpdate,
  }),
  methods: {
    getData() {
      axios
        .get("/api/dashboardStats", {
          params: {
            options: this.$store.state.dashboard.dashboardStatsFilter,
          },
        })
        .then(
          (response) => {
            // eslint-disable-next-line
            this.stats = response.data.stats;
            this.$store.commit("dashboard/setDashboardStatsUpdate", false);
          },
          (error) => {
            // eslint-disable-next-line
            console.log(error);
          }
        );
    },
  },
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