<template>
  <v-row dense>
    <v-col class="d-flex mt-n3" cols="12" sm="6">
      <v-select
        dense
        :value="umkehreinstieg"
        :items="selectEinstiegItems"
        label="Einstieg"
        @change="changedEinstieg"
      ></v-select>
    </v-col>
  
  </v-row>
</template>

<script>
import { mapState } from "vuex";
export default {
  components: {},
  name: "umkehr",
  props: {},
  data() {
    return {
      selectEinstiegItems: [
        "",
        "1-2-3 Top",
        "1-2-3 Bottem"
      ],
    };
  },
  computed: mapState({
    umkehreinstieg: (state) =>
      state.journal.journalData.umkehreinstieg,
  }),
  methods: {
    changedEinstieg: function (value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.umkehreinstieg = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    
    },
  },
};
</script>

<style>
.v-label {
  font-size: 12px !important;
}
</style>

