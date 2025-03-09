import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Page, DienstenPage, ProjectenPage } from "$pages";

window.Webflow ||= [];
gsap.registerPlugin(ScrollTrigger);

window.Webflow.push(() => {
  const currentPath = window.location.pathname;

  switch (currentPath) {
    case '/diensten':
      new DienstenPage();
      break;
    case '/projecten':
      new ProjectenPage();
      break;
    default:
      new Page();
      break;
  }
});
