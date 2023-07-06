import React, { useRef, useEffect, useState } from 'react'
import * as d3 from "d3";
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

interface AxisBottomProps {
  scale: d3.ScaleTime<number, number, never>
  transform: string;
}

interface AxisLeftProps {
  scale: d3.ScaleLinear<number, number, never>;
}

interface LineProps {
  d: any;
  fill: string;
  stroke: string;
  strokeWidth: number
}

export const AxisBottom = ({ scale, transform }: AxisBottomProps) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      d3.select(ref.current).call(d3.axisBottom(scale));
    }
  }, [scale]);

  return <g ref={ref} transform={transform} />;
}

export const AxisLeft = ({ scale }: AxisLeftProps) => {
  const ref = useRef<SVGGElement>(null);

  useEffect(() => {
    if (ref.current) {
      d3.select(ref.current).call(d3.axisLeft(scale));
    }
  }, [scale]);

  return <g ref={ref} />;
}

export const Line = ({ d, fill, stroke, strokeWidth }: LineProps) => {
  return (
    <path d={d} fill={fill} stroke={stroke} stroke-width={strokeWidth} />
  )
}

export const SimpleLineChart = () => {
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
    height: 500,
    margin: {
      top: 15,
      right: 15,
      bottom: 40,
      left: 100,
    },
  }

  let boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right

  let boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  //create scales
  const yScale = d3.scaleLinear()
    .domain(d3.extent(weatherData, yAccessor) as [number, number])
    .range([boundedHeight, 0])

  const xScale = d3.scaleTime()
    .domain(d3.extent(weatherData, xAccessor) as [Date, Date])
    .range([0, boundedWidth])

  //Draw data
  const lineGenerator = d3.line<data>()
    .x(d => xScale(xAccessor(d) as Date))
    .y(d => yScale(yAccessor(d) as number))

  return (
    <svg
      width={dimensions.width}
      height={dimensions.height}
    >
      <g transform={`translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`}>
        <AxisBottom scale={xScale} transform={`translateY(${boundedHeight}px)`} />
        <AxisLeft scale={yScale} />
        <Line d={lineGenerator(weatherData)} fill="none" stroke="#ff7900" strokeWidth={1.5} />
      </g>
    </svg>
  )
}