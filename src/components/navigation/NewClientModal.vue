<template>
  <b-modal
    id="new-client-modal"
    title="New BOINC Client"
    :busy="loading"
    @ok="emitDataAndReset"
    @cancel="resetForm"
    @close="resetForm"
  >
    <b-form>
      <b-form-group
        id="name-group"
        label="Friendly Name"
        label-for="name-field"
        description="Required"
      >
        <b-form-input id="name-field" type="text" v-model="client.name" />
      </b-form-group>
      <b-form-group
        id="hostname-group"
        label="Hostname / IP"
        label-for="hostname-field"
        description="Required"
      >
        <b-form-input
          id="hostname-field"
          type="text"
          v-model="client.hostname"
        />
      </b-form-group>
      <b-form-group
        id="port-group"
        label="Port"
        label-for="port-field"
        description="Optional"
      >
        <b-form-input
          id="port-field"
          type="number"
          v-model="client.port"
          placeholder="31416"
        />
      </b-form-group>
      <b-form-group
        id="password-group"
        label="RPC Password"
        label-for="password-field"
        description="Optional"
      >
        <b-form-input
          id="password-field"
          type="password"
          v-model="client.password"
        />
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
import axios from "axios";

export default {
  name: "NewClientModal",
  data() {
    return {
      client: {
        hostname: "",
        name: "",
        port: 31416,
        password: "",
      },
      loading: false,
    };
  },
  methods: {
    async emitDataAndReset(e) {
      e.preventDefault();
      this.loading = true;
      await axios
        .post(`${process.env.VUE_APP_API_URL}/clients/add`, this.client)
        .then((response) => {
          this.client["clientId"] = response.data.client_id;
          this.$emit("add-client", this.client);
          this.$bvModal.hide("new-client-modal");
          this.resetForm();
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetForm() {
      this.client.name = "";
      this.client.hostname = "";
      this.client.port = 31416;
      this.client.password = "";
    },
  },
};
</script>
