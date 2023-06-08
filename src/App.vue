<template>
  <div id="app">
    <b-button id="menu-btn" v-b-toggle.navigation-side-bar>Menu</b-button>
    <NavigationBar
      :activeClient="activeClient"
      :clients="clients"
      @add-client="addClient"
      @select-client="selectActiveClient"
      @select-pane="selectActivePane"
    />
    <ProjectList
      v-if="activeClient.name && activePane == 'projectlist'"
      :activeClient="activeClient"
    />
  </div>
</template>

<script>
import NavigationBar from "./components/NavigationBar.vue";
import ProjectList from "./components/ProjectList.vue";

export default {
  name: "App",
  components: {
    NavigationBar,
    ProjectList,
  },
  data() {
    return {
      activeClient: {},
      activePane: "",
      clients: [],
    };
  },
  methods: {
    addClient(e) {
      this.clients.push(JSON.parse(JSON.stringify(e)));
    },
    selectActiveClient(client) {
      this.activeClient = client;
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
</style>
