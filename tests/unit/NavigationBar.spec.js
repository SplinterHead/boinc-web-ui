import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { BSidebar, BootstrapVue } from "bootstrap-vue";
import axios from "axios";

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
      const newClientButton = sidebar.find("#new-client-btn");
      expect(newClientButton.text()).toBe("Add New Client...");
    });

    it("has a menu entry for seeing the project list", async () => {
      const projectListButton = sidebar.find("#project-list-btn");
      expect(projectListButton.text()).toBe("Project List");
    });
  });

  describe("collects data on creation", () => {
    const testProjects = {
      status: 200,
      data: [],
    };
    jest.spyOn(axios, "get").mockResolvedValue(testProjects);
    it("requests a list of currently configured clients", () => {
      shallowMount(NavigationBar, { localVue });
      expect(axios.get).toBeCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(
        expect.stringMatching(/.*\/getall/)
      );
    });
  });
});
