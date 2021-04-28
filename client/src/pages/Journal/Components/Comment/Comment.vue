<template>
  <v-col class="d-flex" cols="12" sm="12">
 
    <subheader-card>
      <template slot="header">Gernal</template>
      <template slot="content">
         <v-card flat outlined class="ma-3" >
          <v-col class="d-flex" cols="12" sm="12">
            <v-list>
              <template v-for="item in items">
                <v-divider :key="item.timestamp"></v-divider>
                <v-list-item :key="item.timestamp">
                  <v-list-item-content>
                    <v-list-item-title
                      v-html="item.timestamp"
                    ></v-list-item-title>
                    <v-list-item-subtitle> 
 
            <input
                v-if="item.edit"
                v-model="item.comment"
                @blur="item.edit = false; $emit('update')"
                @keyup.enter="item.edit=false; $emit('update')"
                v-focus
            >
            <div v-else>
                <label @click="item.edit = true;"> {{item.comment}} </label>
            </div>
   
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>
          </v-col>
     
     </v-card>
   
   <v-card flat outlined class="ma-3" >
      
          <v-col class="d-flex mt-n3" cols="12" sm="12">
            <v-textarea
              clearable
              v-model="message"
              clear-icon="mdi-close-circle"
              label="Text"
              value="This is clearable text."
            ></v-textarea>
          </v-col>

          <v-col class="d-flex mt-n3" cols="12" sm="12">
            <v-btn
              v-on:click="addComment"
              class="ma-2"
              outlined
              color="primary"
            >
              Save
            </v-btn>
          </v-col>
   </v-card>
        </template>

    </subheader-card>
     </v-col>

</template>

  

 


<script>


import axios from "axios";
import { mapState } from "vuex";
import SubheaderCard from "../../../../components/Cards/SubheaderCard";
export default {
  components: { SubheaderCard },
  name: "general",
  props: {},
  data() {
    return {
     editedTodo: null,
      message: "",
      items: [],
    };
  },
  computed: mapState({
    journalInfoPopUpId: (state) => state.journalInfoPopUpId,
  }),
  watch: {
    journalInfoPopUpId: function () {
      this.getComment();
    },
  },
  mounted() {
    this.getComment();
  },
  methods: {
    methods: {
    editTodo: function (todo) {
      this.editedTodo = todo
    }
  },
  directives: {
    focus: {
      inserted (el) {
        el.focus()
      }
    }
  },
    getComment: function () {
      axios
        .get("/api/getComment", {
          params: {
            id: this.journalInfoPopUpId,
          },
        })
        .then((response) => {
          this.items = response.data;
          for(let i=0; i< this.items.length;i++){
            this.items[i].edit = false
          }
        
        });
    },
    addComment: function () {
      let myValues = {
        comment: this.message,
        journalid: this.$store.getters.journalInfoPopUpId,
      };
      axios.post("/api/writeComment", myValues).then(
        () => {
          this.getComment();
          this.message = "";
        },
        (error) => {
          // eslint-disable-next-line
          console.log(error);
        }
      );
    },
  },
};
</script>

<style>
.v-label {
  font-size: 12px !important;
}

</style>

