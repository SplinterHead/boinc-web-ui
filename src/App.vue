<template>
  <div id="app">
    <NavigationBar @select-pane="selectActivePane" />
    <div id="active-pane">
      <ClientInfo v-show="activePane == 'clientinfo'" />
      <ProjectList v-show="activePane == 'projectlist'" />
      <NoticeList v-show="activePane == 'noticelist'" />
      <MessageList v-show="activePane == 'messagelist'" />
    </div>
  </div>
</template>

<script>
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
      activePane: "",
    };
  },
  methods: {
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
