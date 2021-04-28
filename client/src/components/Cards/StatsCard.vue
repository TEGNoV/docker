<template>
  <v-card class="card" shaped flat>
    <v-card   outlined class="cardheading" >
     <slot  name="header"></slot> 
    </v-card>

    <v-card class="cardcontent" >
      <slot name="content"></slot>
    </v-card>
 </v-card>
<!--
 :color="dataBackgroundColor"
-->
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
  margin-top: -10px ;
  padding-top: 6px;
  height:30px; 
  width: 100px;
  
  margin-right: auto;
  text-align: center;
  z-index: 9999;
 
 border-color: blue;
 border: 10px;
  
 
}
.cardcontent{
    margin-top: -10px ;


    width: 100%;

}
.card{


}

</style>