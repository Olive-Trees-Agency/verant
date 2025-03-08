export const matchPhone = window.matchMedia('(max-width: 479px)');

export const matchPhoneLandscape = window.matchMedia('(min-width: 480px and max-width: 767px)');

export const matchPhoneAll = window.matchMedia('(max-width: 767px)');

export const matchTablet = window.matchMedia('(min-width: 768px and max-width: 991px)');

export const matchMobileAll = window.matchMedia('(max-width: 991px)');

export const matchDesktop = window.matchMedia('(min-width: 992px)');

export const isMobileDevice = () => {
    if ('ontouchstart' in document.documentElement) {
        return true;
    }
};

export const matchOrientationLandscape = window.matchMedia('(orientation: landscape)');