import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import NoticeList from "@/components/NoticeList.vue";

let wrapper;
let state;
let getters;
let store;

const localVue = createLocalVue();
const noNotices = { notices: {} };
const singleNotice = {
  notices: {
    1: {
      arrival_time: 1688033736.303633,
      category: "client",
      create_time: 1688033736.303633,
      description:
        "You are attached to this project twice.  Please remove projects named World Community Grid, then add http://www.worldcommunitygrid.org/",
      is_private: false,
      link: null,
      project_name: "World Community Grid",
      title: null,
    },
  },
};

localVue.use(BootstrapVue);
localVue.use(Vuex);

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

const titleText = () => wrapper.get("h1").text();
const messageDiv = () => wrapper.get("#message-div");
const noticeTable = () => wrapper.get("#notice-table");
const noticeTableHeadings = () => noticeTable().get("thead").findAll("th");
const noticeTableRows = () => noticeTable().get("tbody").findAll("tr");

const firstRowTime = () => noticeTableRows().at(0).findAll("td").at(0);

function createWrapper() {
  wrapper = shallowMount(NoticeList, {
    store,
    localVue,
  });
}

function createFullWrapper() {
  wrapper = mount(NoticeList, {
    store,
    localVue,
  });
}

afterEach(() => {
  mockAxios.reset();
  wrapper.destroy();
});

describe("Messages.vue", () => {
  it("has a title for the pane", () => {
    createWrapper();

    expect(titleText()).toBe("Notices");
  });

  it("calls the notices API endpoint", () => {
    createWrapper();

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/.*\/notices\/all\?client=123/)
    );
  });

  it("displays a 'no notices' message when the API returns nothing", () => {
    createWrapper();
    mockAxios.mockResponse({ data: noNotices });

    expect(messageDiv().isVisible()).toBe(true);
    expect(messageDiv().text()).toBe("No notices for this client");
  });

  describe("notices are rendered in a table", () => {
    it("renders a table instead of the message div", () => {
      createWrapper();
      mockAxios.mockResponse({ data: singleNotice });

      wrapper.vm.$nextTick().then(() => {
        expect(messageDiv().isVisible()).toBe(false);
        expect(noticeTable().isVisible()).toBe(true);
      });
    });

    it("renders the table correctly", () => {
      createFullWrapper();
      mockAxios.mockResponse({ data: singleNotice });

      wrapper.vm.$nextTick().then(() => {
        expect(noticeTableHeadings().length).toBe(3);
        expect(noticeTableRows().length).toBe(1);
      });
    });

    it("transforms the create_time to human readable", () => {
      createFullWrapper();
      mockAxios.mockResponse({ data: singleNotice });

      wrapper.vm.$nextTick().then(() => {
        expect(firstRowTime().text()).toMatch(new RegExp("^6/29/2023,.*")); // Tests are US locale?
      });
    });
  });
});
