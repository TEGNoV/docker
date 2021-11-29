<template>

      <div class="content">
 <div
      class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
    >
     <md-card>
        <md-card-header data-background-color="blue">
          <h4 class="title">Open Positions</h4>
 </md-card-header>
        <md-card-content>
    
        <v-row>
          <v-col cols="12" sm="12" md="12">
           <!-- id="dropzone" -->
            <vue-dropzone
              ref="myVueDropzone"
            
              :include-styling="false"
              :options="dropzoneOptions"
              @vdropzone-complete="afterComplete"
               id="customdropzone"
                v-on:vdropzone-success="uploadSuccess"
               >
            ></vue-dropzone>
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" sm="12" class="d-flex">
            <v-simple-table width="400px">
              <tbody width="400px">
                <tr v-for="item in uploaded" :key="item.name">
                  <td>{{ item.name }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
     
      </md-card-content>
      </md-card>
      </div>
      </div>

</template>

<style>
  #customdropzone {
    background-color: white;
      border-style: dotted;
  border-width: 1px;
    font-family: 'Arial', sans-serif;
    letter-spacing: 0.2px;
    color: #777;
    transition: background-color .2s linear;
    height: 200px;
    padding: 40px;
  }

  #customdropzone .dz-preview {
    width: 160px;
    display: inline-block
  }
 #customdropzone .dz-preview .dz-image {
    width: 80px;
    height: 80px;
    margin-left: 40px;
    margin-bottom: 10px;
  }
  #customdropzone .dz-preview .dz-image > div {
    width: inherit;
    height: inherit;
    border-radius: 50%;
    background-size: contain;
  }
  #customdropzone .dz-preview .dz-image > img {
    width: 100%;
  }

   #customdropzone .dz-preview .dz-details {
    color: white;
    transition: opacity .2s linear;
    text-align: center;
  }
  #customdropzone .dz-success-mark, .dz-error-mark, .dz-remove {
    display: none;
  }
</style>

<script>
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
export default {
  name: "app",
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function() {
    return {
      uploaded: [],
      dropzoneOptions: {
        url: "/api/upload",
        thumbnailWidth: 150,
        maxFilesize: 50,
        headers: { "My-Awesome-Header": "header value" }
      }
    };
  },
   /*
      this.alert = this.$store.state.global.alerts;
      this.alert.msg = value;
      this.alert.active = true;
      this.$store.commit("global/setAlerts", this.alert);
      */
  methods: {
    getFiles: function() {},
    afterComplete(file) {
      this.$refs.myVueDropzone.removeFile(file);
      this.uploaded.push({ name: file.name });
      this.alert = this.$store.state.global.alerts;
      this.alert.msg = "Upload Done";
      this.alert.active = true;
      this.$store.commit("global/setAlerts", this.alert);
    },
     uploadSuccess: function(file, response) {
      //console.log("jop")

   },
    getData() {
      this.$store.commit("setJournalUpdateNeeded", false);
      axios.get("/api/journal").then(
        response => {
          // eslint-disable-next-line
          this.journalItems = response.data;
        },
        error => {
          // eslint-disable-next-line
          console.log(error);
        }
      );
    }
  }
};
</script>
