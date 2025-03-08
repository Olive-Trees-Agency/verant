function getRGB(c: string) {
    return parseInt(c, 16);
}

function getsRGB(c: string) {
    return getRGB(c) / 255 <= 0.03928
        ? getRGB(c) / 255 / 12.92
        : Math.pow((getRGB(c) / 255 + 0.055) / 1.055, 2.4);
}

function getLuminance(hexColor: string) {
    return (
        0.2126 * getsRGB(hexColor.slice(1, 3)) +
        0.7152 * getsRGB(hexColor.slice(3, 5)) +
        0.0722 * getsRGB(hexColor.slice(-2))
    )
}

function getContrast(f: string, b: string) {
    const L1 = getLuminance(f);
    const L2 = getLuminance(b);
    return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

/**
 * Get the text color based on its background.
 * @param bgColor The background color where the text is displayed upon.
 * @param darkTextColor The text color to be returned when the text should be a darker tint based on the background contrast. Default: black
 * @param lightTextColor The text color to be returned when the text should be a lighter tint based on the background contrast.  Default: white
 * @returns The resulting HEX color.
 */
export const getTextColor = (bgColor: string, darkTextColor: string = '#000000', lightTextColor: string = '#FFFFFF') => {
    const whiteContrast = getContrast(bgColor, lightTextColor);
    const blackContrast = getContrast(bgColor, darkTextColor);

    return whiteContrast > blackContrast ? lightTextColor : darkTextColor;
};