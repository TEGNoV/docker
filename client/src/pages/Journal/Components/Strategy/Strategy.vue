<template>
  <v-col class="d-flex" cols="12" sm="12">
    <subheader-card>
      <template slot="header">{{ strategy }}</template>
      <template slot="content">
        <v-row dense>
          <v-col class="d-flex mt-n3" cols="12" sm="12">
            <v-select
              dense
              :value="strategy"
              :items="selectStrategyItems"
              label="Select Strategy"
              @change="changedStrategy"
            ></v-select>
          </v-col>

          <fire-and-forget v-if="dynamicComponentFireAndForget">
          </fire-and-forget>
          <umkehr v-if="dynamicComponentUmkehr"> </umkehr>
        </v-row> </template></subheader-card
  ></v-col>
</template>

<script>
import { mapState } from "vuex";
import FireAndForget from "./../Strategy/FireAndForget";
import Umkehr from "./../Strategy/Umkehr";
import SubheaderCard from "../../../../components/Cards/SubheaderCard";
export default {
  components: { SubheaderCard, FireAndForget, Umkehr },
  name: "strategy",
  props: {},
  data() {
    return {
      dynamicComponentFireAndForget: false,
      dynamicComponentUmkehr: false,
      selectStrategyItems: this.$store.state.global.settings.strategyItems
    };
  },
  computed: mapState({
    strategy: state => state.journal.journalData.strategy
  }),

  watch: {
    strategy: function() {
      this.changedStrategy(this.strategy);
    }
  },

  methods: {
    changedStrategy: function(value) {
      this.dynamicComponentFireAndForget = false;
      this.dynamicComponentUmkehr = false;
      if ("Fire-Forget" == value) {
        this.dynamicComponentFireAndForget = true;
      }
      if ("Umkehr" == value) {
        this.dynamicComponentUmkehr = true;
      }
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.strategy = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    }
  }
};
</script>

<style>
.v-label {
  font-size: 12px !important;
}
</style>
