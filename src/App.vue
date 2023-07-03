<template>
  <div id="app">
    <NavigationBar @select-pane="selectActivePane" />
    <div id="active-pane">
      <ClientInfo
        v-if="activeClient.name && activePane == 'clientinfo'"
        :activeClient="activeClient"
        :activeClientState="activeClientState"
      />
      <ProjectList
        v-if="activeClient.name && activePane == 'projectlist'"
        :activeClient="activeClient"
        :activeClientPlatform="activeClientState.platform_name"
      />
      <NoticeList v-if="activeClient.name && activePane == 'noticelist'" />
      <MessageList v-if="activeClient.name && activePane == 'messagelist'" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

import ClientInfo from "./components/ClientInfo.vue";
import MessageList from "./components/MessageList.vue";
import NoticeList from "./components/NoticeList.vue";
import NavigationBar from "./components/NavigationBar.vue";
import ProjectList from "./components/ProjectList.vue";

export default {
  name: "App",
  components: {
    ClientInfo,
    MessageList,
    NoticeList,
    NavigationBar,
    ProjectList,
  },
  data() {
    return {
      activeClientState: {},
      activePane: "",
      timer: "",
    };
  },
  created() {
    this.timer = setInterval(this.getActiveClientState, 5000);
  },
  beforeUnmount() {
    clearInterval(this.timer);
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
    selectActiveClient() {
      this.getActiveClientState();
    },
    selectActivePane(pane) {
      this.activePane = pane;
    },
  },
  computed: {
    ...mapGetters("clients", ["activeClient", "activeClientId"]),
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 10px;
}

#active-pane {
  margin-left: 350px;
  margin-right: 30px;
}
</style>
