import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

window.Webflow ||= [];
gsap.registerPlugin(ScrollTrigger);

window.Webflow.push(() => {
  const currentPath = window.location.pathname;

  switch (currentPath) {
    case '/':
    case '/home':

      break;
    case '/diensten':

    default:
      break;
  }
});
