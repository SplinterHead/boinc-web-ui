<template>
  <div>
    <h1>Client Info</h1>
    <b-row>
      <b-col cols="4" class="p-1">
        <BasicClientInfo
          :activeClient="activeClient"
          :activeClientState="activeClientState"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";

export default {
  name: "ClientInfo",
  components: {
    BasicClientInfo,
  },
  data() {
    return {
      activeClientState: {},
      timer: "",
    };
  },
  created() {
    this.timer = setInterval(this.getActiveClientState, 5000);
  },
  mounted() {
    this.getActiveClientState();
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed: {
    ...mapGetters("clients", ["activeClient", "activeClientId"]),
  },
  methods: {
    getActiveClientState() {
      axios
        .get(
          `${process.env.VUE_APP_API_URL}/client/state?client=${this.activeClientId}`
        )
        .then((response) => {
          this.activeClientState = response.data;
        });
    },
  },
  watch: {
    activeClientId() {
      this.getActiveClientState();
    },
  },
};
</script>
