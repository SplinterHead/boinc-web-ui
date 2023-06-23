<template>
  <b-modal
    :id="`project-${this.project.name}`"
    title="Add Project Key"
    :static="modalStatic"
    @ok="emitDataAndReset"
  >
    Please add your account key for {{ project.name }}
    <p />

    <b-form>
      <b-form-group
        id="account-key-group"
        label="Account Key"
        label-for="account-key-field"
        description="Required"
      >
        <b-form-input id="account-key-field" type="text" v-model="accountKey" />
      </b-form-group>
    </b-form>
  </b-modal>
</template>

<script>
export default {
  name: "ProjectAuthModal",
  props: {
    project: {
      type: Object,
      required: true,
    },
    modalStatic: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      accountKey: "",
    };
  },
  methods: {
    emitDataAndReset() {
      this.$emit("project-auth", this.accountKey);
      this.accountKey = "";
    },
  },
};
</script>
