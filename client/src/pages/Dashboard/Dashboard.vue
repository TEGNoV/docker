<template>
  <div class="content">
    <dashboard-stats></dashboard-stats>
    <dashboard-line></dashboard-line>
    <dashboard-targets></dashboard-targets>
    <dashboard-targetline></dashboard-targetline>
  </div>
</template>
<script>
import DashboardLine from "./Components/DashboardLine";
import DashboardStats from "./Components/DashboardStats";
import DashboardTargets from "./Components/DashboardTargets";

import DashboardTargetline from "./Components/DashboardTargetline.vue";
export default {
  components: {
    DashboardTargets,
    DashboardLine,
    DashboardStats,
    DashboardTargetline
  },
  name: "Dashboard",
  data() {
    return {};
  }
};
</script>
