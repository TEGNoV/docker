<template>
  <router-view></router-view>
</template>

<script>
import axios from "axios";
export default {
  name: "App",
  data() {
    return {};
  },
  mounted() {
    if (!this.$store.getters.authentication) {
      axios.get("/api/authi").then(
        response => {
          // eslint-disable-next-line
          if (response.data.auth) {
            this.setAuthenticated(true);
          } else {
            this.setAuthenticated(false);
            this.$router.replace({ name: "Login" });
          }
        },
        error => {
          // eslint-disable-next-line
          console.log(error);
        }
      );
    }
  },
  methods: {
    setAuthenticated(status) {
      this.$store.commit("setAuthentication", status);
    },
    logout() {
      this.setAuthenticated(false) 
    }
  }
};
</script>

