import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { BSidebar, BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import NavigationBar from "@/components/NavigationBar.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

let wrapper;

const sidebar = () => wrapper.findComponent(BSidebar);
const newClientButton = () => wrapper.get("#new-client-nav");
const projectListButton = () => wrapper.get("#project-list-nav");
const noticeListButton = () => wrapper.get("#notice-list-nav");

function createWrapper(propsData) {
  wrapper = shallowMount(NavigationBar, {
    localVue,
    propsData: propsData,
  });
}

function createFullWrapper(propsData) {
  wrapper = mount(NavigationBar, {
    localVue,
    propsData: propsData,
  });
}

afterEach(() => {
  mockAxios.reset();
  wrapper.destroy();
});

describe("NavigationBar.vue", () => {
  const emptyProps = { activeClient: {}, clients: [] };

  describe("renders with the expected elements", () => {
    it("has a title of 'BOINC Client'", () => {
      createWrapper(emptyProps);

      expect(sidebar().attributes("title")).toBe("BOINC Client");
    });

    it("has a button for adding a new client", () => {
      createFullWrapper(emptyProps);

      expect(newClientButton().text()).toBe("Add New Client...");
    });

    it("has all menu entries", () => {
      createWrapper(emptyProps);

      expect(projectListButton().text()).toBe("Project List");
      expect(noticeListButton().text()).toBe("Notices");
    });
  });

  describe("collects data on creation", () => {
    it("requests a list of currently configured clients", () => {
      createWrapper({});
      expect(mockAxios.get).toBeCalledTimes(1);
      expect(mockAxios.get).toHaveBeenCalledWith(
        expect.stringMatching(/.*\/getall/)
      );
    });
  });
});
