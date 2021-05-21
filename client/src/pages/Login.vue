<template>
  <v-app id="inspire">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field
                    v-model="username"
                    label="Login"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-on:keyup.enter="login"
                  />

                  <v-text-field
                    v-model="password"
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    v-on:keyup.enter="login"
                  />
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <v-btn @click="login" color="primary">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<style scoped></style>

<script>
import axios from "axios";
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    login() {
      axios
        .post("/api/login", {
          username: this.username.toLowerCase(),
          password: this.password.toLowerCase(),
          remember_me: true
        })
        .then(
          () => {
            // eslint-disable-next-line
  
            this.checkLogin();
            if (this.$store.getters.authentication) {
              this.$router.replace({ name: "Dashboard" });
            }
          },
          error => {
            // eslint-disable-next-line
            console.log(error);
          }
        );
    },
    checkLogin() {
      axios.get("/api/authi").then(
        response => {
          // eslint-disable-next-line
          if (response.data.auth) {
            this.setAuthenticated(true);
          } else {
            this.setAuthenticated(false);
          }
        },
        error => {
          // eslint-disable-next-line
          console.log(error);
        }
      );
    },
    setAuthenticated(status) {
      this.$store.commit("setAuthentication", status);
    }
  }
};
</script>
