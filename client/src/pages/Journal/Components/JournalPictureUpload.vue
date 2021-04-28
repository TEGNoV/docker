<template>
  <subheader-card>
    <template slot="header">Basic Select</template>
    <template slot="content">
      <v-row>
        <v-col cols="12" sm="6" md="6">Journal: {{journalId}}</v-col>
        <v-col cols="12" sm="6" md="6">History: {{historyId}}</v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12">
          <vue-dropzone
            ref="myVueDropzone"
            id="dropzone"
            :options="compDropzoneOptions"
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
    </template>
  </subheader-card>
</template>

<script>
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import SubheaderCard from "../../../components/Cards/SubheaderCard";

export default {
  components: { SubheaderCard, vueDropzone: vue2Dropzone },
  name: "journal-create-dialog-checklist",
  props: {
    geturl: {
      type: String,
      default: ""
    },
    uploadurl: {
      type: String,
      default: "/api/upload"
    },
    journalId: {
      type: String,
      default: ""
    },
    historyId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      inlineWithTrend: false,
      uploaded: []
    };
  },
  computed: {
    compHistoryId() {
      let id = "0";
      if (this.historyId != undefined && this.historyId != null) {
        id = this.historyId;
      }
      return id;
    },
    compDropzoneOptions() {
      let dropzoneOptions = {
          url: "/api/picUpload",
          thumbnailWidth: 150,
          maxFilesize: 10,
          headers: { "My-Awesome-Header": "header value" },
          params: { journalId: this.journalId, historyId:this.historyId }
      };
      return dropzoneOptions
    }
  },
  methods: {
    sendToParent: function() {
      this.$emit("send-to-parent", this.parentvalue);
      
    },
    getFiles: function() {
    
    },
    afterComplete(file) {
      console.log("delete!")
      this.$refs.myVueDropzone.removeFile(file);
      this.uploaded.push({ name: file.name });
    },
    getData() {
      this.$store.commit("setJournalUpdateNeeded", false);
      axios.get(this.geturl).then(
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

<style>
.v-label {
  font-size: 12px !important;
}
</style>









