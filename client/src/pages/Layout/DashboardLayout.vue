<template>
  <v-app>
    <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
      <side-bar>
        <mobile-menu slot="content"></mobile-menu>
        <sidebar-link to="/dashboard">
          <p>Dashboard</p>
        </sidebar-link>
        <sidebar-link to="/journal">
          <p>Journal</p>
        </sidebar-link>  
               
                       <sidebar-link to="/risk">
          <p>Risk</p>
        </sidebar-link>  

        <sidebar-link to="/upload">
          <p>Upload</p>
        </sidebar-link>

            <sidebar-link to="/log">
          <p>Log</p>
        </sidebar-link>


        <sidebar-blind-link>
          <v-switch v-model="switch1"></v-switch>
        </sidebar-blind-link>
      </side-bar>
      <div class="main-panel">
        <top-navbar></top-navbar>
        <dashboard-content></dashboard-content>
      </div>
    </div>
  </v-app>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import DashboardContent from "./Content.vue";
import MobileMenu from "./MobileMenu.vue";

export default {
  components: {
    TopNavbar,
    MobileMenu,
    DashboardContent
  },
  data() {
    return {
      switch1: true,
      sidebarBackground: "green"
    };
  },
  watch: {
    switch1() {
      //called whenever switch1 changes
      this.changeTheme();
    }
  },
  methods: {
    changeTheme: function() {
      if (this.$store.getters.usedTheme == "dark") {
        this.$store.commit("setTheme", "light");
      } else {
        this.$store.commit("setTheme", "dark");
      }
    }
  }
};
</script>

