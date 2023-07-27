import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { BCard, BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import NetworkStats from "@/components/clientinfo/NetworkStats.vue";

const localVue = createLocalVue();
const noNetworkStats = {};
const sampleNetworkStats = {
  "2023-06-28": { down: 50, up: 10 },
  "2023-06-29": { down: 30, up: 40 },
};

localVue.use(BootstrapVue);
localVue.use(Vuex);

let getters;
let state;
let store;
let wrapper;

const networkStatsCard = () => wrapper.getComponent(BCard);
const messageDiv = () => networkStatsCard().get("#message-div");
const networkStatsGraph = () => networkStatsCard().getComponent("canvas");

function createWrapper() {
  state = {
    activeClientId: "123",
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
  wrapper = mount(NetworkStats, {
    localVue,
    store,
    stubs: {
      LineChart: {
        template: "<canvas />",
      },
    },
  });
}

afterEach(() => {
  mockAxios.reset();
  wrapper.destroy();
});

describe("NetworkStats.vue", () => {
  it("displays the title for the card", () => {
    createWrapper();

    expect(networkStatsCard().get(".card-title").text()).toBe("Network Stats");
  });
  it("calls the network stats API endpoint", () => {
    createWrapper();

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/.*\/client\/networkstats\?client=123/)
    );
  });

  describe("message div", () => {
    it("displays 'no stats' message when not attached", () => {
      createWrapper();
      mockAxios.mockResponse({
        data: { network_transfers: noNetworkStats },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(messageDiv().isVisible()).toBe(true);
      });
    });

    it("no message is displayed when attached", () => {
      createWrapper();
      mockAxios.mockResponse({
        data: { network_transfers: sampleNetworkStats },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(messageDiv().isVisible()).toBe(false);
      });
    });
  });

  describe("network stats graph", () => {
    it("displays a graph for the given network stats", () => {
      createWrapper();
      mockAxios.mockResponse({
        data: { network_transfers: sampleNetworkStats },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(networkStatsGraph().isVisible()).toBe(true);
      });
    });
  });
});
