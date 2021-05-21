<template>
  <div>

        
          <v-expansion-panels accordion flat>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-row justify="space-between" dense>
                  <v-col cols="12" sm="11" dense> </v-col>
                  <v-col cols="12" sm="1" class="d-flex justify-end" dense>
                  </v-col
                ></v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row justify="center">
                  <v-col cols="12" sm="11">
                    <v-row justify="center">
                      <v-col class="d-flex" cols="12" sm="5">
                        <v-col cols="12" sm="6">
                          <v-date-picker v-model="dates" range></v-date-picker>
                        </v-col>
                      </v-col>

                      <v-divider vertical></v-divider>

                      <v-col class="d-flex" cols="12" sm="5">
                        <v-row justify="center">
                          <v-col class="d-flex mt-n3" cols="12" sm="6">
                            <v-select
                              dense
                              :value="strategy"
                              :items="selectStrategyItems"
                              label="Select Strategy"
                              @change="funcStrategy"
                            ></v-select>
                          </v-col> </v-row
                      ></v-col>
                      <v-divider vertical></v-divider>
                      <v-col class="d-flex" cols="12" sm="1">
                        <v-row justify="center">
                          <v-col class="d-flex" cols="12" sm="12">
                            <v-checkbox
                              dense
                              @change="funcIsDocumented"
                              :value="isDocumented"
                              label="Dokumentiert?"
                            ></v-checkbox>
                          </v-col>
                          <v-col class="d-flex" cols="12" sm="12">
                            <v-checkbox
                              dense
                              @change="funcIsLinked"
                              :value="isLinked"
                              label="Verlinkt?"
                            ></v-checkbox>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        

  </div>
</template>

<script>
import { mapState } from "vuex";
//import CircleCard from "./../../../components/Circle/CircleCard";
export default {
  name: "simple-table",
  components: {
    // CircleCard,
  },
  data() {
    return {
      selectStrategyItems: this.$store.state.global.settings.strategyItems,
      dates: []
    };
  },
  created() {
    var startWeek = new Date();
    for (var i = 0; i < 8; i++) {
      var n = startWeek.getDay();
      if (n == 1) {
        startWeek.setHours(0, 0, 0, 0);
      } else {
        startWeek.setDate(startWeek.getDate() - 1);
      }
    }
    var endWeek = new Date(startWeek.getTime());
    endWeek.setDate(endWeek.getDate() + 5);

    this.dashboardStatsFilter = this.$store.state.dashboard.dashboardStatsFilter;
    this.dashboardStatsFilter.startDate = startWeek.toISOString().split("T")[0];
    this.dashboardStatsFilter.endDate = endWeek.toISOString().split("T")[0];
    this.$store.commit(
      "dashboard/setDashboardStatsFilter",
      this.dashboardStatsFilter
    );
  },
  watch: {
    dates: function() {
      let time1 = this.dates[0];
      let time2;
      if (this.dates[1] == null || this.dates[1] == undefined) {
        time2 = this.dates[0];
      } else {
        time2 = this.dates[1];
      }

      let d1 = new Date(time1);
      let d2 = new Date(time2);

      if (d2 < d1) {
        let temp = time1;
        time1 = time2;
        time2 = temp;
      }
      this.dashboardStatsFilter = this.$store.state.dashboard.dashboardStatsFilter;
      this.dashboardStatsFilter.startDate = time1;
      this.dashboardStatsFilter.endDate = time2;
      this.$store.commit(
        "dashboard/setDashboardStatsFilter",
        this.dashboardStatsFilter
      );
    }
  },
  mounted() {},
  computed: mapState({
    isDocumented: state => state.dashboard.dashboardStatsUpdate.isDocumented,
    isLinked: state => state.dashboard.dashboardStatsUpdate.isLinked,
    strategy: state => state.dashboard.dashboardStatsUpdate.strategy
  }),
  methods: {
    funcIsDocumented: function(value) {
      this.dashboardStatsFilter = this.$store.state.dashboard.dashboardStatsFilter;
      this.dashboardStatsFilter.isDocumented = value;
      this.$store.commit(
        "dashboard/setDashboardStatsFilter",
        this.dashboardStatsFilter
      );
    },
    funcIsLinked: function(value) {
      this.dashboardStatsFilter = this.$store.state.dashboard.dashboardStatsFilter;
      this.dashboardStatsFilter.isLinked = value;
      this.$store.commit(
        "dashboard/setDashboardStatsFilter",
        this.dashboardStatsFilter
      );
    },
    funcStrategy: function(value) {
      this.dashboardStatsFilter = this.$store.state.dashboard.dashboardStatsFilter;
      this.dashboardStatsFilter.strategy = value;
      this.$store.commit(
        "dashboard/setDashboardStatsFilter",
        this.dashboardStatsFilter
      );
    }
  }
};
</script>
