<template>
  <div>
    <h1>Client Info</h1>
    <b-row>
      <b-col cols="4" class="p-1">
        <BasicClientInfo
          :activeClient="activeClient"
          :activeClientState="activeClientState"
        />
      </b-col>
      <b-col cols="8" class="p-1">
        <ClientProjects
          :activeClient="activeClient"
          :activeClientState="activeClientState"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col class="p-1">
        <ClientResults
          :projects="activeClientState.projects"
          :results="activeClientState.results"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>
import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";
import ClientProjects from "@/components/clientinfo/ClientProjects.vue";
import ClientResults from "@/components/clientinfo/ClientResults.vue";

export default {
  name: "ClientInfo",
  components: {
    BasicClientInfo,
    ClientProjects,
    ClientResults,
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
