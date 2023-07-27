import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { BCard, BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import BasicClientInfo from "@/components/clientinfo/BasicClientInfo.vue";

const localVue = createLocalVue();

localVue.use(BootstrapVue);
localVue.use(Vuex);

let getters;
let state;
let store;
let wrapper;

const sampleClientState = {
  host_info: { os_name: "Windows" },
  version: { major: 1, minor: 2, patch: 3 },
};

const clientCard = () => wrapper.getComponent(BCard);
const clientCardTitle = () => clientCard().attributes("title");
const clientVersion = () => clientCard().get("#client-version");
const clientPlatform = () => clientCard().get("#client-platform");

function createWrapper() {
  state = {
    activeClient: {
      name: "Test Server",
      id: "123",
    },
  };
  getters = {
    activeClient: () => state.activeClient,
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

  wrapper = shallowMount(BasicClientInfo, {
    localVue,
    store,
  });
}

afterEach(() => {
  mockAxios.reset();
  wrapper.destroy();
});

describe("BasicClientInfo.vue", () => {
  it("includes the user-supplied server name", () => {
    createWrapper();

    expect(clientCardTitle()).toBe("Test Server");
  });

  it("calls the client state API endpoint", () => {
    createWrapper();

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/.*\/client\/state\?client=123/)
    );
  });

  it("includes the client's version number", () => {
    createWrapper();
    mockAxios.mockResponse({
      data: sampleClientState,
    });

    wrapper.vm.$nextTick().then(() => {
      expect(clientVersion().isVisible()).toBeTruthy();
      expect(clientVersion().text()).toBe("v1.2.3");
    });
  });

  it("includes the client's platform", () => {
    createWrapper();
    mockAxios.mockResponse({
      data: sampleClientState,
    });

    wrapper.vm.$nextTick().then(() => {
      expect(clientPlatform().text()).toBe("Windows");
    });
  });
});
