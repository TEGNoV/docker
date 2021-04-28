<template>
  <div class="content">

    <v-row>
      <v-col xs="12">
        <v-card  :color=" $vuetify.theme.themes[$store.getters.usedTheme].primary	">
          <v-card-title> Stats </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <dashboard-stats></dashboard-stats>
    <dashboard-line></dashboard-line>

<v-row>
      <v-col xs="12">
        <v-card :color=" $vuetify.theme.themes[$store.getters.usedTheme].primary	">
          <v-card-title> Targets </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <dashboard-targets></dashboard-targets>
    <dashboard-targetline></dashboard-targetline>
    <v-row>
      <v-col xs="12">
        <v-card  :color=" $vuetify.theme.themes[$store.getters.usedTheme].primary	">
          <v-card-title> Risk </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <dashboard-risklevel></dashboard-risklevel>
    <dashboard-risk></dashboard-risk>
  </div>
</template>
<script>
import DashboardLine from "./Components/DashboardLine";
import DashboardStats from "./Components/DashboardStats";
import DashboardRisk from "./Components/DashboardRisk";
import DashboardRisklevel from "./Components/DashboardRisklevel";
import DashboardTargets from "./Components/DashboardTargets";

import DashboardTargetline from "./Components/DashboardTargetline.vue";
export default {
  components: {
    DashboardRisk,
    DashboardTargets,
    DashboardLine,
    DashboardStats,
    DashboardRisklevel,
    DashboardTargetline,
  },
  name: "Dashboard",
  data() {
    return {};
  },
};
</script>





