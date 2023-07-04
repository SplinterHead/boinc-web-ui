import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import ClientInfo from "@/components/ClientInfo.vue";

let getters;
let state;
let store;
let wrapper;

const localVue = createLocalVue();

localVue.use(BootstrapVue);
localVue.use(Vuex);

state = {
  activeClient: {
    name: "Test Client",
  },
  activeClientId: "123",
};
getters = {
  activeClient: () => state.activeClient,
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
  wrapper = shallowMount(ClientInfo, {
    store,
    localVue,
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("ClientInfo.vue", () => {
  it("requests active client state from API", () => {
    createWrapper();

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/.*\/client\/state\?client=123/)
    );
  });
});
