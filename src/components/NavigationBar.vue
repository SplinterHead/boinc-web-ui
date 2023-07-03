<template>
  <b-sidebar
    class="text-center"
    id="navigation-side-bar"
    title="BOINC Client"
    bg-variant="dark"
    text-variant="light"
    shadow
    :visible="true"
    :no-close-on-backdrop="true"
    :no-close-on-esc="true"
    :no-close-on-route-change="true"
    :no-header-close="true"
  >
    <ClientSelectList @set-active-pane="setActivePane" />
    <b-button
      id="project-list-nav"
      class="w-75"
      @click="setActivePane('projectlist')"
    >
      Project List
    </b-button>
    <b-button
      id="notice-list-nav"
      class="w-75"
      @click="setActivePane('noticelist')"
    >
      Notices
    </b-button>
    <b-button
      id="message-list-nav"
      class="w-75"
      @click="setActivePane('messagelist')"
    >
      Messages
    </b-button>
  </b-sidebar>
</template>

<script>
import ClientSelectList from "./navigation/ClientSelectList.vue";

export default {
  name: "NavigationBar",
  components: {
    ClientSelectList,
  },
  methods: {
    setActivePane(pane) {
      this.$emit("select-pane", pane);
    },
  },
};
</script>
