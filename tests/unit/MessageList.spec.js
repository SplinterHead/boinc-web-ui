import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import { BootstrapVue } from "bootstrap-vue";
import mockAxios from "jest-mock-axios";

import MessageList from "@/components/MessageList.vue";

let getters;
let state;
let store;
let wrapper;

const localVue = createLocalVue();
const noMessages = { messages: {} };
const singleMessage = {
  messages: {
    1: {
      body: "cc_config.xml not found - using defaults",
      pri: "1",
      project: null,
      time: 1687985899,
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
const messageTable = () => wrapper.get("#message-table");
const messageTableHeadings = () => messageTable().get("thead").findAll("th");
const messageTableRows = () => messageTable().get("tbody").findAll("tr");
const firstRowTime = () => messageTableRows().at(0).findAll("td").at(0);

function createWrapper() {
  wrapper = shallowMount(MessageList, {
    store,
    localVue,
  });
}

function createFullWrapper() {
  wrapper = mount(MessageList, {
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

    expect(titleText()).toBe("Messages");
  });

  it("calls the messages API endpoint", () => {
    createWrapper();

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/.*\/messages\/all\?client=123/)
    );
  });

  it("displays a 'no messages' message when the API returns nothing", () => {
    createWrapper();
    mockAxios.mockResponse({ data: noMessages });

    expect(messageDiv().isVisible()).toBe(true);
    expect(messageDiv().text()).toBe("No messages for this client");
  });

  describe("messages are rendered in a table", () => {
    it("renders a table instead of the message div", () => {
      createWrapper();
      mockAxios.mockResponse({ data: singleMessage });

      wrapper.vm.$nextTick().then(() => {
        expect(messageDiv().isVisible()).toBe(false);
        expect(messageTable().isVisible()).toBe(true);
      });
    });

    it("renders the table correctly", () => {
      createFullWrapper();
      mockAxios.mockResponse({ data: singleMessage });

      wrapper.vm.$nextTick().then(() => {
        expect(messageTableHeadings().length).toBe(3);
        expect(messageTableRows().length).toBe(1);
      });
    });

    it("transforms the create_time to human readable", () => {
      createFullWrapper();
      mockAxios.mockResponse({ data: singleMessage });

      wrapper.vm.$nextTick().then(() => {
        expect(firstRowTime().text()).toMatch(new RegExp("^6/28/2023,.*")); // Tests are US locale?
      });
    });
  });
});
