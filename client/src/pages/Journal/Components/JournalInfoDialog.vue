<template>
  <v-app>
    <v-row justify="center">
      <v-dialog
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition"
        v-model="$store.getters.journalInfoPopUp"
        persistent
        max-width="600px"
      >
        <v-card>
          <v-toolbar dark color="white">
            <v-toolbar-items>
              <v-icon
                :color="
                  $vuetify.theme.themes[$store.getters.usedTheme].secondary
                "
                text
                @click="closeInfoPopUp"
                >mdi-close</v-icon
              >
            </v-toolbar-items>
            <v-divider color="#EEEEEE" class="mx-2" vertical></v-divider>

            <v-toolbar-title class="text-center black--text"
              >Trade Info</v-toolbar-title
            >

            <v-divider color="#EEEEEE" class="mx-2" vertical></v-divider>

            <span class="subheading text-center black--text"
              >ID: {{ $store.getters.journalInfoPopUpId }}</span
            >
            <v-spacer></v-spacer>
            <v-divider color="#EEEEEE" class="mx-2" vertical></v-divider>
            <v-toolbar-items>
              <v-icon
                @click="savePopUp"
                :color="
                  $vuetify.theme.themes[$store.getters.usedTheme].secondary
                "
                >mdi-floppy</v-icon
              >
            </v-toolbar-items>
            <v-divider color="#EEEEEE" class="mx-2" vertical></v-divider>
            <v-toolbar-items>
              <v-icon
                :value="$store.getters.journalInfoPopUpId"
                @click="deleteTrade"
                color="red"
                >mdi-delete-outline</v-icon
              >
            </v-toolbar-items>
          </v-toolbar>

          <v-container>
            <v-row justify="center">
              <v-col cols="12" sm="6" md="4">
                <circle-card
                  circle-size="100"
                  circle-value="25"
                  :circle-color="
                    $vuetify.theme.themes[$store.getters.usedTheme].primary
                  "
                >
                  <template slot="content">{{ journal.totalBetrag }}</template>
                </circle-card>
              </v-col>
            </v-row>
          </v-container>
          <!-- 
            Forms und Stuff
          -->

          <journal-form></journal-form>

          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <p class="text-center font-weight-thin">
                  <v-rating
                    :background-color="
                      $vuetify.theme.themes[$store.getters.usedTheme].primary
                    "
                    :color="
                      $vuetify.theme.themes[$store.getters.usedTheme].primary
                    "
                    v-model="buyexecution"
                  ></v-rating
                  >Buy Execution Rating
                </p>
              </v-col>

              <v-col cols="12" sm="6" md="3">
                <p class="text-center font-weight-thin">
                  <v-rating
                    :color="
                      $vuetify.theme.themes[$store.getters.usedTheme].primary
                    "
                    v-model="sellexecution"
                  ></v-rating
                  >Sell Execution Rating
                </p>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-card shaped outlined flat>
              <v-row>
                <v-col
                  cols="12"
                  sm="3"
                  md="3"
                  v-for="(item, index) in pictures"
                  :key="index"
                >
                  <img
                    class="grey lighten-2 ma-1"
                    v-img:group-1
                    :src="'http://192.168.178.111:8080/images/' + item"
                  />
                </v-col>
              </v-row>
            </v-card>
          </v-container>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                {{ calculationDone }}
                <journal-picture-upload
                  v-if="calculationDone"
                  :journalId="$store.getters.journalInfoPopUpId"
                  :historyId="singleHistory"
                  uploadurl="/api/picUpload"
                  geturl="dummy"
                ></journal-picture-upload>
              </v-col>
            </v-row>
          </v-container>
          <journal-history
            v-on:send-to-parent="updateHistoryChild"
          ></journal-history>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <!-- History -->
                <h4 class="text-center">History</h4>
                {{ $store.state.journal.history }}
                <v-expansion-panels accordion>
                  <v-expansion-panel
                    v-for="(ID_History, i) in history"
                    :key="i"
                  >
                    <v-expansion-panel-header>
                      <v-row dense>
                        <v-col cols="12" sm="11" md="11">{{
                          ID_History.ID_History
                        }}</v-col>
                        <v-col cols="12" sm="1" md="1">
                          <v-icon
                            :value="ID_History.ID_History"
                            @click="unlinkHistory"
                            color="red"
                            >mdi-delete-outline</v-icon
                          >
                        </v-col>
                      </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content
                      >Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo
                      consequat.</v-expansion-panel-content
                    >
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-dialog>
    </v-row>
  </v-app>
</template>

<script>
import CircleCard from "../../../components/Circle/CircleCard";
import JournalForm from "./JournalForm";
import JournalHistory from "./JournalHistory";
import JournalPictureUpload from "./JournalPictureUpload";

import axios from "axios";
export default {
  components: {
    CircleCard,
    JournalForm,
    JournalHistory,
    JournalPictureUpload
  },
  name: "journal-info-dialog",
  data() {
    return {
      pictureID: null,
      item: null,
      calculationDone: false,
      pictures: [],
      journalHistoryValues: [],
      sellexecution: 0,
      buyexecution: 0,
      history: [],
      journal: {},
      singleHistory: "00"
    };
  },
  computed: {
    dialogOpen() {
      return this.$store.getters.journalInfoPopUp;
    },
    dialogOpenUpdate() {
      return this.$store.getters.journalInfoPopUpUpdateNeeded;
    }
  },
  watch: {
    dialogOpen: function() {
      if (
        this.$store.getters.journalInfoPopUpId != null &&
        this.$store.getters.journalInfoPopUpTyp != "newtrade"
      ) {
        this.getData();
      }
      if (this.$store.getters.journalInfoPopUpTyp == "newtrade") {
        this.prefill();
      }
    },
    dialogOpenUpdate: function() {
      if (
        this.$store.getters.journalInfoPopUpId != null &&
        this.$store.getters.journalInfoPopUpTyp != "newtrade"
      ) {
        this.getData();
      }
      if (this.$store.getters.journalInfoPopUpTyp == "newtrade") {
        this.prefill();
      }
    }
  },
  beforeCreate() {},
  created() {},
  mounted() {},
  methods: {
    closeFullSize: function() {
      this.$store.commit("setJournalInfoPicturePopUp", false);
    },
    fullsizeimage: function(value) {
      this.pictureID = value.target.value;
      this.$store.commit("setJournalInfoPicturePopUp", true);
    },

    updateHistoryChild: function(myJson) {
      this.journalHistoryValues = myJson;
    },

    savePopUp: function() {
      this.myValues = this.$store.state.journal.journalData;
      this.myValues.historyMAP = this.$store.state.journal.history;
      this.myValues.buyexecution = this.buyexecution;
      this.myValues.sellexecution = this.sellexecution;
      if (this.$store.getters.journalInfoPopUpTyp == "newtrade") {
        this.myValues.typ = "create";
        this.myValues.journalId = this.$store.getters.journalInfoPopUpId;
        this.myValues.verlinken = this.$store.getters.journalInfoPopUpVerlinken;
      } else {
        this.myValues.typ = "update";
        this.myValues.journalId = this.$store.getters.journalInfoPopUpId;
        this.myValues.verlinken = this.$store.getters.journalInfoPopUpVerlinken;
      }
      axios.post("/api/JournalUpdateCreate", this.myValues).then(
        () => {
          // eslint-disable-next-line

          this.$store.commit("setJournalUpdateNeeded", true);
          this.$store.commit("setJournalInfoPopUpUpdateNeeded", true);
          this.$store.commit("setJournalCreatePopUp", false);
          this.historyMap = [];
          this.closeInfoPopUp();
        },
        error => {
          // eslint-disable-next-line
          console.log(error);
        }
      );
    },

    unlinkHistory: function(value) {
      if (confirm("Do you really want to delete?")) {
        axios
          .post("/api/unlinkHistory", {
            historyId: value.target.value,
            journalId: this.$store.getters.journalInfoPopUpId
          })
          .then(
            () => {
              // eslint-disable-next-line

              this.$store.commit("setJournalInfoPopUpUpdateNeeded", true);
            },
            error => {
              // eslint-disable-next-line
              console.log(error);
            }
          );
      }
    },
    deleteTrade: function(value) {
      if (confirm("Do you really want to delete?")) {
        this.$store.commit("setJournalUpdateNeeded", true);
        axios
          .post("/api/deleteSingleJournal", {
            journalId: value.target.value
          })
          .then(
            () => {
              // eslint-disable-next-line
            },
            error => {
              // eslint-disable-next-line
              console.log(error);
            }
          );
        this.$store.commit("setJournalUpdateNeeded", true);
        this.$store.commit("setJournalInfoPopUp", {
          status: false,
          id: null,
          typ: "",
          verlinken: false
        });
      }
    },
    closeInfoPopUp: function() {
      this.$store.commit("journal/resetJournalData");
      this.$store.commit("setHistoryMap", [{}]);
      this.$store.commit("setJournalInfoPopUp", {
        status: false,
        id: null,
        typ: "",
        produkt: "",
        verlinken: false
      });
    },
    setSingleHistory() {
      let id = "0";
      if (this.history[0] != undefined) {
        id = this.history[0].ID_History;
      }
      this.singleHistory = id;
      this.calculationDone = true;
    },
    prefill() {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.symbol = this.$store.getters.journalInfoPopUpProdukt;
      this.$store.commit("journal/setJournalData", this.journalData);

      // temp = this.$store.state.journal.history
      //init befüllung in die history map damit auch verlinkt werden kann. brauch ich nur für verlinken
      // Hier
      if (this.$store.getters.journalInfoPopUpVerlinken) {
        this.temp = [{ histID: this.$store.getters.journalInfoPopUpId }];
        this.$store.commit("journal/setHistory", this.temp);
      }

      /* glaub das ist falsch. Hier soll die ganze map gespeichert werden nicht nur die ID
      this.$store.commit("setHistoryMap", [
        { histID: this.$store.getters.journalInfoPopUpId },
      ]);
      */
      this.setSingleHistory();

      axios
        .get("/api/getSinglePictures", {
          params: {
            id: this.$store.getters.journalInfoPopUpId
          }
        })
        .then(
          response => {
            this.pictures = response.data.journalPictures;
          },
          error => {
            // eslint-disable-next-line
            console.log(error);
          }
        );
    },
    funcMylabels: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.mylabels = value;
      this.$store.commit("journal/setJournalData", this.journalData);
    },
    funcAlllabels: function(value) {
      this.journalData = this.$store.state.journal.journalData;
      this.journalData.alllabels = value;

      this.$store.commit("journal/setJournalData", this.journalData);
    },

    getData() {
      axios
        .get("/api/getSingleJournal", {
          params: {
            journalid: this.$store.getters.journalInfoPopUpId
          }
        })
        .then(
          response => {
            this.funcMylabels(response.data.journal.mylabels);

            this.funcAlllabels(response.data.journal.alllabels);

            this.pictures = response.data.journalPictures;
            this.history = response.data.history;
            this.$store.commit("setHistoryMap", [{ histID: this.history }]);
            this.$store.commit("setJournalInfoPopUpUpdateNeeded", false);
            this.journalData = this.$store.state.journal.journalData;
            this.journalData.symbol = response.data.journal.SYMBOL;
            this.journalData.period = response.data.journal.PERIOD;
            this.journalData.buyexecution =
              response.data.journal.BUYEXECUTIONRATING;
            this.journalData.sellexecution =
              response.data.journal.SELLEXECUTIONRATING;
            this.journalData.risklevel = response.data.journal.RISKLEVEL;
            this.journalData.risktotal = response.data.journal.RISKTOTAL;
            this.journalData.bemerkung = response.data.journal.BEMERKUNG;
            this.journalData.period = response.data.journal.PERIOD;
            this.journalData.strategy = response.data.journal.STRATEGY;
            this.journalData.businessplan = response.data.journal.BUSINESSPLAN;
            this.journalData.myentry = response.data.journal.MYENTRY;
            this.journalData.myentryline = response.data.journal.MYENTRYLINE;
            this.journalData.myexit = response.data.journal.MYEXIT;
            this.journalData.freitext1 = response.data.journal.FREITEXT1;
            this.journalData.freitext2 = response.data.journal.FREITEXT2;
            this.journalData.freitext3 = response.data.journal.FREITEXT3;
            this.journalData.freitext4 = response.data.journal.FREITEXT4;
            this.journalData.fehler1 = response.data.journal.FEHLER1;
            this.journalData.fehler2 = response.data.journal.FEHLER2;
            this.journalData.fehler3 = response.data.journal.FEHLER3;
            this.journalData.fehler4 = response.data.journal.FEHLER4;
            this.journalData.buyfib1 = response.data.journal.BUYFIB1;
            this.journalData.buyfib2 = response.data.journal.BUYFIB2;
            this.journalData.buyfib3 = response.data.journal.BUYFIB3;
            this.journalData.buyfib4 = response.data.journal.BUYFIB4;
            this.journalData.sellfib1 = response.data.journal.SELLFIB1;
            this.journalData.sellfib2 = response.data.journal.SELLFIB2;
            this.journalData.sellfib3 = response.data.journal.SELLFIB3;
            this.journalData.sellfib4 = response.data.journal.SELLFIB4;
            this.journalData.sellfib1Result =
              response.data.journal.SELLFIB1RESULT;
            this.journalData.sellfib2Result =
              response.data.journal.SELLFIB2RESULT;
            this.journalData.sellfib3Result =
              response.data.journal.SELLFIB3RESULT;
            this.journalData.sellfib4Result =
              response.data.journal.SELLFIB4RESULT;

            this.journalData.riskplan = response.data.journal.riskplan;
            this.journalData.risk = response.data.journal.risk;
            this.journalData.fireandforgeteinstiegtyp =
              response.data.journal.fireandforgeteinstiegtyp;
            this.journalData.fireandforgeteinstieg =
              response.data.journal.fireandforgeteinstieg;
            this.journalData.fireandforgetstoploss =
              response.data.journal.fireandforgetstoploss;
            this.journalData.fireandforgettp1reached =
              response.data.journal.fireandforgettp1reached;
            this.journalData.fireandforgettp1level =
              response.data.journal.fireandforgettp1level;
            this.journalData.fireandforgettp2reached =
              response.data.journal.fireandforgettp2reached;
            this.journalData.fireandforgettp2level =
              response.data.journal.fireandforgettp2level;
            this.journalData.fireandforgettp3reached =
              response.data.journal.fireandforgettp3reached;
            this.journalData.fireandforgettp3level =
              response.data.journal.fireandforgettp3level;
            this.journalData.fireandforgettp4reached =
              response.data.journal.fireandforgettp4reached;
            this.journalData.fireandforgettp4level =
              response.data.journal.fireandforgettp4level;
            this.journalData.fireandforgettp1ordernr =
              response.data.journal.fireandforgettp1ordernr;
            this.journalData.fireandforgettp2ordernr =
              response.data.journal.fireandforgettp2ordernr;
            this.journalData.fireandforgettp3ordernr =
              response.data.journal.fireandforgettp3ordernr;
            this.journalData.fireandforgettp4ordernr =
              response.data.journal.fireandforgettp4ordernr;

            if (response.data.journal.STICKTOPLAN == "true") {
              this.journalData.stickToPlan = true;
            } else {
              this.journalData.stickToPlan = false;
            }

            if (response.data.journal.ISDOCUMENTED == "true") {
              this.journalData.isDocumented = true;
            } else {
              this.journalData.isDocumented = false;
            }

            this.$store.commit("journal/setJournalData", this.journalData);
            this.setSingleHistory();
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

<style lang="scss" scoped>
.iconcenter {
  margin: 0 auto;
  width: 100%;
  height: 100%;
  margin-top: 0;
  margin-bottom: auto;
}
.imgclass {
  font-size: 1em;
  height: 150px;
  width: 150px;
}
.imgFullsizeclass {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
