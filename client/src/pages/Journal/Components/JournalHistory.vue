<template>
  <v-container>
    <subheader-card>
      <template slot="header">Basic Select</template>

      <template slot="content">
        <v-row dense>
          <v-col class="d-flex mt-n4" cols="12" sm="12">
            <v-text-field v-model="historyID" dense label="History ID" single-line></v-text-field>
            <v-icon @click="addToMapp" color="green">mdi-plus</v-icon>
          </v-col>

          <v-col cols="12" sm="12" class="d-flex mt-n4">
            <v-simple-table dense>
            
              <tr v-for="item in history" :key="item.histID">
                <td>
                  <v-icon
                    :value="item.histID"
                    @click="removeItemOfMap"
                    color="red"
                  >mdi-delete-outline</v-icon>
                </td>
              </tr>
            </v-simple-table>
          </v-col>
        </v-row>
      </template>
    </subheader-card>
  </v-container>
</template>

<script>

import SubheaderCard from "../../../components/Cards/SubheaderCard";
import { mapState } from 'vuex'
export default {
  components: { SubheaderCard },
  name: "journal-form",
  data() {
    return {
      values: {
        historyMap: []
      },
      historyID: ""
      
    };
  },
  computed: mapState({
    history: state => state.journal.history
  }),
    watch: {
    history: function() {
   
    }
  },
    created() {

    },
  mounted() {
    
  },
  methods: {
    sendToParent: function() {
      this.$emit("send-to-parent", this.values);
    },

    removeItemOfMap: function(value) {
      let val = value.target.value;
      var index = this.history.findIndex(function(item) {
        return item.histID === val;
      });
      if (index > -1) {
        this.history.splice(index, 1);
        this.$store.commit('journal/setHistory' , this.history)
      }
    },
    addToMapp: function() {

      if (this.historyID != "") {
        let temp = {
          histID: this.historyID
        };
     
        this.values.historyMap.push(temp);
        this.history.push(temp)
        this.$store.commit('journal/setHistory' , this.history)

      }
    }
  }
};
</script>

<style lang="scss" scoped>


.v-text-field input {
  font-size: 1em;
}
</style>