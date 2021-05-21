<template>
  <v-card class="card" outlined shaped>
    <v-card :color="dataBackgroundColor" shaped outlined class="cardheading">
      <slot name="header"></slot>
    </v-card>

    <v-card flat class="cardcontent">
      <slot name="content"></slot>
    </v-card>
  </v-card>
</template>
<script>
export default {
  name: "stats-card",
  props: {
    dataBackgroundColor: {
      type: String,
      default: ""
    }
  }
};
</script>

<style scoped>
.cardheading {
  margin-top: -20px;
  margin-left: -15px;
  padding-top: 6px;
  height: 40px;
  width: 250px;

  text-align: center;
}

.card {
  padding-left: 15px;
  padding-right: 15px;
  display: inline-block;
  position: relative;
  width: 100%;
  margin: 25px 0;
  overflow: unset;
}

.cardcontent {
  display: inline-block;
  position: relative;
  width: 100%;
  margin: 25px 0;
  overflow: unset;
}
</style>
