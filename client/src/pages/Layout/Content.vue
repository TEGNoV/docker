<template>
  <div>
    {{this.$store.state.global.alerts.msg}}
    {{this.$store.state.global.alerts.active}}
    <v-alert
      :value="alertActive"
      color="pink"
      dark
      border="top"
      icon="mdi-home"
      transition="scale-transition"
      dismissible
      @input="onclose"
    >
    {{this.$store.state.global.alerts.msg}}
      Phasellus tempus. Fusce ac felis sit amet ligula pharetra condimentum. In dui magna, posuere eget, vestibulum et, tempor auctor, justo. Pellentesque posuere. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo.

      Phasellus nec sem in justo pellentesque facilisis. Phasellus magna. Cras risus ipsum, faucibus ut, ullamcorper id, varius ac, leo. In hac habitasse platea dictumst. Praesent turpis.
    </v-alert>
    <router-view v-if="$store.getters.authentication"></router-view>
  </div>
</template>

<script>
import { mapState } from "vuex";
  export default {
    data () {
      return {
        
      }
    },  computed: mapState({
    alertActive: state => state.global.alerts.active
  }),
  methods: {
    onclose() {
          this.alert = this.$store.state.global.alerts;
      this.alert.msg = "";
      this.alert.active = false;
      this.$store.commit("global/setAlerts", this.alert);
    }
  }
  }

  /*
      this.alert = this.$store.state.global.alerts;
      this.alert.msg = value;
      this.alert.active = true;
      this.$store.commit("global/setAlerts", this.alert);
  */
</script>


<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
  .fade-leave-to
    /* .fade-leave-active in <2.1.8 */

 {
  opacity: 0;
}
</style>

