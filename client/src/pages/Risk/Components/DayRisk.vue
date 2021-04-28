<template>
  <v-row dense>
    <v-col>
     
      <v-col cols="12" sm="6" xs="6">
        <v-card  height="270px">
          <v-col cols="12" sm="12" xs="12">
        <v-card flat height="200px"   align="center"
            class="myText text-center">
           <h5>Max Lose: {{risk.allowedLose}}</h5>
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
</template>


<script>
import axios from "axios";

export default {
  name: "simple-table",
  components: {},
  props: {
    tableHeaderColor: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      color:{
        current: '#ffa07a',
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

          if(this.risk.current > 0){ 
            this.color.current = '#BCED91	'
          }
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
.title {
  color: white;
}
.text {
  font-weight: bold;
}
.myText {
}
</style>
