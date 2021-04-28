 <template>

      <v-dialog  v-model="dialog" max-width="300">
      <v-card>
        <v-list style="background-color: #171717;" >
          <template v-for="(item, index) in items">
            <v-list-tile active-class="accent" :class="item.myColorBG" v-if="item.action" :key="item.title" :to="item.route"  @mouseover="mouseOver" >
              <v-list-tile-action  >
                <v-icon :color="item.myColor" active-class="secondary" >{{ item.action }}</v-icon>
              </v-list-tile-action>
             
              <v-list-tile-content>
                <v-list-tile-title style="color:white"> {{ item.title }} </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider style="background-color: #464646; height: 0.5px " v-else-if="item.divider" :key="index"></v-divider>
            <v-subheader v-else-if="item.header" :key="item.header" style="color:white"> <h3> {{ item.header }}</h3></v-subheader>
          </template>
        </v-list>
      </v-card>
    </v-dialog>

</template>


  

<script>
 import {bus} from '../../../main'    
export default {
 
  name: "Navigation",
  created () {
      var vm = this
      bus.$on('dialog', function (value) {
        vm.dialog = value
      })
    },
  data: () => ({
    showMenu: false,
    x: 0,
    y: 0,
    dialog: false,
    items: [
      { header: "Bot" },
        { divider: true },
      {
        action: "label",
        title: "Overview",
        route: "BotOverview",
        myColor: "ColorShemaBacktest",
        myColorBG: "ColorShemaBGBacktest"
      },
        { divider: true },
      {
        action: "label",
        title: "Pairs",
        route: "BotPairs",
        myColor: "ColorShemaBacktest",
        myColorBG: "ColorShemaBGBacktest"
      },
      { divider: true },
      { header: "Statistic" },
        { divider: true },
      {
        action: "label",
        title: "Statistics",
        route: "Statistics",
        myColor: "ColorShemaStatistics",
        myColorBG: "ColorShemaBGStatistics"
      },
      { divider: true },
      { header: "Backtest" },
        { divider: true },
      {
        action: "label",
        title: "Backtest Result",
        route: "BacktestResult",
        myColor: "ColorShemaBot",
        myColorBG: "ColorShemaBGBot"
      },
      { divider: true },
      { header: "Settings" },
        { divider: true },
      {
        action: "label",
        title: "Deposit Whithdrawal",
        route: "SettingsDepositWhithdrawal",
        myColor: "ColorShemaSettings",
        myColorBG: "ColorShemaBGSettings"
      }
    ]
  }),

  methods: {
    mouseOver: function(){
            this.active = !this.active;   
        },
    show(e) {
      e.preventDefault();
      this.showMenu = false;
      this.x = e.clientX;
      this.y = e.clientY;
      this.$nextTick(() => {
        this.showMenu = true;
      });
    }
  }
};
</script>

