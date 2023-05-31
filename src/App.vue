<template>
  <div id="app">
    <b-button id="menu-btn" v-b-toggle.navigation-side-bar>Menu</b-button>
    <NavigationBar
      :active-client="activeClient"
      :clients="clients"
      @add-client="addClient"
    />
  </div>
</template>

<script>
import NavigationBar from "./components/NavigationBar.vue";

export default {
  name: "App",
  components: {
    NavigationBar,
  },
  data() {
    return {
      activeClient: {},
      clients: [],
    };
  },
  methods: {
    addClient(e) {
      this.clients.push(JSON.parse(JSON.stringify(e)));
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
