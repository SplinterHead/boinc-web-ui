import { createLocalVue, mount } from "@vue/test-utils";
import { BButton, BSidebar, BootstrapVue } from "bootstrap-vue";

import NavigationBar from "@/components/NavigationBar.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

describe("NavigationBar.vue", () => {
  const wrapper = mount(NavigationBar, {
    localVue,
    propsData: {
      activeClient: {},
      clients: [],
    },
  });
  const sidebar = wrapper.findComponent(BSidebar);

  describe("renders with the expected elements", () => {
    it("has a title of 'BOINC Client'", () => {
      expect(sidebar.props("title")).toBe("BOINC Client");
    });

    it("has a button for adding a new client", () => {
      const newClientButton = sidebar.getComponent(BButton);
      expect(newClientButton.text()).toBe("Add New Client...");
    });
  });
});
