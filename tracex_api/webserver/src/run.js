
import { initApp, bindApp } from '.';

initApp().then(
  app => bindApp(app)
).catch((er) => {
  console.error('Error initializing application');
  console.error(er);
});
