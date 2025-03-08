import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Page } from "$pages";

window.Webflow ||= [];
gsap.registerPlugin(ScrollTrigger);

window.Webflow.push(() => {
  const currentPath = window.location.pathname;

  switch (currentPath) {
    // case '/':
    // case '/home':

    //   break;
    // case '/diensten':

    default:
      new Page();
      break;
  }
});
