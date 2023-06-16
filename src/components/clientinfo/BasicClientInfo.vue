<template>
  <b-card :title="activeClient.name">
    <b-container fluid="true">
      <b-row>
        <b-col>
          <label for="client-version">Version:</label>
          <div id="client-version">
            {{ versionString }}
          </div>
        </b-col>
        <b-col>
          <label for="client-platform">Platform:</label>
          <div id="client-platform">
            {{ activeClientState.host_info.os_name }}
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
export default {
  name: "BasicClientInfo",
  props: {
    activeClient: {
      type: Object,
      required: true,
    },
    activeClientState: {
      type: Object,
      requried: true,
    },
  },
  computed: {
    versionString() {
      return (
        "v" +
        [
          this.activeClientState.version.major,
          this.activeClientState.version.minor,
          this.activeClientState.version.patch,
        ].join(".")
      );
    },
  },
};
</script>
