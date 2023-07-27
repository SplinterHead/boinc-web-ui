import { createLocalVue, shallowMount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import { routes } from "@/router.js";

import App from "@/App.vue";
import ClientList from "@/components/ClientList.vue";
import NavigationBar from "@/components/NavigationBar.vue";

let wrapper;
let state;
let getters;
let store;

const localVue = createLocalVue();
const localRouter = new VueRouter({ routes });

localVue.use(BootstrapVue);
localVue.use(VueRouter);
localVue.use(Vuex);

const clientList = () => wrapper.findComponent(ClientList);
const navigationBar = () => wrapper.findComponent(NavigationBar);

function createWrapper(clientId) {
  state = {
    activeClientId: clientId,
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

  wrapper = shallowMount(App, {
    localVue,
    localRouter,
    store,
  });
}

describe("App.vue", () => {
  it("displays the navigation bar", () => {
    createWrapper();
    expect(navigationBar().isVisible()).toBe(true);
  });

  it("shows the client select menu when there isn't an active client", () => {
    createWrapper();
    expect(clientList().exists()).toBe(true);
  });

  it("hides the client select menu when there is an active client", () => {
    createWrapper("123");
    expect(clientList().exists()).toBe(false);
  });
});
