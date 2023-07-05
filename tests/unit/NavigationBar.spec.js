import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BSidebar, BootstrapVue } from "bootstrap-vue";
import Vuex from "vuex";
import VueRouter from "vue-router";

import NavigationBar from "@/components/NavigationBar.vue";

const localVue = createLocalVue();
const localRouter = new VueRouter();

localVue.use(BootstrapVue);
localVue.use(Vuex);
localVue.use(VueRouter);

let wrapper;
let state;
let getters;
let store;

const sidebar = () => wrapper.findComponent(BSidebar);
const taskListLink = () => sidebar().get("#task-list-nav");
const projectListLink = () => sidebar().get("#project-list-nav");
const noticeListLink = () => sidebar().get("#notice-list-nav");
const messageListLink = () => sidebar().get("#message-list-nav");

state = {
  activeClientId: "",
};
getters = {
  activeClientId: () => state.activeClientId,
};
store = new Vuex.Store({
  modules: {
    clients: {
      state,
      getters,
      namespaced: true,
    },
  },
});

function createWrapper() {
  wrapper = shallowMount(NavigationBar, {
    store,
    localRouter,
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

      expect(taskListLink().text()).toBe("Tasks");
      expect(projectListLink().text()).toBe("Project List");
      expect(noticeListLink().text()).toBe("Notices");
      expect(messageListLink().text()).toBe("Messages");
    });
  });
});
