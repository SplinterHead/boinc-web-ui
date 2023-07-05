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
      <b-col cols="8" class="p-1">
        <ClientProjects :activeClientId="activeClientId" :projects="projects" />
      </b-col>
    </b-row>
    <b-row>
      <b-col class="p-1">
        <ClientResults :projects="projects" :results="results" />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";
import ClientProjects from "@/components/clientinfo/ClientProjects.vue";
import ClientResults from "@/components/clientinfo/ClientResults.vue";

export default {
  name: "ClientInfo",
  components: {
    BasicClientInfo,
    ClientProjects,
    ClientResults,
  },
  data() {
    return {
      activeClientState: {},
      projects: [],
      results: [],
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
      if (this.activeClientId) {
        console.log("Getting client info");
        axios
          .get(
            `${process.env.VUE_APP_API_URL}/client/state?client=${this.activeClientId}`
          )
          .then((response) => {
            this.activeClientState = response.data;
            this.projects = response.data.projects;
            this.results = response.data.results;
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
