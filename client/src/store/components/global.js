const global = {
  namespaced: true,
  state: () => ({
    settings: {
      strategyItems: [
        "",
        "Markttechnik",
        "Spielerrei",
        "Fire-Forget",
        "Umkehr",
        "Tradingview V1"
      ],
      selectPeriodItems: ["", "1m", "5m", "15m", "1h", "4h", "other"]
    },
    risk: {
      r1: 10,
      r2: 5,
      r3: 2,
      r4: 1,
      r5: 0.5
    },

    options: {
      yearStart: "2021-01-10"
    },
    dashboardStatsUpdate: false
  }),
  mutations: {}
};
export default global;
