<template>
  <div>
    <b-dropdown
      split
      v-if="clients.length > 0"
      id="client-dropdown"
      :text="!activeClient.name ? 'Select Client...' : activeClient.name"
      toggleText=""
    >
      <b-dropdown-item
        v-for="client in clients"
        :key="client.id"
        @click="setActiveClient(client)"
      >
        {{ client.name }}
      </b-dropdown-item>
    </b-dropdown>
    <b-button id="new-client-btn" v-else v-b-modal.new-client-modal>
      Add New Client...
    </b-button>
    <NewClientModal @add-client="addClient" />
  </div>
</template>

<script>
import NewClientModal from "@/components/navigation/NewClientModal";

export default {
  name: "ClientListSelect",
  components: {
    NewClientModal,
  },
  props: {
    activeClient: {},
    clients: [],
  },
  methods: {
    addClient(e) {
      this.$emit("add-client", e);
    },
    setActiveClient(client) {
      this.$emit("select-client", client);
    },
  },
};
</script>
