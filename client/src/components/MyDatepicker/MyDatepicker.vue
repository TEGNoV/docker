    <template>
  <v-container>
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
  </v-container>
</template>

<script>
export default {
  name: "my-datepicker",
  data() {
    return {
      values: {
        historyMap: []
      },
      historyID: ""
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.v-text-field input {
  font-size: 1em;
}
</style>