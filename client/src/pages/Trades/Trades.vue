<template>
  <div class="content">
    <v-expansion-panels accordion>
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
              </v-row>
            </v-col>
            <v-col></v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-row>
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
    <v-row>
      <v-row>
        <v-col cols="12" sm="1"> Totoal: {{ total }} </v-col>
        <v-col cols="12" sm="1"> Winrate: {{ winrate }} </v-col>
        <v-col cols="12" sm="1"> AVG: {{ avg }} </v-col>
        <v-col cols="12" sm="1"> AVG Win: {{ avgwinner }} </v-col>
        <v-col cols="12" sm="1"> AVG Lose: {{ avgloser }} </v-col>
        <v-col cols="12" sm="1"> MAX Win: {{ maxwinner }} </v-col>
        <v-col cols="12" sm="1"> Max Lose: {{ maxloser }} </v-col>
      </v-row>
      <v-col cols="12">
        <div>
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

              <md-table-cell md-label="Picture Found">
                <v-icon
                  :value="item.auftragsnr"
                  @click="
                    openCreatePopUp(
                      item.auftragsnr,
                      item.produkt,
                      item.verlinkt,
                      item.myid
                    )
                  "
                  medium
                  :color="
                    $vuetify.theme.themes[$store.getters.usedTheme].primary
                  "
                  >mdi-information-outline</v-icon
                >
              </md-table-cell>

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

              <md-table-cell md-label="Create New">
                <v-icon
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
                  :color="
                    $vuetify.theme.themes[$store.getters.usedTheme].primary
                  "
                  >mdi-information-outline</v-icon
                >
              </md-table-cell>
            </md-table-row>
          </md-table>
        </div>
      </v-col>
    </v-row>

    <journal-create-dialog></journal-create-dialog>
    <journal-info-dialog></journal-info-dialog>
  </div>
</template>

<style scoped></style>

<script>
//import axios from "axios";
import axios from "axios";
import JournalCreateDialog from "./../JournalCreateDialog";
import JournalInfoDialog from "./../JournalInfoDialog";

export default {
  components: { JournalCreateDialog, JournalInfoDialog },
  name: "Dashboard",
  data() {
    return {
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
        myTyp = "newtrade";
        this.$store.commit("setJournalInfoPopUp", {
          status: true,
          id: auftragsnr,
          typ: myTyp,
          produkt: produkt,
          verlinken: false
        });
      }
    },
    changeProduct() {
      this.getData();
    },
    getData() {
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
