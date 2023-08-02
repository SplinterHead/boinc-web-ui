import Vue from "vue";
import VueRouter from "vue-router";

import App from "@/App.vue";
import ClientInfo from "./components/ClientInfo.vue";
import ClientProjects from "./components/ClientProjects.vue";
import FileTransfers from "./components/FileTransfers.vue";
import MessageList from "./components/MessageList.vue";
import NoticeList from "./components/NoticeList.vue";
import ProjectList from "./components/project/ProjectList.vue";
import TaskList from "./components/TaskList.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: App },
  { path: "/addproject", component: ProjectList },
  { path: "/clientinfo", component: ClientInfo },
  { path: "/filetransfers", component: FileTransfers },
  { path: "/tasks", component: TaskList },
  { path: "/messages", component: MessageList },
  { path: "/notices", component: NoticeList },
  { path: "/projects", component: ClientProjects },
];

export default new VueRouter({
  routes,
});
