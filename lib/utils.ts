/*
 * Takes in a Shopify image URL, preferred image width and returns the URL with query params for image optimization
 */
export const getOptimizedImageUrl = (url: string, size: number) => {
  if (url) {
    const imageURL = new URL(url);
    imageURL.searchParams.append("width", String(size));
    return imageURL.toString();
  }
  return "";
};
