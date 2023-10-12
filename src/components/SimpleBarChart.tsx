import React, { useState, useEffect } from 'react'
import * as d3 from 'd3'
import Axis from './Axis'
import rawDogOwnershipData from "../data/dog_ownership.json"

interface data {
  country: string;
  DogOwnershipTotalDogs2021: number;
  DogsPerCapita2021: number;
}

export const SimpleBarChar: React.FC = () => {
  const [dogOwnershipData, setDogOwnershipData] = useState<data[]>(rawDogOwnershipData)

  const xAccessor = (d: data): string => d!.country
  const yAccessor = (d: data): number => d!.DogOwnershipTotalDogs2021 / 1000000

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 420,
    margin: {
      top: 15,
      right: 15,
      bottom: 60,
      left: 50
    }
  }

  const xScale = d3.scaleBand()
    .domain(dogOwnershipData.map(d => d!.country) as [string, string])
    .rangeRound([dimensions.margin.left, dimensions.width - dimensions.margin.right])

  const yScale = d3.scaleLinear()
    .domain(d3.extent(dogOwnershipData, yAccessor) as [number, number])
    .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])
    .nice()

  const barPadding = 4

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
    >
      <g transform={`translate(${dimensions.margin.left}, 0`}>
        <>
          <Axis
            position='bottom'
            strScale={xScale}
            numScale={undefined}
            timeScale={undefined}
            xTicks={15}
            width={-(dimensions.width - dimensions.margin.left - dimensions.margin.right)}
            height={-(dimensions.height - dimensions.margin.top - dimensions.margin.bottom)}
            transform={`translate(0,${dimensions.height - dimensions.margin.bottom})`}
            x={(dimensions.width - dimensions.margin.left) / 2}
            y={dimensions.margin.bottom}
            text='Countires'
          />
          <Axis
            position='left'
            numScale={yScale}
            strScale={undefined}
            timeScale={undefined}
            yTicks={15}
            width={-(dimensions.width - dimensions.margin.left - dimensions.margin.right)}
            height={-(dimensions.height - dimensions.margin.top - dimensions.margin.bottom)}
            transform={`translate(${dimensions.margin.left}, 0)`}
            x={-((dimensions.height - dimensions.margin.top - dimensions.margin.bottom) / 2)}
            y={- dimensions.margin.left + dimensions.margin.right}
            text='Dog ownership(milion)'
          />
          {dogOwnershipData && dogOwnershipData.length > 0 && dogOwnershipData.map((d, id) => {
            return (
              <g>
                <rect
                  key={id}
                  x={xScale(xAccessor(d)) + (barPadding / 2)}
                  y={yScale(yAccessor(d))}
                  width={d3.max([0, dimensions.width / dogOwnershipData.length - barPadding])}
                  height={dimensions.height - dimensions.margin.bottom - yScale(yAccessor(d))}
                  fill={"cornflowerblue"}
                >
                </rect>
                <text
                  x={xScale(xAccessor(d[0])) / 2}
                  y={yScale(yAccessor(d)) - 5}
                  textAnchor={"middle"}
                  fontSize={12}
                  fontFamily={"sans0serif"}
                >
                  {yAccessor(d)}
                </text>
              </g>
            )
          })}
        </>
      </g>
    </svg>
  )
}