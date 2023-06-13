<template>
  <div>
    Client Info
    <BasicClientInfo :activeClient="activeClient" />
  </div>
</template>

<script>
import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";
// import axios from "axios";

export default {
  name: "ClientInfo",
  components: {
    BasicClientInfo,
  },
  props: {
    activeClient: {},
  },
};
</script>
