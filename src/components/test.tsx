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

export const Circle: React.FC = () => {
  //the ref.current value is undefined when attempting to select the SVG element using D3,
  //This can happen if the ref is not properly assigned or 
  //if the SVG element is not yet rendered when the useEffect hook runs.
  //To avoid this error, we have to write codes like below

  // Assign the ref a type of SVGSVGElement or null
  //This ensures that the ref.current value can be null initially.
  const ref = useRef<SVGSVGElement | null>(null);
  //uses a ref to sotre a refernce to our rendered <svg>element

  useEffect(() => {
    if (ref.current) {
      // Check if ref.current exist 
      //a null check is performed (if (ref.current)) before attempting to select the SVG element with D3. 
      //This prevents the error from occurring when ref.current is undefined.
      const svgElement = d3.select(ref.current)
      //uses d3.select() to turn our ref into a d3 selection object
      svgElement.append("circle")
        //The append() method is called on the selected SVG element to add a new <circle> element as a child.
        //Chained .attr() calls are used to set the attributes of the circle.
        .attr("cx", 150)
        .attr("cy", 70)
        .attr("r", 50)
      //The cx attribute sets the x-coordinate of the center of the circle (150 in this case).
      //The cy attribute sets the y-coordinate of the center of the circle (70 in this case).
      //The r attribute sets the radius of the circle (50 in this case).
    }
  }, [])

  return (
    //The SVG element is returned from the Circle component.
    //The ref is assigned to the ref prop of the SVG element, connecting it with the useRef reference.
    <svg
      ref={ref}
    />
  )
}

export const BasicLineChart: React.FC = () => {
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

  let boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right

  let boundedHeight = dimensions.height
    - dimensions.margin.top
    - dimensions.margin.bottom

  //const draw canvas
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (ref.current && weatherData.length > 0) {
      const svgElement = d3.select(ref.current)
      const wrapper = svgElement
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)

      const bounds = wrapper.append("g")
        .style("trasform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`)

      //4. create scales
      const yScale = d3.scaleLinear()
        .domain(d3.extent(weatherData, yAccessor) as [number, number])
        .range([boundedHeight, 0])

      const xScale = d3.scaleTime()
        .domain(d3.extent(weatherData, xAccessor) as [Date, Date])
        .range([0, boundedWidth])

      //5. Draw dasta
      const lineGenerator = d3.line<data>()
        .x(d => xScale(xAccessor(d) as Date))
        .y(d => yScale(yAccessor(d) as number))

      const line = bounds.append("path")
        .attr("d", lineGenerator(weatherData))
        .attr("fill", "none")
        .attr("stroke", "#ff7900")
        .attr("stroke-width", 1.5)

      //6. draw peripherals
      const yAxisGenerator = d3.axisLeft(yScale)

      const yAxis = bounds.append('g')
        .call(yAxisGenerator)

      const xAxisGenerator = d3.axisBottom(xScale)

      const xAxis = bounds.append('g')
        .call(xAxisGenerator)
        .style("trasform", `translateY(${boundedHeight}px)`)

    }
  }, [])

  return (
    <svg
      ref={ref}
    >
    </svg>
  )
}