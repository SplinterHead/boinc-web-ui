<template>
  <div>
    <b-nav-item-dropdown v-if="clients.length > 0" id="client-dropdown">
      <b-dropdown-item v-for="client in clients" :key="client.id">
        {{ client.name }}
      </b-dropdown-item>
    </b-nav-item-dropdown>
    <b-button id="new-client-btn" v-else v-b-modal.new-client-modal>
      Add New Client...
    </b-button>
    <NewClientModal />
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
};
</script>
