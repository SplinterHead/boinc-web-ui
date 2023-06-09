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
      <ProjectList
        v-if="activeClient.name && activePane == 'projectlist'"
        :activeClient="activeClient"
      />
    </div>
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

#active-pane {
  margin-left: 350px;
  margin-right: 30px;
}
</style>
