import React, { useEffect, useState } from 'react'
import * as d3 from "d3";
import Axis from './Axis';
import Line from './Line';
import rawWeatherData from "../data/berlin_weatehr.json"

interface data {
  date: string;
  temperature_max: number | undefined | null;
  temperature_min: number | undefined | null;
  temperature_mean: number | undefined | null;
  temperature_unit: string;
  wind_unit: string;
  sunrise: string;
  sunset: string;
  precipitation_sum: number | undefined | null;
  windspeed_max: number | undefined | null;
  windgusts_max: number | undefined | null;
}

export const SimpleLineChart: React.FC = () => {
  const [weatherData, setWeatherData] = useState<data[]>([])

  useEffect(() => {
    // Fetch and set the data when the component mounts
    const fetchDataAndSetState = async () => {
      try {
        const jsonData = await rawWeatherData;
        if (jsonData && jsonData.length > 0) {
          const modifiedData = jsonData.flatMap(data => data.daily.time.map((t, index) => ({
            date: t,
            temperature_unit: data.daily_units.temperature_2m_max,
            wind_unit: data.daily_units.windspeed_10m_max,
            precipitation_sum: data.daily.precipitation_sum[index] !== null ? data.daily.precipitation_sum[index] : undefined,
            sunrise: data.daily.sunrise[index],
            sunset: data.daily.sunset[index],
            temperature_max: data.daily.temperature_2m_max[index] !== null ? data.daily.temperature_2m_max[index] : undefined,
            temperature_mean: data.daily.temperature_2m_mean[index] !== null ? data.daily.temperature_2m_mean[index] : undefined,
            temperature_min: data.daily.temperature_2m_min[index] !== null ? data.daily.temperature_2m_min[index] : undefined,
            windgusts_max: data.daily.windgusts_10m_max[index] !== null ? data.daily.windgusts_10m_max[index] : undefined,
            windspeed_max: data.daily.windspeed_10m_max[index] !== null ? data.daily.windspeed_10m_max[index] : undefined,
          }))).filter(({ temperature_max }) => temperature_max !== undefined)
          setWeatherData(modifiedData)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataAndSetState();
  }, [])

  const yAccessor = (d: data): number | undefined | null => d.temperature_max
  const dateParser = d3.timeParse("%Y-%m-%d")
  const xAccessor = (d: data): Date | undefined | null => dateParser(d.date)

  //2. Create chart dimenstions

  let dimensions = {
    width: window.innerWidth * 0.9,
    height: 400,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 60,
    },
  }

  //create scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(weatherData, yAccessor) as [number, number])
    .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top])

  const xScale = d3.scaleTime()
    .domain(d3.extent(weatherData, xAccessor) as [Date, Date])
    .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])

  //Draw data
  const lineGenerator = d3.line<data>()
    .x(d => xScale(xAccessor(d) as Date))
    .y(d => yScale(yAccessor(d) as number))


  //translate(): chracterized by a 2-dimensional vector and it defines how much the element moves in each direction
  //translate(x, y) => x: R, y: B , translate(-x, -y) => -x: L, -y: T
  //e.g.translate(10, 20): move to right side by 10px and move to bottom by 20px
  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
    >
      <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
        <Axis
          position='bottom'
          scale={undefined}
          timeScale={xScale}
          xTicks={10} 
          yTicks={10}
          transform={`translate(0,${dimensions.height - dimensions.margin.bottom})`}
          x={(dimensions.width - dimensions.margin.left) / 2}
          y={dimensions.margin.bottom}
          text='Date'
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
          text='The heigest temperature'
        />
        <rect
          transform={`translate(${dimensions.margin.left}, 0)`}
          width={dimensions.width - dimensions.margin.left - dimensions.margin.right}
          height={dimensions.height - dimensions.margin.top - dimensions.margin.bottom + 10}
          fill="lavender"
        />
        <Line d={lineGenerator(weatherData)} fill="none" stroke="#ff7900" strokeWidth={1.5} />
      </g>
    </svg>
  )
}