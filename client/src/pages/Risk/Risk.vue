<template>
  <div class="content">
    <v-row>
      <v-col xs="12">
        <day-risk></day-risk>
      </v-col>
    </v-row>
    <v-row>
      <v-col xs="12">
        <risk-positions></risk-positions>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import DayRisk from "./Components/DayRisk";
import RiskPositions from "./Components/RiskPositions";

export default {
  components: {
    DayRisk,
    RiskPositions
  },
  name: "Dashboard",
  data() {
    return {};
  }
};
</script>
