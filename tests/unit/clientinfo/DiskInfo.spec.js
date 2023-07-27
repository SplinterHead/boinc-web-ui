import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";
import { BCard, BTable, BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import DiskInfo from "@/components/clientinfo/DiskInfo.vue";

const localVue = createLocalVue();
const smallDiskWithoutProjects = {
  d_allowed: 3200000,
  d_boinc: 120000,
  d_free: 16000000,
  d_total: 32000000,
  projects: [],
};
const simpleDiskWithProjects = {
  d_allowed: 3200000,
  d_boinc: 120000,
  d_free: 16000000,
  d_total: 32000000,
  projects: [
    {
      disk_usage: 220127232,
      master_url: "https://www.worldcommunitygrid.org/",
    },
  ],
};

localVue.use(BootstrapVue);
localVue.use(Vuex);

let getters;
let state;
let store;
let wrapper;

const diskInfoCard = () => wrapper.getComponent(BCard);
const diskStatTable = () => diskInfoCard().getComponent(BTable);
const diskStatSize = () => diskStatTable().findAll("td").at(0);
const diskStatFree = () => diskStatTable().findAll("td").at(1);
const diskStatBoincUse = () => diskStatTable().findAll("td").at(2);
const messageDiv = () => diskInfoCard().get("#message-div");
const diskUseGraph = () => diskInfoCard().getComponent("canvas");

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
  wrapper = mount(DiskInfo, {
    localVue,
    store,
    stubs: {
      Doughnut: {
        template: "<canvas />",
      },
    },
  });
}

afterEach(() => {
  mockAxios.reset();
  wrapper.destroy();
});

describe("DiskInfo.vue", () => {
  it("displays the title for the card", () => {
    createWrapper();

    expect(diskInfoCard().get(".card-title").text()).toBe("Disk Stats");
  });
  it("calls the disk stats API endpoint", () => {
    createWrapper();

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/.*\/client\/diskstats\?client=123/)
    );
  });

  it("renders a table of overall disk stats", () => {
    createWrapper();
    mockAxios.mockResponse({
      data: { disk_stats: smallDiskWithoutProjects },
    });

    wrapper.vm.$nextTick().then(() => {
      expect(diskStatTable().isVisible()).toBe(true);
      expect(diskStatSize().text()).toBe("32000000");
      expect(diskStatFree().text()).toBe("16000000");
      expect(diskStatBoincUse().text()).toBe("120000");
    });
  });

  describe("message div", () => {
    it("displays 'no projects' message when not attached", () => {
      createWrapper();
      mockAxios.mockResponse({
        data: { disk_stats: smallDiskWithoutProjects },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(messageDiv().isVisible()).toBe(true);
      });
    });

    it("no message is displayed when attached", () => {
      createWrapper();
      mockAxios.mockResponse({
        data: { disk_stats: simpleDiskWithProjects },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(messageDiv().isVisible()).toBe(false);
      });
    });
  });

  describe("disk use graph", () => {
    it("displays a graph for the given disk stats", () => {
      createWrapper();
      mockAxios.mockResponse({
        data: { disk_stats: simpleDiskWithProjects },
      });

      wrapper.vm.$nextTick().then(() => {
        expect(diskUseGraph().isVisible()).toBe(true);
      });
    });
  });
});
