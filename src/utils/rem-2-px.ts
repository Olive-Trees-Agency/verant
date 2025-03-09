export const rem2Px = (rem: number) => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export const px2Rem = (px: number) => {
    return px / parseFloat(getComputedStyle(document.documentElement).fontSize);
}