const journal = {
  namespaced: true,
  state: () => ({
    //this.$store.state.dashboard.dashupdates.winloss
    dashboardStatsFilter: {
      startDate: "",
      endDate: "",
      isDocumented: false,
      isLinked: false,
      strategy: ""
    },

    dashboardStatsUpdate: false,
    dashupdates: {
      performance: false,
      winloss: false,
      history: false
    }
  }),
  mutations: {
    setDashboardStatsFilter(state, dashboardStatsFilter) {
      state.dashboardStatsFilter = dashboardStatsFilter;
      state.dashboardStatsUpdate = true;
    },

    setDashboardPerformanceUpdate(state, typ) {
      state.dashupdates.performance = typ;
    },
    setDashboardWinlossUpdate(state, typ) {
      state.dashupdates.winloss = typ;
    },
    setDashboardHistoryUpdate(state, typ) {
      state.dashupdates.history = typ;
    },

    setDashboardStatsUpdate(state, dashboardStatsUpdate) {
      state.dashboardStatsUpdate = dashboardStatsUpdate;
    },

    restDashboardStatsFilter(state) {
      state.dashboardStatsFilter = {};
    }
  }
};
export default journal;
