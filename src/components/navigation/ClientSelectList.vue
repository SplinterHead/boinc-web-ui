<template>
  <div>
    <b-dropdown
      split
      class="w-75"
      v-if="clients.length > 0"
      id="client-dropdown"
      :text="
        !activeClient.name
          ? 'Select Client...'
          : activeClient.name | truncate(21, '...')
      "
      toggleText=""
      @click="setActivePane()"
    >
      <b-dropdown-item
        v-for="client in clients"
        :key="client.id"
        @click="setActiveClient(client)"
      >
        {{ client.name | truncate(21, "...") }}
      </b-dropdown-item>
      <b-dropdown-divider />
      <b-dropdown-item v-b-modal.new-client-modal>
        Add New Client...
      </b-dropdown-item>
    </b-dropdown>
    <b-button
      v-else
      id="new-client-nav"
      class="w-75"
      v-b-modal.new-client-modal
    >
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
    setActivePane() {
      this.$emit("set-active-pane", "clientinfo");
    },
  },
  filters: {
    truncate: function (text, length, suffix) {
      if (text.length > length) {
        return text.substring(0, length) + suffix;
      } else {
        return text;
      }
    },
  },
};
</script>

<style>
.dropdown-toggle {
  flex-grow: 0 !important;
}
</style>
