<template>
  <v-col class="d-flex" cols="12" sm="12">
    <subheader-card>
      <template slot="header">Risk Plan</template>
      <template slot="content">
        <v-row dense>
          <v-col class="d-flex mt-n3" cols="12" sm="12">
            <v-select
              dense
              :value="selectRiskItem"
              :items="selectRiskItems"
              label="Select Riskplan"
              @change="changedRiskplan"
            ></v-select>
          </v-col>

          <v1 v-if="dynamicComponentV1"> </v1>
        </v-row>
      </template>
    </subheader-card>
  </v-col>
</template>

<script>
import { mapState } from "vuex";
import V1 from "./../Risk/V1";
import SubheaderCard from "../../../../components/Cards/SubheaderCard";
export default {
  components: { V1, SubheaderCard },
  name: "business-plan",
  props: {},
  data() {
    return {
      dynamicComponentV1: false,
      selectRiskItems: ["V1", "None"]
    };
  },
  computed: mapState({
    selectRiskItem: state => state.journal.journalData.riskplan
  }),
  watch: {
    selectRiskItem: function() {
      this.changedRiskplan(this.selectRiskItem);
    }
  },
  mounted() {
    //this.businessplan =  this.$store.state.journal.journalData.businessplan
  },

  methods: {
    changedRiskplan: function(value) {
      this.dynamicComponentV1 = false;

      if ("V1" == value) {
        this.dynamicComponentV1 = true;
      }

      this.journalData = this.$store.state.journal.journalData;
      this.journalData.riskplan = value;
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
