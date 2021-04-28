<template>
  <div>

              <v-row justify="center" dense>
                <v-col cols="12" sm="6" xs="12">
                  <v-card>
                    <v-card-title class="justify-center">
                      Year Target</v-card-title
                    >
                    <v-card-text class="text-center">
                      <v-row justify="center" dense>
                        <v-col cols="12" sm="8">
                          Kontostand zum Jahresstart</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ kontostandYearstart }}</v-col
                        >
                        <v-col cols="12" sm="4"> T1</v-col>
                        <v-col cols="12" sm="4">
                          {{ targets.year.T1.sum }}</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ targets.year.T1.difPercent }}</v-col
                        >
                        <v-col cols="12" sm="4"> T2</v-col>
                        <v-col cols="12" sm="4">
                          {{ targets.year.T2.sum }}</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ targets.year.T2.difPercent }}</v-col
                        >
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="6" xs="12">
                  <v-card>
                    <v-card-title class="justify-center">
                      Month Target</v-card-title
                    >
                    <v-card-text class="text-center">
                      <v-row justify="center" dense>
                        <v-col cols="12" sm="8">
                          Kontostand zum Monatsstart</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ kontostandMonthstart }}</v-col
                        >
                        <v-col cols="12" sm="4"> T1</v-col>
                        <v-col cols="12" sm="4">
                          {{ targets.month.T1.sum }}</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ targets.month.T1.difPercent }}</v-col
                        >
                        <v-col cols="12" sm="4"> T2</v-col>
                        <v-col cols="12" sm="4">
                          {{ targets.month.T2.sum }}</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ targets.month.T2.difPercent }}</v-col
                        >
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="6" xs="12">
                  <v-card>
                    <v-card-title class="justify-center">
                      Week Target</v-card-title
                    >
                    <v-card-text class="text-center">
                      <v-row justify="center" dense>
                        <v-col cols="12" sm="8">
                          Kontostand zum Wochenstart</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ kontostandWeekstart }}</v-col
                        >
                        <v-col cols="12" sm="4"> T1</v-col>
                        <v-col cols="12" sm="4">
                          {{ targets.week.T1.sum }}</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ targets.week.T1.difPercent }}</v-col
                        >
                        <v-col cols="12" sm="4"> T2</v-col>
                        <v-col cols="12" sm="4">
                          {{ targets.week.T2.sum }}</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ targets.week.T2.difPercent }}</v-col
                        >
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="6" xs="12">
                  <v-card>
                    <v-card-title class="justify-center">
                      Day Target</v-card-title
                    >
                    <v-card-text class="text-center">
                      <v-row justify="center" dense>
                        <v-col cols="12" sm="8">
                          Kontostand zum Tagesstart</v-col
                        >
                        <v-col cols="12" sm="4"> {{ kontostand }}</v-col>
                        <v-col cols="12" sm="4"> T1</v-col>
                        <v-col cols="12" sm="4">
                          {{ targets.day.T1.sum }}</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ targets.day.T1.difPercent }}</v-col
                        >
                        <v-col cols="12" sm="4"> T2</v-col>
                        <v-col cols="12" sm="4">
                          {{ targets.day.T2.sum }}</v-col
                        >
                        <v-col cols="12" sm="4">
                          {{ targets.day.T2.difPercent }}</v-col
                        >
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
      
  </div>
</template>


<script>
import axios from "axios";
//import StatsCardWrapper from "./../../../components/Cards/StatsCardWrapper";
//import CircleCard from "./../../../components/Circle/CircleCard";
export default {
  name: "simple-table",
  components: {
    //CircleCard,
    //StatsCardWrapper
  },
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      kontostand: 0,
      kontostandYearstart: 0,
      kontostandWeekstart: 0,
      kontostandMonthstart: 0,
      targets: {
        year: {
          T1: {
            sum: 0,
            percent: 0,
            difPercent: 0,
          },
          T2: {
            sum: 0,
            percent: 0,
            difPercent: 0,
          },
        },
        day: {
          T1: {
            sum: 0,
            percent: 0,
            difPercent: 0,
          },
          T2: {
            sum: 0,
            percent: 0,
            difPercent: 0,
          },
        },
      
      week: {
        T1: {
          sum: 0,
          percent: 0,
          difPercent: 0,
        },
        T2: {
          sum: 0,
          percent: 0,
          difPercent: 0,
        },
      },
      month: {
        T1: {
          sum: 0,
          percent: 0,
          difPercent: 0,
        },
        T2: {
          sum: 0,
          percent: 0,
          difPercent: 0,
        },
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
  methods: {
    getData() {
      axios
        .get("/api/getTargets", {
          params: {
            options: this.$store.state.dashboard.dashboardStatsFilter,
          },
        })
        .then(
          (response) => {
            // eslint-disable-next-line
       
            this.kontostand = response.data.kontostand;
            this.kontostandYearstart = response.data.kontostandYearstart;
            this.kontostandWeekstart = response.data.kontostandWeekstart;
            this.kontostandMonthstart = response.data.kontostandMonthstart;
            this.targets = response.data.targets;

            this.daylyGoal = 0;
            this.weeklyGoal = 0;
            this.yearlyGoal = 0;
            this.monthlyGoal = 0;
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
.title {
  background: #90caf9;
  color: white;
}
.text {
  background: #e3f2fd;
  font-weight: bold;
}
</style>
