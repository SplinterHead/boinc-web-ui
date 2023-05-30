import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";

import App from "@/App";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

describe("App.vue", () => {
  describe("a menu button", () => {
    it("is rendered", async () => {
      const wrapper = shallowMount(App, { localVue });
      const menuBtn = wrapper.get("#menu-btn");
      expect(menuBtn.isVisible()).toBe(true);
    });
  });
});
