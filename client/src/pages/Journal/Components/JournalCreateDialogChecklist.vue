<template>

 
<v-card>
        
    <subheader-card>
<template slot="header"> Basic Select</template>
<template slot="content"> 
<v-row dense class="textsize">

<v-col cols="12" sm="6"> <v-checkbox class="textsize" v-model="inlineWithTrend" label="Inline with trend above?"></v-checkbox> </v-col>
<v-col cols="12" sm="6"> <v-checkbox v-model="inlineWithTrend" label="Inline with trend above?"></v-checkbox> </v-col>
<v-col cols="12" sm="6"> <v-checkbox v-model="inlineWithTrend" label="Inline with trend above?"></v-checkbox> </v-col>

</v-row>


</template>
   
    </subheader-card>
</v-card>
  

</template>

<script>

    import SubheaderCard from "../../../components/Cards/SubheaderCard";
export default {
   
  components: {SubheaderCard},
  name: "journal-create-dialog-checklist",
  props: {
  },
  data() {
    return {
    inlineWithTrend: false
    };
  },
  computed: {
  
  },
  methods: {
    sendToParent: function(){
        this.$emit('send-to-parent', this.parentvalue)
    },
    
  }
};
</script>

<style>
.v-label {
  font-size: 12px !important;
 
}
</style>