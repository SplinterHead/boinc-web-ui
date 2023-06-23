import { createLocalVue, mount, shallowMount } from "@vue/test-utils";
import { BModal, BootstrapVue } from "bootstrap-vue";

import ProjectAuthModal from "@/components/project/ProjectAuthModal.vue";

// create an extended `Vue` constructor
const localVue = createLocalVue();

// install plugins as normal
localVue.use(BootstrapVue);

const testProject = {
  name: "Test Project",
  web_url: "https://testproject.org/",
};

let wrapper;

const modal = () => wrapper.getComponent(BModal);
const modalTitle = () => modal().attributes("title");
const accountKeyGroup = () => wrapper.get("#account-key-group");
const accountKeyField = () => accountKeyGroup().get("#account-key-field");

function createWrapper(propsData) {
  wrapper = shallowMount(ProjectAuthModal, {
    localVue,
    propsData: { project: propsData },
  });
}

function createFullWrapper(propsData) {
  wrapper = mount(ProjectAuthModal, {
    localVue,
    propsData: { project: propsData, modalStatic: true },
  });
}

afterEach(() => {
  wrapper.destroy();
});

describe("ProjectAuthModal.vue", () => {
  describe("it renders with the expected elements", () => {
    beforeEach(() => {
      createWrapper(testProject);
    });
    it("has the expected title", () => {
      expect(modalTitle()).toBe("Add Project Key");
    });

    it("has a description including the project details", () => {
      expect(wrapper.text()).toContain("your account key");
      expect(wrapper.text()).toContain("Test Project");
    });

    it("has a text field for collecting the account key", () => {
      expect(accountKeyGroup().attributes("label")).toBe("Account Key");
      expect(accountKeyField().attributes("type")).toBe("text");
    });
  });

  describe("behaves as expected", () => {
    it("emits the relevant data on submit", (done) => {
      createFullWrapper(testProject);

      accountKeyField().get("input").setValue("token_1234");

      localVue.nextTick(() => {
        wrapper.vm.emitDataAndReset();
        expect(wrapper.emitted("project-auth")[0]).toEqual(["token_1234"]);
        done();
      });
    });
  });
});
