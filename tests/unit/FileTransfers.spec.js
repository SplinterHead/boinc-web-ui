import { createLocalVue, mount } from "@vue/test-utils";
import { BootstrapVue } from "bootstrap-vue";
import Vuex from "vuex";
import mockAxios from "jest-mock-axios";

import FileTransfers from "@/components/FileTransfers.vue";

let getters;
let state;
let store;
let wrapper;

const localVue = createLocalVue();
const noTransfers = { file_transfers: [] };
const singleTransferDownload = {
  file_transfers: [
    {
      max_nbytes: "0.000000",
      name: "MCM1_0202079_8553_MCM1_0202079_8553.txt",
      nbytes: "400.000000",
      persistent_file_xfer: {
        first_request_time: "1690828077.505128",
        is_upload: "0",
        last_bytes_xferred: "100.000000",
        next_request_time: "1690833601.708399",
        num_retries: "5",
        time_so_far: "21.201744",
      },
      project_name: "World Community Grid",
      project_url: "https://www.worldcommunitygrid.org/",
      status: "0",
    },
  ],
};
const singleTransferUpload = {
  file_transfers: [
    {
      max_nbytes: "0.000000",
      name: "MCM1_0202079_8553_MCM1_0202079_8553.txt",
      nbytes: "400.000000",
      persistent_file_xfer: {
        first_request_time: "1690828077.505128",
        is_upload: "1",
        last_bytes_xferred: "100.000000",
        next_request_time: "1690833601.708399",
        num_retries: "5",
        time_so_far: "21.201744",
      },
      project_name: "World Community Grid",
      project_url: "https://www.worldcommunitygrid.org/",
      status: "0",
    },
  ],
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
const transferTable = () => wrapper.get("#transfer-table");
const downloadIcon = () => transferTable().get("#transfer-download-icon");
const uploadIcon = () => transferTable().get("#transfer-upload-icon");

function createWrapper() {
  wrapper = mount(FileTransfers, {
    store,
    localVue,
  });
}

afterEach(() => {
  mockAxios.reset();
  wrapper.destroy();
});

describe("FileTransfers.vue", () => {
  it("has a title", () => {
    createWrapper();

    expect(titleText()).toBe("File Transfers");
  });

  it("calls the file transfers API endpoint", () => {
    createWrapper();

    expect(mockAxios.get).toHaveBeenCalledWith(
      expect.stringMatching(/.*\/transfers\/all\?client=123/)
    );
  });

  it("displays a 'no messages' message when the API returns nothing", () => {
    createWrapper();
    mockAxios.mockResponse({ data: noTransfers });

    wrapper.vm.$nextTick().then(() => {
      expect(messageDiv().isVisible()).toBe(true);
    });
  });

  describe("active transfers are displayed in a table", () => {
    it("renders a table instead of the message div", () => {
      createWrapper();
      mockAxios.mockResponse({ data: singleTransferDownload });

      wrapper.vm.$nextTick().then(() => {
        expect(messageDiv().isVisible()).toBe(false);
        expect(transferTable().isVisible()).toBe(true);
      });
    });

    it("displays the download icon for traffic incoming", () => {
      createWrapper();
      mockAxios.mockResponse({ data: singleTransferDownload });

      wrapper.vm.$nextTick().then(() => {
        expect(downloadIcon().isVisible()).toBe(true);
      });
    });

    it("displays the upload icon for traffic outgoing", () => {
      createWrapper();
      mockAxios.mockResponse({ data: singleTransferUpload });

      wrapper.vm.$nextTick().then(() => {
        expect(uploadIcon().isVisible()).toBe(true);
      });
    });
  });
});
