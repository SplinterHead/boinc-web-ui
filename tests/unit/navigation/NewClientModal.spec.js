import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BFormInput, BootstrapVue } from "bootstrap-vue";

import NewClientModal from "@/components/navigation/NewClientModal";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

describe("NewClientModal.vue", () => {
  const wrapper = shallowMount(NewClientModal, { localVue });

  describe("it renders with the expected elements", () => {
    it("has a title of 'New Client'", () => {
      expect(wrapper.attributes("title")).toBe("New BOINC Client");
    });

    describe("it is rendered with the correct form fields", () => {
      it("has an input field for client name", () => {
        const nameGroup = wrapper.get("#name-group");
        expect(nameGroup.attributes("label")).toBe("Friendly Name");
        const nameField = nameGroup.getComponent(BFormInput);
        expect(nameField.attributes("type")).toBe("text");
      });

      it("has an input field for client hostname", () => {
        const hostnameGroup = wrapper.get("#hostname-group");
        expect(hostnameGroup.attributes("label")).toBe("Hostname / IP");
        const hostnameField = hostnameGroup.getComponent(BFormInput);
        expect(hostnameField.attributes("type")).toBe("text");
      });

      it("has an input field for client port", () => {
        const portGroup = wrapper.get("#port-group");
        expect(portGroup.attributes("label")).toBe("Port");
        const portField = portGroup.getComponent(BFormInput);
        expect(portField.attributes("type")).toBe("number");
      });

      it("has an input field for client password", () => {
        const passwordGroup = wrapper.get("#password-group");
        expect(passwordGroup.attributes("label")).toBe("RPC Password");
        const passwordField = passwordGroup.getComponent(BFormInput);
        expect(passwordField.attributes("type")).toBe("password");
      });
    });
  });
});
