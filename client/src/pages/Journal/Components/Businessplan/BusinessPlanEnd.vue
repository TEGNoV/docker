<template>

<v-row dense>
             
  <v-col class="d-flex mt-n3" cols="12" sm="6">
                <v-checkbox
                  dense
                  @change="funcEODStickToTime"
                  :value="EODStickToTime"
                  label="Wirklich in der Zeitspanne gehandelt?"
                ></v-checkbox>
              </v-col>

                <v-col class="d-flex mt-n3" cols="12" sm="6">
                <v-checkbox
                  dense
                  @change="funcEODTimeframes"
                  :value="EODTimeframes"
                label="Richtige Timeframes genutzt?"
                ></v-checkbox>
              </v-col>

</v-row>

</template>

<script>
import { mapState } from 'vuex'
export default {
  components: { },
  name: "business-plan-end",
  props: {
    
    },
  data() {
    return {

      
    };
  },
computed: mapState({
    EODStickToTime: state => state.journal.journalData.EODStickToTime,
    EODTimeframes: state => state.journal.journalData.EODTimeframes
    

  }),
  methods: {
    funcEODStickToTime: function(value) {
      this.journalData = this.$store.state.journal.journalData
      this.journalData.EODStickToTime = value
      this.$store.commit('journal/setJournalData' , this.journalData)
    },
    funcEODTimeframes: function(value) {
      this.journalData = this.$store.state.journal.journalData
      this.journalData.EODTimeframes = value
      this.$store.commit('journal/setJournalData' , this.journalData)

    },
  }
};
</script>

<style>
.v-label {
  font-size: 12px !important;
}
</style>

