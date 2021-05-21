<template>
  <v-col class="d-flex" cols="12" sm="12">
    <subheader-card>
      <template slot="header">Gernal</template>
      <template slot="content">
        <v-row dense>
          <v-col class="d-flex mt-n3" cols="12" sm="12">
            <v-combobox
              @change="funcMylabels"
              :items="alllabels"
              :value="mylabels"
              label="I use chips"
              multiple
              chips
              deletable-chips
            >
            </v-combobox>
          </v-col>
          <v-col class="d-flex mt-n3" cols="12" sm="6">
            <v-checkbox
              dense
              @change="funcIsDocumented"
              :value="isDocumented"
              label="Dokumentiert?"
            ></v-checkbox>
          </v-col>
          <v-col class="d-flex mt-n3" cols="12" sm="6">
            <v-checkbox
              dense
              @change="funcStickToPlan"
              :value="stickToPlan"
              label="An den Plan gehalten?"
            ></v-checkbox>
          </v-col>
          <v-col class="d-flex mt-n3" cols="12" sm="6">
            <v-text-field
              dense
              @change="funcSymbol"
              :value="symbol"
              label="Symbol"
              single-line
            ></v-text-field>
          </v-col>

          <v-col class="d-flex mt-n3" cols="12" sm="6">
            <v-select
              dense
              @change="funcPeriod"
              :value="period"
              :items="selectPeriodItems"
              label="Period"
              single-line
            ></v-select>
          </v-col>
        </v-row>
      </template>
    </subheader-card>
  </v-col>
</template>

<script>
import { mapState } from "vuex";
import SubheaderCard from "../../../../components/Cards/SubheaderCard";
export default {
  components: { SubheaderCard },
  name: "general",
  props: {},
  data() {
    return {
      selectPeriodItems: this.$store.state.global.settings.selectPeriodItems,
      select: ["Vuetify", "Programming"],
      items: ["Programming", "Design", "Vue", "Vuetify"]
    };
  },
  computed: mapState({
    mylabels: state => state.journal.journalData.mylabels,
    alllabels: state => state.journal.journalData.alllabels,
    symbol: state => state.journal.journalData.symbol,
    period: state => state.journal.journalData.period,
    stickToPlan: state => state.journal.journalData.stickToPlan,
    isDocumented: state => state.journal.journalData.isDocumented
  }),
  mounted() {},

  methods: {
    funcMylabels: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.mylabels = value;
      console.log(value);
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    funcSymbol: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.symbol = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    funcPeriod: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.period = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    funcStickToPlan: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.stickToPlan = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    funcIsDocumented: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.isDocumented = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    }
  }
};
</script>

<style>
.v-label {
  font-size: 12px !important;
}

.theme--light.v-chip {
  background-color: aqua;
}
</style>
