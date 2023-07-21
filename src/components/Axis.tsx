import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface AxisProps {
  scale: d3.ScaleLinear<number, number, never> | undefined;
  timeScale: d3.ScaleTime<number, number, never> | undefined;
  transform: string;
  position: string;
  x: number;
  y: number;
  text: string;
  xTicks?: number | undefined;
  yTicks?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
}

const Axis = ({ scale, timeScale, transform, position, x, y, text, xTicks, yTicks, width, height }: AxisProps) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      if (position === "bottom") {
        if (scale) {
          d3.select(ref.current)
            .call(d3.axisBottom(scale)
              .ticks(xTicks) //how many ticks do you want to display in the chart
              .tickSize(height!) //tick length //Use the non-null assertion operator (!) if you are certain that the value will not be undefined
              .tickPadding(10) //tick padding from the chart bounds
            )
            .selectAll(".tick line")
            .attr("stroke", "#bbbbbb");
        } else if (timeScale) {
          d3.select(ref.current)
            .call(d3.axisBottom(timeScale)
              .ticks(xTicks)
              .tickSize(height!)
              .tickPadding(10)
            )
            .selectAll(".tick line")
            .attr("stroke", "#bbbbbb");
        }
      } else if (position === "left") {
        if (scale) {
          d3.select(ref.current)
            .call(d3.axisLeft(scale)
              .ticks(yTicks)
              .tickSize(width!)
              .tickPadding(10)
            )
            .selectAll(".tick line")
            .attr("stroke", "#bbbbbb");
        } else if (timeScale) {
          d3.select(ref.current)
            .call(d3.axisLeft(timeScale)
              .ticks(yTicks)
              .tickSize(width!)
              .tickPadding(10)
            )
            .selectAll(".tick line")
            .attr("stroke", "#bbbbbb");
        }
      }
    }
  }, [scale, timeScale, xTicks, yTicks, position]);


  return (
    <>
      <g ref={ref} transform={transform}>
        <text
          x={x}
          y={y}
          style={{
            fill: 'black',
            fontSize: 16,
            transform: position === 'left' ? 'rotate(-90deg)' : 'none',
            textAnchor: 'middle'
          }}
        >
          {text}
        </text>
      </g>
    </>
  )
}

export default Axis