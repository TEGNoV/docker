import { Doughnut, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;
import { mapState } from "vuex";

export default {
  
  extends: Doughnut,
  mixins: [reactiveProp],
  props: ["chartData", "options"],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options);
    
   
  },
 
  
};
