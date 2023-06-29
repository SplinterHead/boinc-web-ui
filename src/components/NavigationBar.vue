<template>
  <b-sidebar
    class="text-center"
    id="navigation-side-bar"
    title="BOINC Client"
    bg-variant="dark"
    text-variant="light"
    shadow
    :visible="forceDisplay"
    :no-close-on-backdrop="forceDisplay"
    :no-close-on-esc="forceDisplay"
    :no-close-on-route-change="forceDisplay"
    :no-header-close="forceDisplay"
  >
    <ClientSelectList
      :active-client="activeClient"
      :clients="clients"
      @add-client="addClient"
      @select-client="setActiveClient"
      @set-active-pane="setActivePane"
    />
    <b-button
      id="project-list-btn"
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
  </b-sidebar>
</template>

<script>
import axios from "axios";
import ClientSelectList from "./navigation/ClientSelectList.vue";

export default {
  name: "NavigationBar",
  components: {
    ClientSelectList,
  },
  props: {
    activeClient: {},
    clients: [],
  },
  data() {
    return {
      forceDisplay: true,
    };
  },
  methods: {
    addClient(e) {
      this.$emit("add-client", e);
    },
    setActiveClient(client) {
      this.$emit("select-client", client);
    },
    setActivePane(pane) {
      this.$emit("select-pane", pane);
    },
  },
  mounted() {
    axios
      .get(`${process.env.VUE_APP_API_URL}/clients/getall`)
      .then((response) => {
        response.data.forEach((client) => {
          this.$emit("add-client", client);
        });
      });
  },
};
</script>
