import React, { useEffect, useRef, useState } from "react";

const Ruler = ({ type, width, height, paddingLeft, paddingTop }) => {
  const rulerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const zoomLevel = window.devicePixelRatio || 1;
      setScale(zoomLevel);
    };

    window.addEventListener("resize", updateScale);
    updateScale();

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  const renderTicks = () => {
    const ticks = [];
    const tickSize = type === "horizontal" ? width : height;
    const tickInterval = 50; // 50px per tick
    const totalTicks = Math.floor(tickSize / tickInterval);

    for (let i = 0; i <= totalTicks; i++) {
      const position = i * tickInterval;
      const isMajorTick = i % 2 === 0;

      if (type === "horizontal") {
        ticks.push(
          <div
            key={`h-tick-${i}`}
            className="tick"
            style={{
              left: `${position}px`,
              height: isMajorTick ? "15px" : "10px",
              borderLeft: "1px solid #ccc",
            }}
          >
            {isMajorTick && (
              <span className="tick-label" style={{ left: `${position + 4}px` }}>
                {position}
              </span>
            )}
          </div>
        );
      } else {
        ticks.push(
          <div
            key={`v-tick-${i}`}
            className="tick"
            style={{
              top: `${position}px`,
              width: isMajorTick ? "15px" : "10px",
              borderTop: "1px solid #ccc",
            }}
          >
            {isMajorTick && (
              <span className="tick-label" style={{ top: `${position + 4}px` }}>
                {position}
              </span>
            )}
          </div>
        );
      }
    }

    return ticks;
  };

  return (
    <div
      ref={rulerRef}
      className={`ruler ${type}`}
      style={{
        width: type === "horizontal" ? `${width}px` : "30px",
        height: type === "vertical" ? `${height}px` : "30px",
        paddingLeft: type === "horizontal" ? `${paddingLeft}px` : 0,
        paddingTop: type === "vertical" ? `${paddingTop}px` : 0,
      }}
    >
      {renderTicks()}
    </div>
  );
};

export default Ruler;