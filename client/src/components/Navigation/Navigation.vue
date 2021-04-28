
<template>
  <v-toolbar color="white" fixed>
    <v-btn icon>
      <v-icon color="ColorShemaBot" @click.prevent="openMyDialog()">apps</v-icon>
    </v-btn>
    <v-toolbar-title class="ColorShemaBot--text">Some-Bot-Name</v-toolbar-title>
   <router-view  to="/login" name="NavSub"></router-view>
    <v-spacer></v-spacer>
    <v-btn icon>
      <v-icon color="ColorShemaBot">edit</v-icon>
    </v-btn>
    <NavigationDialog/>
</v-toolbar>
</template>
  
  <script>
import NavigationDialog from './NavigationComponents/NavigationDialog'
import {bus} from '../../main' // import the bus from main.js or new file
export default {
  name: 'Navigation',
    methods: {
      openMyDialog () {
        bus.$emit('dialog', true) // emit the event to the bus
      }
    },
  
  components: {
    NavigationDialog
  }
  }
</script>