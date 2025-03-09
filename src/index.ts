import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Page, DienstenPage } from "$pages";

window.Webflow ||= [];
gsap.registerPlugin(ScrollTrigger);

window.Webflow.push(() => {
  const currentPath = window.location.pathname;

  switch (currentPath) {
    // case '/':
    // case '/home':

    //   break;
    case '/diensten':
      new DienstenPage();
      break;
    default:
      new Page();
      break;
  }
});
