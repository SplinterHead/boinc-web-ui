<template>
  <div>
    <b-card
      v-for="client in allClients"
      :key="client.id"
      class="client-card"
      large
      @click="setActiveClient(client.id)"
    >
      <b-card-body>
        <span>
          <ServerIcon class="icon-2x client-icon" />
        </span>
        <h3>{{ client.name }}</h3>
        - <i>{{ client.hostname }}</i>
      </b-card-body>
    </b-card>
    <b-button id="new-client-btn" v-b-modal.new-client-modal>
      Add Client
    </b-button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

import ServerIcon from "vue-material-design-icons/Server.vue";

export default {
  name: "ClientList",
  components: {
    ServerIcon,
  },
  mounted() {
    this.updateClients();
  },
  methods: {
    ...mapActions("clients", ["setActiveClient", "updateClients"]),
  },
  computed: {
    ...mapGetters("clients", ["allClients"]),
  },
};
</script>

<style scoped>
div {
  text-align: center;
}

.card {
  width: 50%;
  margin: auto;
  margin-bottom: 3px;
  cursor: pointer;
}

.card-body {
  display: flex;
  text-align: left;
  align-items: center;
  padding: 8px;
}

.card-body h3 {
  margin: 0px 10px;
}

.material-design-icon.icon-2x,
.material-design-icon.icon-2x > .material-design-icon__svg {
  height: 2em;
  width: 2em;
}

#new-client-btn {
  margin-top: 10px;
}
</style>
