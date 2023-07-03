import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BSidebar, BootstrapVue } from "bootstrap-vue";
import Vuex from "vuex";

import NavigationBar from "@/components/NavigationBar.vue";

const localVue = createLocalVue();

localVue.use(BootstrapVue);
localVue.use(Vuex);

let wrapper;
let state;
let getters;
let actions;
let store;

const sidebar = () => wrapper.findComponent(BSidebar);
const projectListButton = () => wrapper.get("#project-list-nav");
const noticeListButton = () => wrapper.get("#notice-list-nav");
const messageListButton = () => wrapper.get("#message-list-nav");

state = {
  activeClientId: "",
  allClients: [],
};
getters = {
  activeClient: () => {},
  allClients: () => [],
};
actions = {
  updateClients: jest.fn(),
};
store = new Vuex.Store({
  modules: {
    clients: {
      state,
      getters,
      actions,
      namespaced: true,
    },
  },
});

function createWrapper() {
  wrapper = shallowMount(NavigationBar, {
    localVue,
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("NavigationBar.vue", () => {
  describe("renders with the expected elements", () => {
    it("has a title of 'BOINC Client'", () => {
      createWrapper();

      expect(sidebar().attributes("title")).toBe("BOINC Client");
    });

    it("has all menu entries", () => {
      createWrapper();

      expect(projectListButton().text()).toBe("Project List");
      expect(noticeListButton().text()).toBe("Notices");
      expect(messageListButton().text()).toBe("Messages");
    });
  });
});
