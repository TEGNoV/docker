<template>
  <v-row dense>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgeteinstieg"
        :items="selectEinstiegItems"
        label="Einstieg"
        @change="changedEinstieg"
      ></v-select>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgeteinstiegtyp"
        :items="selectEinstiegTypItems"
        label="Einstieg Typ"
        @change="changedEinstiegTyp"
      ></v-select>
    </v-col>

    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgetstoploss"
        :items="selectStoplossItems"
        label="Stoploss"
        @change="changedStoploss"
      ></v-select>
    </v-col>

    <v-col class="d-flex mt-n3" cols="12" sm="12"> </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgettp1reached"
        :items="selectReachedItems"
        label="TP1 Reached"
        @change="changedTP1Reached"
      ></v-select>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgettp1level"
        :items="selectLevelItems"
        label="TP1 Level"
        @change="changedTP1Level"
      ></v-select>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-text-field
        dense
        @change="changedTP1OrderNr"
        :value="fireandforgettp1ordernr"
        label="TP1 OrderNr"
        single-line
      ></v-text-field>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="12"> </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgettp2reached"
        :items="selectReachedItems"
        label="TP2 Reached"
        @change="changedTP2Reached"
      ></v-select>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgettp2level"
        :items="selectLevelItems"
        label="TP2 Level"
        @change="changedTP2Level"
      ></v-select>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-text-field
        dense
        @change="changedTP2OrderNr"
        :value="fireandforgettp2ordernr"
        label="TP2 OrderNr"
        single-line
      ></v-text-field>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="12"> </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgettp3reached"
        :items="selectReachedItems"
        label="TP1 Reached"
        @change="changedTP3Reached"
      ></v-select>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgettp3level"
        :items="selectLevelItems"
        label="TP3 Reached"
        @change="changedTP3Level"
      ></v-select>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-text-field
        dense
        @change="changedTP3OrderNr"
        :value="fireandforgettp3ordernr"
        label="TP3 OrderNr"
        single-line
      ></v-text-field>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="12"> </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgettp4reached"
        :items="selectReachedItems"
        label="TP4 Reached"
        @change="changedTP4Reached"
      ></v-select>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="fireandforgettp4level"
        :items="selectLevelItems"
        label="TP4 Reached"
        @change="changedTP4Level"
      ></v-select>
    </v-col>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-text-field
        dense
        @change="changedTP4OrderNr"
        :value="fireandforgettp4ordernr"
        label="TP4 OrderNr"
        single-line
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  name: "fire-and-forget",
  props: {},
  data() {
    return {
      selectEinstiegItems: [
        "",
        "Fib 61.8",
        "Fib 50",
        "Fib 38.20",
        "Fib 23.60",
        "Other"
      ],
      selectEinstiegTypItems: ["", "Market", "Limit", "Stop", "Other"],
      selectStoplossItems: ["", "Direkt", "Punkt 3", "Other"],
      selectReachedItems: ["", "Ja", "Nein", "Ungenutzt"],
      selectLevelItems: [
        "",
        "Fib 61.8",
        "Fib 100",
        "Fib 161.8",
        "Fib 261.8",
        "Fib 423.6",
        "Fib 581"
      ]
    };
  },
  computed: mapState({
    fireandforgeteinstieg: state =>
      state.journal.journalData.fireandforgeteinstieg,
    fireandforgeteinstiegtyp: state =>
      state.journal.journalData.fireandforgeteinstiegtyp,
    fireandforgetstoploss: state =>
      state.journal.journalData.fireandforgetstoploss,
    fireandforgettp1reached: state =>
      state.journal.journalData.fireandforgettp1reached,
    fireandforgettp1level: state =>
      state.journal.journalData.fireandforgettp1level,
    fireandforgettp2reached: state =>
      state.journal.journalData.fireandforgettp2reached,
    fireandforgettp2level: state =>
      state.journal.journalData.fireandforgettp2level,
    fireandforgettp3reached: state =>
      state.journal.journalData.fireandforgettp3reached,
    fireandforgettp3level: state =>
      state.journal.journalData.fireandforgettp3level,
    fireandforgettp4reached: state =>
      state.journal.journalData.fireandforgettp4reached,
    fireandforgettp4level: state =>
      state.journal.journalData.fireandforgettp4level,

    fireandforgettp1ordernr: state =>
      state.journal.journalData.fireandforgettp1ordernr,
    fireandforgettp2ordernr: state =>
      state.journal.journalData.fireandforgettp2ordernr,
    fireandforgettp3ordernr: state =>
      state.journal.journalData.fireandforgettp3ordernr,
    fireandforgettp4ordernr: state =>
      state.journal.journalData.fireandforgettp4ordernr
  }),
  methods: {
    changedEinstieg: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgeteinstieg = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedEinstiegTyp: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgeteinstiegtyp = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedStoploss: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgetstoploss = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP1Reached: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp1reached = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP1Level: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp1level = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP2Reached: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp2reached = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP2Level: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp2level = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP3Reached: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp3reached = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP3Level: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp3level = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP4Reached: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp4reached = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP4Level: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp4level = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },

    changedTP1OrderNr: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp1ordernr = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP2OrderNr: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp2ordernr = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP3OrderNr: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp3ordernr = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    changedTP4OrderNr: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.fireandforgettp4ordernr = value;
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
