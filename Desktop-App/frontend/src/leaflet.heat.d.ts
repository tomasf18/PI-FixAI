import * as L from "leaflet";

declare module "leaflet" {
  interface HeatLayerOptions {
    minOpacity?: number;
    maxZoom?: number;
    max?: number;
    radius?: number;
    blur?: number;
    gradient?: { [key: number]: string };
  }
  
  class HeatLayer extends L.Layer {
    constructor(latlngs: L.LatLngExpression[], options?: HeatLayerOptions);
    setLatLngs(latlngs: L.LatLngExpression[]): this;
    addLatLng(latlng: L.LatLngExpression): this;
  }
  
  function heatLayer(latlngs: L.LatLngExpression[], options?: HeatLayerOptions): HeatLayer;
}
