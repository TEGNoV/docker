<template>
  <div>
    <v-row dense>
      <v-col cols="lg-12 md-12 sm-12 xs-12">
        <v-row justify="center" dense>
          <v-col cols="sm-12 xs-12">
            <v-row justify="center" dense>
              <v-col cols="12" sm="3" xs="6">
                <v-card>
                  <v-card-title class="justify-center"
                    >Start Kontostand</v-card-title
                  >
                  <v-card-text class="text-center">
                    {{ kontostandDayStart }}</v-card-text
                  >
                </v-card>
              </v-col>

              <v-col cols="12" sm="3" xs="6">
                <v-card>
                  <v-card-title class="justify-center">Max Risk</v-card-title>
                  <v-card-text class="text-center">
                    {{ sumMaxDayRisk }}</v-card-text
                  >
                </v-card>
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <v-card>
                  <v-card-title class="justify-center">Risk %</v-card-title>
                  <v-card-text class="text-center">
                    {{ currentDayRiskPercent }}
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <v-card>
                  <v-card-title class="justify-center">Open Risk</v-card-title>
                  <v-card-text class="text-center">
                    {{ sumOpenDayRisk }}</v-card-text
                  >
                </v-card>
              </v-col>
            </v-row>

            <v-row justify="center" dense>
              <v-col cols="12" sm="3" xs="6">
                <v-card>
                  <v-card-title class="justify-center">Total Risk</v-card-title>
                  <v-card-text class="text-center">
                    {{ totalRisk }}</v-card-text
                  >
                </v-card>
              </v-col>

              <v-col cols="12" sm="3" xs="6">
                <v-card>
                  <v-card-title class="justify-center">Total TP</v-card-title>
                  <v-card-text class="text-center"> {{ tp }}</v-card-text>
                </v-card>
              </v-col>
              <v-col cols="12" sm="3" xs="6">
                <v-card>
                  <v-card-title class="justify-center">Worst Case</v-card-title>
                  <v-card-text class="text-center">
                    {{ worstCase }}</v-card-text
                  >
                </v-card>
              </v-col>

              <v-col cols="12" sm="3" xs="6">
                <v-card>
                  <v-card-title class="justify-center">Best Case</v-card-title>
                  <v-card-text class="text-center"> {{ bestCase }}</v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-card>
              <v-row justify="center">
                <v-col cols="12" sm="12">
                  <md-table
                    v-model="positions"
                    :table-header-color="tableHeaderColor"
                  >
                    <md-table-row slot="md-table-row" slot-scope="{ item }">
                      <md-table-cell md-label="Symbol">{{
                        item.symbol
                      }}</md-table-cell>
                      <md-table-cell md-label="Order Nr">{{
                        item.ordernr
                      }}</md-table-cell>
                      <md-table-cell md-label="Risk">
                        <v-icon> {{ item.riskcheck }} </v-icon>
                      </md-table-cell>
                      <md-table-cell md-label="Bought">{{
                        item.bought
                      }}</md-table-cell>
                      <md-table-cell md-label="Count">{{
                        item.count
                      }}</md-table-cell>
                      <md-table-cell md-label="SL">{{ item.sl }}</md-table-cell>
                      <md-table-cell md-label="Risk">{{
                        item.risk
                      }}</md-table-cell>
                      <md-table-cell md-label="TP">{{ item.tp }}</md-table-cell>
                      <md-table-cell md-label="Profit">{{
                        item.profit
                      }}</md-table-cell>
                    </md-table-row>
                  </md-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
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
      riskpercent: false,
      sumMaxDayRisk: 10,
      currentDayRiskPercent: 10,
      selected: [],
      tester: 10,
      totalRisk: 10,
      konto: 10,
      tp: 0,
      worstCase: 0,
      bestCase: 0,
      kontostandDayStart: 0,
      sumOpenDayRisk: 0,
      positions: [
        {
          symbol: "none",
          ordernr: "Dakota Rice",
          bought: "$36,738",
          count: "Niger",
          sl: "Oud-Turnhout",
          risk: "Oud-Turnhout",
          tp: "Oud-Turnhout",
          profit: "Oud-Turnhout",
        },
      ],
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
      axios.get("/api/dashboardPositions").then(
        (response) => {
          // eslint-disable-next-line

          this.positions = response.data.position.positions;
          this.totalRisk = response.data.position.total.risk;
          this.worstCase = response.data.position.total.worstCase;
          this.bestCase = response.data.position.total.bestCase;
          this.tp = response.data.position.total.tp;
          this.konto = response.data.position.total.konto;
          this.kontostandDayStart =
            response.data.position.total.kontostandDayStart;
          this.sumMaxDayRisk = response.data.position.total.sumMaxDayRisk;
          this.currentDayRiskPercent =
            response.data.position.total.currentDayRiskPercent;
          this.sumOpenDayRisk = response.data.position.total.sumOpenDayRisk;
          this.totalCRV = response.data.position.total.totalCRV;
          if (this.currentDayRiskPercent < 20) {
            this.riskpercent = true;
          }
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
.text {
  font-weight: bold;
}
</style>
