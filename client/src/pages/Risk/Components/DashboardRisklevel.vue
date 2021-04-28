<template>
  <div>
    
    
            
                  <v-card>
                    <v-card-title class="justify-center">
                      Risk Levels</v-card-title
                    >
                    <v-card-text class="text-center">
                      <v-row dense justify="center">
                        <v-col cols="12" sm="6" xs="6"> Konto: </v-col>
                        <v-col cols="12" sm="6" xs="6">
                          {{ kontostand }}
                        </v-col>

                        <v-col cols="12" sm="6" xs="6">
                          R1 ({{
                            Number(this.$store.state.global.risk.r1) / 1
                          }}%):
                        </v-col>
                        <v-col cols="12" sm="6" xs="6" dense>
                          {{ r1 }}
                        </v-col>
                        <v-col cols="12" sm="6" xs="6">
                          R2 ({{
                            Number(this.$store.state.global.risk.r2) / 1
                          }}%):
                        </v-col>
                        <v-col cols="12" sm="6" xs="6">
                          {{ r2 }}
                        </v-col>
                        <v-col cols="12" sm="6" xs="6">
                          R3 ({{
                            Number(this.$store.state.global.risk.r3) / 1
                          }}%):
                        </v-col>
                        <v-col cols="12" sm="6" xs="6">
                          {{ r3 }}
                        </v-col>
                        <v-col cols="12" sm="6" xs="6">
                          R4 ({{
                            Number(this.$store.state.global.risk.r4) / 1
                          }}%):
                        </v-col>
                        <v-col cols="12" sm="6" xs="6">
                          {{ r4 }}
                        </v-col>
                        <v-col cols="12" sm="6" xs="6">
                          R5 ({{
                            Number(this.$store.state.global.risk.r5) / 1
                          }}%):
                        </v-col>
                        <v-col cols="12" sm="6" xs="6">
                          {{ r5 }}
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
               
        
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
      r1: 0,
      r2: 0,
      r3: 0,
      r4: 0,
      r5: 0,
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
        .get("/api/getKontostand", {
          params: {
            options: this.$store.state.dashboard.dashboardStatsFilter,
          },
        })
        .then(
          (response) => {
  
            this.kontostand = response.data.kontostand;

            this.r1 = (
              Number(this.kontostand) *
              (Number(this.$store.state.global.risk.r1) / 100)
            ).toFixed(0);
            this.r2 = (
              Number(this.kontostand) *
              (Number(this.$store.state.global.risk.r2) / 100)
            ).toFixed(0);
            this.r3 = (
              Number(this.kontostand) *
              (Number(this.$store.state.global.risk.r3) / 100)
            ).toFixed(0);
            this.r4 = (
              Number(this.kontostand) *
              (Number(this.$store.state.global.risk.r4) / 100)
            ).toFixed(0);
            this.r5 = (
              Number(this.kontostand) *
              (Number(this.$store.state.global.risk.r5) / 100)
            ).toFixed(0);
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
