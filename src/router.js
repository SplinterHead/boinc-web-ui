import Vue from "vue";
import VueRouter from "vue-router";

import App from "@/App.vue";
import ClientInfo from "./components/ClientInfo.vue";
import MessageList from "./components/MessageList.vue";
import NoticeList from "./components/NoticeList.vue";
import TaskList from "./components/TaskList.vue";
import ProjectList from "./components/ProjectList.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: App },
  { path: "/clientinfo", component: ClientInfo },
  { path: "/tasks", component: TaskList },
  { path: "/messages", component: MessageList },
  { path: "/notices", component: NoticeList },
  { path: "/projects", component: ProjectList },
];

export default new VueRouter({
  routes,
});
