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
            {{ clientPlatform }}
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import axios from "axios";

export default {
  name: "BasicClienInfo",
  props: {
    activeClient: {
      type: Object,
      requried: true,
    },
  },
  data() {
    return {
      clientVersion: {
        major: 0,
        minor: 0,
        patch: 0,
      },
      clientPlatform: "",
    };
  },
  mounted() {
    if (this.activeClient.name) {
      axios
        .get(
          `${process.env.VUE_APP_API_URL}/client/basicinfo?client=${this.activeClient.id}`
        )
        .then((response) => {
          this.clientVersion = response.data.version;
          this.clientPlatform = response.data.host_info.os_name;
        });
    }
  },
  computed: {
    versionString() {
      return (
        "v" +
        [
          this.clientVersion.major,
          this.clientVersion.minor,
          this.clientVersion.patch,
        ].join(".")
      );
    },
  },
};
</script>
