import { formatSliderValue } from '../formatSliderValue';

describe('Format Slider Helper Test', () => {
  it('Should round the highest Price', () => {
    let price = 1;
    expect(formatSliderValue(price).maxPriceValue).toBe(2);

    price = 21;
    expect(formatSliderValue(price).maxPriceValue).toBe(25);

    price = 102;
    expect(formatSliderValue(price).maxPriceValue).toBe(150);

    price = 279;
    expect(formatSliderValue(price).maxPriceValue).toBe(300);

    price = 2222;
    expect(formatSliderValue(price).maxPriceValue).toBe(2500);

    price = 1289;
    expect(formatSliderValue(price).maxPriceValue).toBe(1500);
  });

  it('Should round the sliderStep', () => {
    let price = 1;
    expect(formatSliderValue(price).sliderStep).toBe(1);

    price = 21;
    expect(formatSliderValue(price).sliderStep).toBe(2);

    price = 102;
    expect(formatSliderValue(price).sliderStep).toBe(8);

    price = 279;
    expect(formatSliderValue(price).sliderStep).toBe(15);

    price = 2222;
    expect(formatSliderValue(price).sliderStep).toBe(125);

    price = 1289;
    expect(formatSliderValue(price).sliderStep).toBe(75);
  });
});
