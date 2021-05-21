<template>
  <v-container>
    <v-row dense>
      <general> </general>
      <business-plan></business-plan>
      <strategy></strategy>
      <risk></risk>
      <comment></comment>
    </v-row>
  </v-container>
</template>

<script>
import BusinessPlan from "./Businessplan/BusinessPlan";
import Strategy from "./Strategy/Strategy";
import General from "./General/General";
import Risk from "./Risk/Risk";
import Comment from "./Comment/Comment";
export default {
  components: { BusinessPlan, General, Strategy, Risk, Comment },
  name: "journal-form",

  data() {
    return {};
  },
  computed: {},
  methods: {}
};
</script>
