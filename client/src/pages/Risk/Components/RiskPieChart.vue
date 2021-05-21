<template>
  <div>
    <v-row justify="center">
      <v-col cols="sm-12 xs-12">
        <v-card flat>
          <v-card-text>
            <pie-chart :chart-data="chartData" :options="options"></pie-chart>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PieChart from "./PieChart.js";

export default {
  components: {
    PieChart
  },
  props: ["chartData", "options"],
  name: "Dashboard",
  data() {
    return {
      loaded: true
    };
  },
  computed: mapState({
    cssPrimary() {
      return this.$vuetify.theme.themes[this.$store.getters.usedTheme].blue
        .accent2;
    }
  }),
  watch: {},
  created() {
    this.interval = setInterval(() => this.getData(), 60000);
  },
  mounted() {
    this.getData();
  },
  methods: {
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

            label: "Data One"
          }
        ]
      }),
        (this.options.loaded = true);
    },
    getData() {}
  }
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
