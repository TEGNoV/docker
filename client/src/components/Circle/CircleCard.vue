<template>
  <v-row min-width="100%">
    <v-col cols="sm-12 xs-12" class="mycircle">
      <v-progress-circular
        :value="circleValue"
        :size="circleSize"
        :color="circleColor"
        width="8"
      >
        <span style="color: #000">
          <slot name="content"></slot>
        </span>
      </v-progress-circular>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: "circle-card",
  props: {
    circleColor: {
      type: String,
      default: ""
    },
    circleSize: {
      type: String,
      default: "50"
    },
    circleValue: {
      type: String,
      default: "25"
    }
  }
};
</script>

<style scoped>
.mycircle {
  margin: 0 auto;
  text-align: center;
}
</style>
