<template>
  <b-sidebar
    class="text-center"
    id="navigation-side-bar"
    title="BOINC Client"
    bg-variant="dark"
    text-variant="light"
    shadow
  >
    <ClientSelectList
      :active-client="activeClient"
      :clients="clients"
      @add-client="addClient"
      @select-client="setActiveClient"
    />
    <b-button
      id="project-list-btn"
      class="w-75"
      @click="setActivePane('projectlist')"
    >
      Project List
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
  created() {
    axios
      .get(`${process.env.VUE_APP_API_URL}/clients/getall`)
      .then((response) => {
        response.data.forEach((client) => {
          console.log(client);
          this.$emit("add-client", client);
        });
      });
  },
};
</script>
