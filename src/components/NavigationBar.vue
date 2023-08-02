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
    <ClientSelectList />
    <br />

    <router-link
      to="/clientinfo"
      id="client-info-nav"
      :class="linkDisabled ? 'disabled' : 'active'"
      :event="linkDisabled ? 'none' : 'click'"
    >
      Client Info
    </router-link>
    <br />

    <router-link
      to="/tasks"
      id="task-list-nav"
      :class="linkDisabled ? 'disabled' : 'active'"
      :event="linkDisabled ? 'none' : 'click'"
    >
      Tasks
    </router-link>
    <br />

    <router-link
      to="/filetransfers"
      id="file-transfer-nav"
      :class="linkDisabled ? 'disabled' : 'active'"
      :event="linkDisabled ? 'none' : 'click'"
    >
      File Transfers
    </router-link>
    <br />

    <router-link
      to="/projects"
      id="project-list-nav"
      :class="linkDisabled ? 'disabled' : 'active'"
      :event="linkDisabled ? 'none' : 'click'"
    >
      Project List
    </router-link>
    <br />

    <router-link
      to="/notices"
      id="notice-list-nav"
      :class="linkDisabled ? 'disabled' : 'active'"
      :event="linkDisabled ? 'none' : 'click'"
    >
      Notices
    </router-link>
    <br />

    <router-link
      to="/messages"
      id="message-list-nav"
      :class="linkDisabled ? 'disabled' : 'active'"
      :event="linkDisabled ? 'none' : 'click'"
    >
      Messages
    </router-link>
  </b-sidebar>
</template>

<script>
import { mapGetters } from "vuex";
import ClientSelectList from "./navigation/ClientSelectList.vue";

export default {
  name: "NavigationBar",
  components: {
    ClientSelectList,
  },
  computed: {
    linkDisabled() {
      return this.activeClientId == "";
    },
  },
  ...mapGetters("clients", ["activeClientId"]),
};
</script>

<style scoped>
.disabled {
  text-decoration: none;
  color: grey;
  cursor: default;
}
</style>
