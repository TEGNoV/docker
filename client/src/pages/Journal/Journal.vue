<template>
  <div class="content">
    <div
      class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
    >
      <v-expansion-panels accordion flat>
        <v-expansion-panel>
          <v-expansion-panel-header>Datepicker</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="12" sm="6">
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-date-picker v-model="dates" range></v-date-picker>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-radio-group v-model="filter" :mandatory="false">
                      <v-radio label="Unlinked" value="empty"></v-radio>
                      <v-radio label="Linked" value="linked"></v-radio>
                      <v-radio label="All" value="all"></v-radio>
                    </v-radio-group>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn @click="getData()">Reload</v-btn>
                  </v-col>
                  <v-col cols="sm-4 xs-12">
                    <v-select
                      v-model="product"
                      v-on:change="changeProduct"
                      :items="products"
                      label="Products"
                      dense
                      outlined
                    ></v-select>
                  </v-col>
                </v-row>
              </v-col>
              <v-col></v-col>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div
      class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
    >
      <md-card>
        <md-card-header data-background-color="blue">
          <h4 class="title">Open Positions</h4>

          <v-row>
            <v-col cols="12" sm="2">
              Total: <br />
              {{ total }}
            </v-col>
            <v-col cols="12" sm="2">
              Winrate: <br />
              {{ winrate }}
            </v-col>
            <v-col cols="12" sm="2">
              AVG Win: <br />
              {{ avgwinner }}
            </v-col>
            <v-col cols="12" sm="2">
              AVG Lose: <br />
              {{ avgloser }}
            </v-col>
            <v-col cols="12" sm="2">
              MAX Win: <br />
              {{ maxwinner }}
            </v-col>
            <v-col cols="12" sm="2">
              Max Lose: <br />
              {{ maxloser }}
            </v-col>
          </v-row>
        </md-card-header>
        <md-card-content>
          <md-table
            v-model="tradeItems"
            :table-header-color="
              $vuetify.theme.themes[$store.getters.usedTheme].primary
            "
          >
            <md-table-row slot="md-table-row" slot-scope="{ item }">
              <md-table-cell md-label="Datum">{{ item.datum }}</md-table-cell>
              <md-table-cell md-label="Produkt">{{
                item.produkt
              }}</md-table-cell>
              <md-table-cell md-label="Auftragsnrs">{{
                item.auftragsnr
              }}</md-table-cell>
              <md-table-cell md-label="Betrag">{{ item.betrag }}</md-table-cell>
              <md-table-cell md-label="Typ">{{ item.typ }}</md-table-cell>

              <md-table-cell md-label="Link">
                <v-icon
                  v-if="item.verlinkt"
                  :value="item.auftragsnr"
                  :produkt="item.produkt"
                  @click="
                    openCreatePopUp(
                      item.auftragsnr,
                      item.produkt,
                      item.verlinkt,
                      item.myid
                    )
                  "
                  medium
                  >mdi-link-variant</v-icon
                >
                <v-icon
                  color="red"
                  :value="item.auftragsnr"
                  :produkt="item.produkt"
                  @click="
                    openCreatePopUp(
                      item.auftragsnr,
                      item.produkt,
                      item.verlinkt,
                      item.myid
                    )
                  "
                  medium
                  v-else
                  >mdi-bell-outline</v-icon
                >
              </md-table-cell>

              <md-table-cell md-label="Picture">
                <v-icon
                  v-if="item.pic"
                  medium
                  :color="
                    $vuetify.theme.themes[$store.getters.usedTheme].primary
                  "
                  >mdi-checkbox-marked-circle</v-icon
                >
                <v-icon v-else medium color="red">mdi-alert-circle</v-icon>
              </md-table-cell>
            </md-table-row>
          </md-table>
        </md-card-content>
      </md-card>
    </div>

    <v-btn
      @click="openCreatePopUp('', '', false, '')"
      fixed
      bottom
      right
      class="mx-2"
      fab
      dark
      large
      color="cyan"
    >
      <v-icon dark> mdi-pencil </v-icon>
    </v-btn>

    <journal-info-dialog></journal-info-dialog>
  </div>
</template>

<style scoped></style>

<script>
//import axios from "axios";
import axios from "axios";

import JournalInfoDialog from "./Components/JournalInfoDialog";

export default {
  components: { JournalInfoDialog },
  name: "Dashboard",
  data() {
    return {
      journalData: {},
      product: "all",
      products: [],
      dates: [],
      tradeItems: [{}],
      theme: "light",
      dialog: false,
      filter: "all",
      crv: 0,
      winrate: 0,
      avgwinner: 0,
      avgloser: 0,
      maxwinner: 0,
      maxloser: 0,
      avg: 0,
      total: 0
    };
  },
  computed: {
    dateRangeText() {
      return this.dates.join(" ~ ");
    },
    updateNeeded() {
      return this.$store.getters.journalInfoPopUpUpdateNeeded;
    }
  },

  watch: {
    updateNeeded: function() {
      if (this.$store.getters.journalInfoPopUpUpdateNeeded != null) {
        this.getData();
      }
    }
  },
  created() {
    (this.dates[0] = new Date().toISOString().split("T")[0]),
      (this.dates[1] = new Date().toISOString().split("T")[0]);
    //this.interval = setInterval(() => this.getData(), 60000);
  },
  mounted() {
    this.getData();
  },

  methods: {
    openCreatePopUp: function(auftragsnr, produkt, verlinkt, journalID) {
      let myTyp;
      let overwrite = false;
      if (journalID == "" && auftragsnr == "") {
        journalID = new Date().getTime();
        journalID = journalID.toString();
        overwrite = true;
      }
      if (verlinkt) {
        myTyp = "oldtrade";
        this.$store.commit("setJournalInfoPopUp", {
          status: true,
          id: journalID,
          typ: myTyp,
          produkt: produkt,
          verlinken: false
        });
      } else {
        if (journalID == 0) {
          myTyp = "newtrade";
          this.$store.commit("setJournalInfoPopUp", {
            status: true,
            id: auftragsnr,
            typ: myTyp,
            produkt: produkt,
            verlinken: false
          });
        } else if (overwrite) {
          myTyp = "newtrade";
          this.$store.commit("setJournalInfoPopUp", {
            status: true,
            id: journalID,
            typ: myTyp,
            produkt: produkt,
            verlinken: false
          });
        } else if (journalID == undefined && auftragsnr != "") {
          myTyp = "newtrade";

          this.$store.commit("setJournalInfoPopUp", {
            status: true,
            id: auftragsnr,
            typ: myTyp,
            produkt: produkt,
            verlinken: true
          });
        } else {
          myTyp = "oldtrade";
          this.$store.commit("setJournalInfoPopUp", {
            status: true,
            id: journalID,
            typ: myTyp,
            produkt: produkt,
            verlinken: false
          });
        }

        // this.journalData.symbol =  produkt;
        this.$store.commit("journal/setJournalData", this.journalData);
      }
    },
    changeProduct() {
      this.getData();
    },

    getData() {
      this.journalData = this.$store.state.journal.journalData;
      this.$store.commit("journal/setJournalData", this.journalData);
      this.$store.commit("setJournalInfoPopUpUpdateNeeded", false);
      let time1 = this.dates[0];
      let time2;
      if (this.dates[1] == null || this.dates[1] == undefined) {
        time2 = this.dates[0];
      } else {
        time2 = this.dates[1];
      }

      let d1 = new Date(time1);
      let d2 = new Date(time2);

      if (d2 < d1) {
        let temp = time1;
        time1 = time2;
        time2 = temp;
      }

      axios
        .get("/api/trades", {
          params: {
            filter: this.filter,
            startTime: time1,
            endTime: time2,
            settings: {
              product: this.product
            }
          }
        })
        .then(
          response => {
            // eslint-disable-next-line
            this.products = response.data.products;
            this.tradeItems = response.data.tradeItems;
            this.total = response.data.total;
            this.avg = response.data.avg;
            this.winrate = response.data.winrate;
            this.avgwinner = response.data.avgwinner;
            this.avgloser = response.data.avgloser;
            this.maxwinner = response.data.maxwinner;
            this.maxloser = response.data.maxloser;
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
