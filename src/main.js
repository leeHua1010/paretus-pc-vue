import { createApp } from "vue";
import App from "./App.vue";
import "virtual:uno.css";
import "~/styles/index.scss";
import router, { setupRouter } from "~/router";
import { setupStore } from "~/store";

async function bootstrap() {
  const app = createApp(App);

  setupStore(app);

  setupRouter(app);

  await router.isReady();

  app.mount("#app", true);
}

bootstrap();
