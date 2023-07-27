<template>
  <div>
    <h1>Client Info</h1>
    <BasicClientInfo />
    <DiskInfo />
    <NetworkStats />
  </div>
</template>

<script>
import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";
import DiskInfo from "@/components/clientinfo/DiskInfo.vue";
import NetworkStats from "@/components/clientinfo/NetworkStats.vue";

export default {
  name: "ClientInfo",
  components: {
    BasicClientInfo,
    DiskInfo,
    NetworkStats,
  },
};
</script>
