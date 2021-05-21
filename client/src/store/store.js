import Vuex from "vuex";
import Vue from "vue";
import journal from "./components/journal";
import dashboard from "./components/dashboard";
import global from "./components/global";
Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    tester: "dumm",
    settings: {
      Dashboard: {
        LinechartLimit: 20,
        LinechartPeriod: "Days"
      }
    },
    flavor: 2,
    journalCreatePopUp: false,
    journalInfoPopUp: false,
    journalInfoPopUpId: null,
    journalInfoPopUpTyp: "",
    journalInfoPicturePopUp: false,
    journalUpdateNeeded: false,
    journalInfoPopUpProdukt: "22",
    journalInfoPopUpUpdateNeeded: false,
    journalInfoPopUpVerlinken: false,
    authentication: false,
    usedTheme: "light",
    historyMap: []
  },
  mutations: {
    setHistoryMap(state, map) {
      state.historyMap = map;
    },

    setJournalInfoPicturePopUp(state, status) {
      state.journalInfoPicturePopUp = status;
    },
    setAuthentication(state, status) {
      state.authentication = status;
    },
    setJournalInfoPopUpUpdateNeeded(state, status) {
      state.journalInfoPopUpUpdateNeeded = status;
    },
    setJournalCreatePopUp(state, { status, id }) {
      state.journalCreatePopUp = status;
      state.journalInfoPopUpId = id;
    },
    setJournalUpdateNeeded(state, status) {
      state.journalUpdateNeeded = status;
    },
    setJournalInfoPopUp(state, { status, id, typ, produkt, verlinken }) {
      state.journalInfoPopUp = status;
      state.journalInfoPopUpTyp = typ;
      state.journalInfoPopUpProdukt = produkt;
      state.journalInfoPopUpVerlinken = verlinken;
      if (status == false) {
        state.journalInfoPopUpId = id;
      } else {
        state.journalInfoPopUpId = id;
      }
    },

    setSettings(state, settings) {
      state.settings = settings;
    },

    change(state, flavor) {
      state.flavor = flavor;
    },
    setTheme(state, usedTheme) {
      state.usedTheme = usedTheme;
    }
  },
  getters: {
    journalInfoPopUpVerlinken: state => state.journalInfoPopUpVerlinken,
    gettest: state => state.tester,
    getSettings: state => state.settings,
    journalInfoPicturePopUp: state => state.journalInfoPicturePopUp,
    authentication: state => state.authentication,
    journalInfoPopUpUpdateNeeded: state => state.journalInfoPopUpUpdateNeeded,
    flavor: state => state.flavor,
    usedTheme: state => state.usedTheme,
    journalCreatePopUp: state => state.journalCreatePopUp,
    journalInfoPopUp: state => state.journalInfoPopUp,
    journalInfoPopUpId: state => state.journalInfoPopUpId,
    journalUpdateNeeded: state => state.journalUpdateNeeded,
    journalInfoPopUpTyp: state => state.journalInfoPopUpTyp,
    journalInfoPopUpProdukt: state => state.journalInfoPopUpProdukt,

    historyMap: state => state.historyMap
  },
  modules: {
    journal: journal,
    dashboard: dashboard,
    global: global
  }
});
