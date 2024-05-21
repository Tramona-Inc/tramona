import React, { forwardRef } from "react";

const MapCanvas = forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref} className="h-full w-full rounded-xl" />
));

export default MapCanvas;
