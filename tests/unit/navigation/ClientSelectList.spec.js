import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BDropdownItem, BootstrapVue } from "bootstrap-vue";

import ClientSelectList from "@/components/navigation/ClientSelectList.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

describe("ClientSelectList.vue", () => {
  it("renders as a button when no clients are configured", () => {
    const wrapper = shallowMount(ClientSelectList, {
      localVue,
      propsData: {
        activeClient: {},
        clients: [],
      },
    });
    expect(wrapper.find("#client-dropdown").exists()).toBe(false);
    expect(wrapper.find("#new-client-btn").exists()).toBe(true);
  });

  it("renders as a dropdown when clients are configured", () => {
    const wrapper = shallowMount(ClientSelectList, {
      localVue,
      propsData: {
        activeClient: { name: "test client" },
        clients: [
          { name: "test client" },
          { name: "test client" },
          { name: "test client" },
        ],
      },
    });
    expect(wrapper.find("#client-dropdown").exists()).toBe(true);
    expect(wrapper.find("#new-client-btn").exists()).toBe(false);

    const dropdownItems = wrapper
      .find("#client-dropdown")
      .findAllComponents(BDropdownItem);
    expect(dropdownItems.length).toBe(3);
    // expect(wrapper.get("#client-dropdown").vm.$data.dom).toBe(1);
  });
});
