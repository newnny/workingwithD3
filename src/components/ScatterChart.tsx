import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import Axis from './Axis';

interface Data {
  index: number | undefined;
  painting_index: number | undefined;
  season: number | undefined;
  episode: number | undefined;
  num_colors: number | undefined;
  colors: string | undefined;
  color_hex: string | undefined;
  Black_Gesso: number | undefined;
  Bright_Red: number | undefined;
  Burnt_Umber: number | undefined;
  Cadmium_Yellow: number | undefined;
  Dark_Sienna: number | undefined;
  Indian_Red: number | undefined;
  Indian_Yellow: number | undefined;
  Liquid_Black: number | undefined;
  Liquid_Clear: number | undefined;
  Midnight_Black: number | undefined;
  Phthalo_Blue: number | undefined;
  Phthalo_Green: number | undefined;
  Prussian_Blue: number | undefined;
  Sap_Green: number | undefined;
  Titanium_White: number | undefined;
  Van_Dyke_Brown: number | undefined;
  Yellow_Ochre: number | undefined;
  Alizarin_Crimson: number | undefined;
}

interface DotsProps {
  cx: any,
  cy: any,
  r: number,
  fill: any,
  tabindex: number,
}

export const Dots = ({ cx, cy, r, fill, tabindex }: DotsProps) => {
  return <circle cx={cx} cy={cy} r={r} fill={fill} tabIndex={tabindex} />

}

interface Dimensions {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number
  }
}

export const ScatterChart: React.FC = () => {
  const [data, setData] = useState<Data[]>()
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 300,
    height: 300,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 60
    }
  })

  //1. Access data
  useEffect(() => {
    const fetchData = async () => {
      const rawData = await d3.csv('https://raw.githubusercontent.com/jwilber/Bob_Ross_Paintings/master/data/bob_ross_paintings.csv')
      const formattedData = rawData.map((d, index) => ({
        index: index + 1,
        painting_index: Number(d.painting_index),
        season: Number(d.season),
        episode: Number(d.episode),
        num_colors: Number(d.num_colors),
        colors: d.colors,
        color_hex: d.color_hex,
        Black_Gesso: Number(d.Black_Gesso),
        Bright_Red: Number(d.Bright_Red),
        Burnt_Umber: Number(d.Burnt_Umber),
        Cadmium_Yellow: Number(d.Cadmium_Yellow),
        Dark_Sienna: Number(d.Dark_Sienna),
        Indian_Red: Number(d.Indian_Red),
        Indian_Yellow: Number(d.Indian_Yellow),
        Liquid_Black: Number(d.Liquid_Black),
        Liquid_Clear: Number(d.Liquid_Clear),
        Midnight_Black: Number(d.Midnight_Black),
        Phthalo_Blue: Number(d.Phthalo_Blue),
        Phthalo_Green: Number(d.Phthalo_Green),
        Prussian_Blue: Number(d.Prussian_Blue),
        Sap_Green: Number(d.Sap_Green),
        Titanium_White: Number(d.Titanium_White),
        Van_Dyke_Brown: Number(d.Van_Dyke_Brown),
        Yellow_Ochre: Number(d.Yellow_Ochre),
        Alizarin_Crimson: Number(d.Alizarin_Crimson),
      }))
      setData(formattedData)
    }
    fetchData()
  }, [])
  console.log(data, "data")

  const xAccessor = (d: Data): number | undefined => d.num_colors
  const yAccessor = (d: Data): number | undefined => d.Sap_Green

  //2. Create chart dimensions
  const width = d3.min([window.innerWidth * 0.8, window.innerHeight * 0.8])
  useEffect(() => {
    setDimensions({
      width: width ? width : dimensions.width,
      height: width ? width : dimensions.height,
      margin: {
        top: 10,
        right: 10,
        bottom: 50,
        left: 60
      }
    })
  }, [width, dimensions.width, dimensions.height])

  //3. Create scales
  //.nice() method that will round our scale's domain, giving our axis friendlier bounds.
  const xScale = data && d3.scaleLinear()
    .domain(d3.extent(data, xAccessor) as [number, number])
    .range([0, dimensions.width
      - dimensions.margin.left
      - dimensions.margin.right])
    .nice()

  const yScale = data && d3.scaleLinear()
    .domain(d3.extent(data, yAccessor) as [number, number])
    .range([dimensions.height
      - dimensions.margin.top
      - dimensions.margin.bottom, 0])
    .nice()

  const cxyGenerator = (d: Data, x: boolean, y: boolean) => {
    if (data) {
      const xValue = xAccessor(d);
      const yValue = yAccessor(d);
      if (x) {
        if (xValue === undefined) {
          throw new Error("xAccessor is undefined");
        }
        if (xScale === undefined) {
          throw new Error("xScale is undefined");
        }
        return xScale(xValue) as number;
      }
      if (y) {
        if (yValue === undefined) {
          throw new Error("yAccessor is undefined");
        }
        if (yScale === undefined) {
          throw new Error("yScale is undefined");
        }
        return yScale(yValue) as number;
      }
    }
  }

  //translate(): chracterized by a 2-dimensional vector and it defines how much the element moves in each direction
  //translate(x, y) => x: R, y: B , translate(-x, -y) => -x: L, -y: T
  //e.g.translate(10, 20): move to right side by 10px and move to bottom by 20px

  return (
    <>
      {data ? <svg
        width={dimensions.width}
        height={dimensions.height}
      >
        <g transform={`translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`}>
          <>
            <Axis
              position='bottom'
              scale={xScale}
              timeScale={undefined}
              xTicks={10}
              yTicks={10}
              transform={`translate(${dimensions.margin.left},${dimensions.height - dimensions.margin.top - dimensions.margin.bottom})`}
              x={(dimensions.width - dimensions.margin.left - dimensions.margin.right) / 2}
              y={dimensions.margin.bottom}
              text='The total number of used colour'
            />
            <Axis
              position='left'
              scale={yScale}
              timeScale={undefined}
              xTicks={10}
              yTicks={10}
              transform={`translate(${dimensions.margin.left}, 0)`}
              x={-((dimensions.height - dimensions.margin.top - dimensions.margin.bottom) / 2)}
              y={-dimensions.margin.left + 20}
              text='The number of used special colour'
            />
            {data.map(d => {
              return (
                <circle
                  cx={cxyGenerator(d, true, false)}
                  cy={cxyGenerator(d, false, true)}
                  r={5}
                  fill='#507d2a'
                  tabIndex={0}
                />)
            })}
          </>
        </g>
      </svg> : <p>Loading</p>}
    </>
  )
}
