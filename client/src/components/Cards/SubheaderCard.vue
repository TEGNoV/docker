<template>
  <v-card class="card" flat outlined>
    <div class="cardheading" outline>
      <slot name="header"></slot>
    </div>
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
  margin-top: 4px;
  margin-right: auto;
  margin-left: -4px;
  margin-bottom: 0px;

  padding-top: 0px;
  padding-left: 14px;

  height: 20px;
  width: 100%;

  text-align: left;
  font-size: 15px;

  color: grey;
  z-index: 9999;
}

.cardfooter {
  margin-top: 0px;
  margin-left: auto;
  margin-right: -1px;
  margin-bottom: -1px;
  height: 20px;
  width: 100%;
  color: grey;
  z-index: 9999;
}

.cardcontent {
  margin-top: 5px;
  padding-top: 16px;
  padding-left: 10px;
  padding-right: 10px;
  width: 100%;
}
.card {
  width: 100%;
}
</style>
