<template>
  <div id="app">
    <NavigationBar />
    <ClientList class="active-pane client-list" v-if="!activeClientId" />
    <router-view class="active-pane" v-if="activeClientId" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import NavigationBar from "@/components/NavigationBar.vue";
import ClientList from "@/components/ClientList.vue";

export default {
  name: "App",
  components: {
    ClientList,
    NavigationBar,
  },
  computed: {
    ...mapGetters("clients", ["activeClientId"]),
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

.active-pane {
  margin-left: 350px;
  margin-right: 30px;
}

.client-list {
  margin-top: 35vh;
  margin-bottom: 65vh;
}
</style>
