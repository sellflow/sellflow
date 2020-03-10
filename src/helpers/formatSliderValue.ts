function formatSliderValue(highestPrice: number) {
  let multiplier = Math.pow(10, Math.floor(Math.log10(highestPrice)));

  let middlePriceRange =
    Math.floor(highestPrice / multiplier) * multiplier + multiplier / 2;

  let maxPriceValue =
    highestPrice < middlePriceRange && highestPrice > 10
      ? middlePriceRange
      : (Math.floor(highestPrice / multiplier) + 1) * multiplier;

  let sliderStep = Math.ceil(0.05 * maxPriceValue);

  return { sliderStep, maxPriceValue };
}

export { formatSliderValue };
