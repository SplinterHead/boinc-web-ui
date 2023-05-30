<template>
  <b-sidebar
    id="navigation-side-bar"
    title="BOINC Client"
    bg-variant="dark"
    text-variant="light"
    shadow
  >
    <b-button v-b-modal.new-client-modal>Add New Client...</b-button>
    <NewClientModal />
  </b-sidebar>
</template>

<script>
import NewClientModal from "@/components/navigation/NewClientModal";

export default {
  name: "NavigationBar",
  components: {
    NewClientModal,
  },
};
</script>
