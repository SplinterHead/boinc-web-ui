<template>
  <div>
    <BasicClientInfo
      :activeClient="activeClient"
      :activeClientState="activeClientState"
    />
    <ClientProjects
      :activeClient="activeClient"
      :activeClientState="activeClientState"
    />
  </div>
</template>

<script>
import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";
import ClientProjects from "@/components/clientinfo/ClientProjects.vue";

export default {
  name: "ClientInfo",
  components: {
    BasicClientInfo,
    ClientProjects,
  },
  props: {
    activeClient: {
      type: Object,
      required: true,
    },
    activeClientState: {
      type: Object,
      required: true,
    },
  },
};
</script>
