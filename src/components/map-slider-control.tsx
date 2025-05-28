import * as React from "react";
import { useState } from "react";
import { useControl } from "react-map-gl/maplibre";
import { createPortal } from "react-dom";
import type { MapboxMap, IControl } from "react-map-gl/maplibre";
import { Slider } from "@/components/ui/slider"; // Adjust path as needed

class OverlayControl implements IControl {
  _map: MapboxMap = null;
  _container: HTMLElement;
  _redraw: () => void;

  constructor(redraw: () => void) {
    this._redraw = redraw;
  }

  onAdd(map: MapboxMap) {
    this._map = map;
    map.on("move", this._redraw);
    this._container = document.createElement("div");
    this._container.style.position = "absolute";
    this._container.style.top = "10px";
    this._container.style.left = "10px";
    this._redraw();
    return this._container;
  }

  onRemove() {
    this._container.remove();
    this._map.off("move", this._redraw);
    this._map = null;
  }

  getMap() {
    return this._map;
  }

  getElement() {
    return this._container;
  }
}

function CustomOverlay() {
  const [, setVersion] = useState(0);
  const [value, setValue] = useState([50]);

  const ctrl = useControl<OverlayControl>(() => {
    const forceUpdate = () => setVersion((v) => v + 1);
    return new OverlayControl(forceUpdate);
  });

  const map = ctrl.getMap();

  return (
    map &&
    createPortal(
      <div className="w-[200px] rounded-xl bg-white p-4 shadow-xl">
        <p className="mb-2 text-sm font-medium"> Adjust Opacity </p>
        <Slider
          min={0}
          max={100}
          step={1}
          value={value}
          onValueChange={setValue}
        />
        <p className="mt-2 text-xs"> Value: {value[0]} </p>
      </div>,
      ctrl.getElement(),
    )
  );
}

export default React.memo(CustomOverlay);
