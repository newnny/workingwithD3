import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import Axis from './Axis';
import usWeather from '../data/us_weather_data.json'

interface Data {
  time: number | undefined;
  summary: string | undefined;
  icon: string | undefined;
  sunriseTime: number | undefined;
  sunsetTime: number | undefined;
  moonPhase: number | undefined;
  precipIntensity: number | undefined;
  precipIntensityMax: number | undefined;
  precipProbability: number | undefined;
  temperatureHigh: number | undefined;
  temperatureHighTime: number | undefined;
  temperatureLow?: number | undefined;
  temperatureLowTime?: number | undefined;
  apparentTemperatureHigh: number | undefined;
  apparentTemperatureHighTime: number | undefined;
  apparentTemperatureLow?: number | undefined;
  apparentTemperatureLowTime?: number | undefined;
  dewPoint: number | undefined;
  humidity: number | undefined;
  pressure: number | undefined;
  windSpeed: number | undefined;
  windGust: number | undefined;
  windGustTime: number | undefined;
  windBearing: number | undefined;
  cloudCover: number | undefined;
  uvIndex: number | undefined;
  uvIndexTime: number | undefined;
  visibility: number | undefined;
  temperatureMin: number | undefined;
  temperatureMinTime: number | undefined;
  temperatureMax: number | undefined;
  temperatureMaxTime: number | undefined;
  apparentTemperatureMin: number | undefined;
  apparentTemperatureMinTime: number | undefined;
  apparentTemperatureMax: number | undefined;
  apparentTemperatureMaxTime: number | undefined;
  date: string | undefined;
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
      try {
        const jsonData = await usWeather
        if (jsonData && jsonData.length > 0) {
          setData(jsonData)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData()
  }, [])

  const xAccessor = (d: Data): number | undefined => d.dewPoint
  const yAccessor = (d: Data): number | undefined => d.humidity
  const colourAccessor = (d: Data): number | undefined => d.cloudCover

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
    .range([dimensions.margin.left, dimensions.width
      - dimensions.margin.left
      - dimensions.margin.right])
    .nice()

  const yScale = data && d3.scaleLinear()
    .domain(d3.extent(data, yAccessor) as [number, number])
    .range([dimensions.height
      - dimensions.margin.top
      - dimensions.margin.bottom, 0])
    .nice()

  const colourScale = data && d3.scaleLinear<string>()
    .domain(d3.extent(data, colourAccessor) as [number, number])
    .range(['#6495ed', '#0a0f18'])

    const colourGenerator = (d: Data) => {
      if (data) {
        const colourValue = colourAccessor(d);
          if (colourValue === undefined) {
            throw new Error("colourValue is undefined");
          }
          if (colourScale === undefined) {
            throw new Error("colourScale is undefined");
          }
          return colourScale(colourValue) as string;
      }
    }

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
        <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
          <>
            <Axis
              position='bottom'
              numScale={xScale}
              strScale={undefined}
              timeScale={undefined}
              xTicks={10}
              yTicks={10}
              width={-(dimensions.width - dimensions.margin.left - dimensions.margin.right)}
              height={-(dimensions.height - dimensions.margin.top - dimensions.margin.bottom)}
              transform={`translate(${dimensions.margin.left},${dimensions.height - dimensions.margin.top - dimensions.margin.bottom})`}
              x={(dimensions.width - dimensions.margin.left - dimensions.margin.right) / 2}
              y={dimensions.margin.bottom}
              text='Dewpoint'
            />
            <Axis
              position='left'
              numScale={yScale}
              strScale={undefined}
              timeScale={undefined}
              xTicks={10}
              yTicks={10}
              width={-(dimensions.width - dimensions.margin.left - dimensions.margin.right)}
              height={-(dimensions.height - dimensions.margin.top - dimensions.margin.bottom)}
              transform={`translate(${dimensions.margin.left}, 0)`}
              x={-((dimensions.height - dimensions.margin.top - dimensions.margin.bottom) / 2)}
              y={-dimensions.margin.left + 20}
              text='Humidity'
            />
            {data.map(d => {
              return (
                <circle
                key={d.time}
                  cx={cxyGenerator(d, true, false)}
                  cy={cxyGenerator(d, false, true)}
                  r={5}
                  fill={colourGenerator(d)}
                  tabIndex={0}
                />)
            })}
          </>
        </g>
      </svg> : <p>Loading</p>}
    </>
  )
}
