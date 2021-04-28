<template>

<v-row dense>
             
  <v-col class="d-flex mt-n3" cols="12" sm="6">
              <v-select
              dense
              :value="risklevel"
              :items="selectRiskItems"
              label="Risk Level"
              @change="funcRisklevel"
            ></v-select>

  </v-col>
               

</v-row>

</template>

<script>
import { mapState } from 'vuex'
export default {
  components: { },
  name: "v1",
  props: {
    
    },
  data() {
    return {

       selectRiskItems: [
        "",
        "R1 (10%)",
        "R2 (5%)",
        "R3 (2%)",
         "R4 (1%)",
          "R5 (0.5%)",
      ],
    };
  },
computed: mapState({
    risklevel: state => state.journal.journalData.risklevel,
   
    

  }),
  methods: {
    
    funcRisklevel: function(value) {
      this.journalData = this.$store.state.journal.journalData
      this.journalData.risklevel = value
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

