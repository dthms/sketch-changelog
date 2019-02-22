/**
 * Get a layer by its ID from an element
 * @param {object} element This can be an artboard, page or what ever contains layers
 * @param {string} layerId The ID of the layer you want to select
 */
const getLayer = (element, layerName) => {
  const layers = element.layers;
  const layerNames = layers.map(layer => layer.name);
  const layerIndex = layerNames.indexOf(layerName);
  return layerIndex === -1 ? false : layers[layerIndex];
}

module.exports = {
  getLayer,
};
