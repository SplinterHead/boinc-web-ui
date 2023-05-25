import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BButton, BSidebar, BootstrapVue } from "bootstrap-vue";

import NavigationBar from "@/components/NavigationBar";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

describe("NavigationBar renders", () => {
  const wrapper = shallowMount(NavigationBar, { localVue });
  const sidebar = wrapper.findComponent(BSidebar);

  it("has a title of 'BOINC Client'", () => {
    expect(sidebar.attributes("title")).toBe("BOINC Client");
  });

  it("has a button for adding a new client", () => {
    const newClientButton = sidebar.getComponent(BButton);
    expect(newClientButton.text()).toBe("Add New Client...");
  });
});
