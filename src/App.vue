<template>
  <div id="app">
    <NavigationBar
      :activeClient="activeClient"
      :clients="clients"
      @add-client="addClient"
      @select-client="selectActiveClient"
      @select-pane="selectActivePane"
    />
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
      <NoticeList
        v-if="activeClient.name && activePane == 'noticelist'"
        :activeClient="activeClient"
      />
      <MessageList
        v-if="activeClient.name && activePane == 'messagelist'"
        :activeClient="activeClient"
      />
    </div>
  </div>
</template>

<script>
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
      activeClient: {},
      activeClientState: {},
      activePane: "",
      clients: [],
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
    addClient(e) {
      this.clients.push(JSON.parse(JSON.stringify(e)));
    },
    getActiveClientState() {
      if (this.activeClient.id) {
        axios
          .get(
            `${process.env.VUE_APP_API_URL}/client/state?client=${this.activeClient.id}`
          )
          .then((response) => (this.activeClientState = response.data));
      }
    },
    selectActiveClient(client) {
      this.activeClient = client;
      this.getActiveClientState();
    },
    selectActivePane(pane) {
      this.activePane = pane;
    },
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
