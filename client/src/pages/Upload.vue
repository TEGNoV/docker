<template>
  <v-app>
    <v-container>
      <v-card min-width="100%" class="pa-2">
        <v-row>
          <v-col cols="12" sm="12" md="12">
            <vue-dropzone
              ref="myVueDropzone"
              id="dropzone"
              :options="dropzoneOptions"
              @vdropzone-complete="afterComplete"
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
      </v-card>
    </v-container>
  </v-app>
</template>

<style scoped>
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
  methods: {
    getFiles: function() {
  
    },
    afterComplete(file) {
      console.log("delete")
      this.$refs.myVueDropzone.removeFile(file);
      this.uploaded.push({ name: file.name });
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






