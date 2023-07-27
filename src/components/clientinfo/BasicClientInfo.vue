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
            {{ clientState.host_info.os_name }}
          </div>
        </b-col>
      </b-row>
    </b-container>
  </b-card>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";

export default {
  name: "BasicClientInfo",
  data() {
    return {
      clientState: {
        host_info: {
          os_name: null,
        },
        version: {
          major: null,
          minor: null,
          patch: null,
        },
      },
    };
  },
  mounted() {
    this.getClientState();
  },
  computed: {
    versionString() {
      return (
        "v" +
        [
          this.clientState.version.major,
          this.clientState.version.minor,
          this.clientState.version.patch,
        ].join(".")
      );
    },
    ...mapGetters("clients", ["activeClient"]),
  },
  methods: {
    getClientState() {
      if (this.activeClient.id) {
        axios
          .get(
            `${process.env.VUE_APP_API_URL}/client/state?client=${this.activeClient.id}`
          )
          .then((response) => {
            this.clientState = response.data;
          });
      }
    },
  },
  watch: {
    activeClientId() {
      this.getClientState();
    },
  },
};
</script>
