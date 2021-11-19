<template>
  <v-col class="d-flex" cols="12" sm="12">
    <subheader-card>
      <template slot="header">Business Plan</template>
      <template slot="content">
        <v-row dense>
          <v-col class="d-flex mt-n3" cols="12" sm="12">
            <v-select
              dense
              :value="businessplan"
              :items="selectBusinessplanItems"
              label="Select Businessplan"
              @change="changedBusinessplan"
            ></v-select>
          </v-col>

          <business-plan-end v-if="dynamicComponentEOD"> </business-plan-end>
        </v-row>
      </template>
    </subheader-card>
  </v-col>
</template>

<script>
import { mapState } from "vuex";
import BusinessPlanEnd from "./../Businessplan/BusinessPlanEnd";
import SubheaderCard from "../../../../components/Cards/SubheaderCard";
export default {
  components: { BusinessPlanEnd, SubheaderCard },
  name: "business-plan",
  props: {},
  data() {
    return {
      selectBusinessplanItem: null,
      dynamicComponentEOD: false,
      selectBusinessplanItems: ["Opening", "EOD", "SOD", "None"]
    };
  },
  computed: mapState({
    businessplan: state => state.journal.journalData.businessplan
  }),
  watch: {
    businessplan: function() {
      this.changedBusinessplan(this.businessplan);
    }
  },
  mounted() {
    //this.businessplan =  this.$store.state.journal.journalData.businessplan
  },

  methods: {
    changedBusinessplan: function(value) {
      this.dynamicComponentEOD = false;
      this.dynamicComponentOpening = false;
      this.dynamicComponentSOD = false;
      if ("EOD" == value) {
        this.dynamicComponentEOD = true;
      }
      if ("SOD" == value) {
        this.dynamicComponentSOD = true;
      }
      if ("Opening" == value) {
        this.dynamicComponentOpening = true;
      }
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.businessplan = value;
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
