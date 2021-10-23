<template>
  <div class="content">
    <v-virtual-scroll>
      <v-row>
        <v-col
          v-for="item in myLog"
          :key="item.entry"
          cols="12"
          sm="6"
          md="4"
          lg="3"
          >{{ item.entry }}</v-col
        ></v-row
      >
    </v-virtual-scroll>
  </div>
</template>

<style scoped></style>

<script>
//import axios from "axios";
import axios from "axios";

export default {
  components: {},
  name: "Log",
  data() {
    return {
      myLog: []
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getData();
  },

  methods: {
    getData() {
      axios
        .get("/api/getLog", {
          params: {}
        })
        .then(
          response => {
            // eslint-disable-next-line
            this.myLog = response.data.log;
          },
          error => {
            // eslint-disable-next-line
            console.log(error);
          }
        );
    }
  }
};
</script>
