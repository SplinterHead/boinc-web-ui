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
  </b-sidebar>
</template>

<script>
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
  },
};
</script>
