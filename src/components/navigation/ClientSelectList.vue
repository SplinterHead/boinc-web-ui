<template>
  <div>
    <b-dropdown
      split
      class="w-75"
      v-show="allClients.length > 0"
      id="client-dropdown"
      :text="
        !activeClient.name
          ? 'Select Client...'
          : activeClient.name | truncate(21, '...')
      "
      toggleText=""
    >
      <b-dropdown-item
        v-for="client in allClients"
        :key="client.id"
        @click="setActiveClient(client.id)"
      >
        {{ client.name | truncate(21, "...") }}
      </b-dropdown-item>
      <b-dropdown-divider />
      <b-dropdown-item v-b-modal.new-client-modal>
        Add New Client...
      </b-dropdown-item>
    </b-dropdown>
    <b-button
      v-show="allClients.length == 0"
      id="new-client-nav"
      class="w-75"
      v-b-modal.new-client-modal
    >
      Add New Client...
    </b-button>
    <NewClientModal @update-clients="updateClients()" />
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import NewClientModal from "@/components/navigation/NewClientModal";

export default {
  name: "ClientListSelect",
  components: {
    NewClientModal,
  },
  methods: {
    ...mapActions("clients", ["setActiveClient", "updateClients"]),
  },
  computed: {
    ...mapGetters("clients", ["activeClient", "allClients"]),
  },
  mounted() {
    this.updateClients();
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
