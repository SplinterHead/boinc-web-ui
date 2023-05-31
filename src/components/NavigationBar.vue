<template>
  <b-sidebar
    id="navigation-side-bar"
    title="BOINC Client"
    bg-variant="dark"
    text-variant="light"
    shadow
  >
    <ClientSelectList :active-client="activeClient" :clients="clients" />
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
};
</script>
