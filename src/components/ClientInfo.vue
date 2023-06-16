<template>
  <div>
    <BasicClientInfo
      :activeClient="activeClient"
      :activeClientState="activeClientState"
    />
  </div>
</template>

<script>
import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";

export default {
  name: "ClientInfo",
  components: {
    BasicClientInfo,
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
