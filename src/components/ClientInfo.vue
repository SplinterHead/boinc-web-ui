<template>
  <div>
    <h1>Client Info</h1>
    <BasicClientInfo
      :activeClient="activeClient"
      :activeClientState="activeClientState"
    />
    <DiskInfo />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";
import DiskInfo from "@/components/clientinfo/DiskInfo.vue";

export default {
  name: "ClientInfo",
  components: {
    BasicClientInfo,
    DiskInfo,
  },
  data() {
    return {
      activeClientState: {},
      timer: "",
    };
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
      if (this.activeClientId) {
        axios
          .get(
            `${process.env.VUE_APP_API_URL}/client/state?client=${this.activeClientId}`
          )
          .then((response) => {
            this.activeClientState = response.data;
          });
      }
    },
  },
  watch: {
    activeClientId() {
      this.getActiveClientState();
    },
  },
};
</script>
