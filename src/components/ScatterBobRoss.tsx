import React, { useState, useEffect } from 'react';
import * as d3 from 'd3';
import Axis from './Axis';
import Dropdown from '../utils/Dropdown';

interface Data {
  index: number | undefined;
  painting_index: number | undefined;
  season: number | undefined;
  episode: number | undefined;
  num_colors: number | undefined;
  colors: [] | undefined;
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

export const ScatterBobRoss: React.FC = () => {
  const [data, setData] = useState<Data[]>()
  const [selectedColour, setSelectedColour] = useState<string>("Sap Green")
  //assign a function type to a variable that is expecting a number
  //it means a function that takes a Data object as input and returns either a number or undefined.
  const [colourAccessor, setColourAccessor] = useState<(d: Data) => number | undefined>((d) => d && d.Sap_Green)
  const [colourRange, setColourRange] = useState<string[]>([])
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 300,
    height: 300,
    margin: {
      top: 10,
      right: 10,
      bottom: 50,
      left: 50
    }
  })

  //1. Access data
  useEffect(() => {
    const fetchData = async () => {
      const rawData = await d3.csv('https://raw.githubusercontent.com/jwilber/Bob_Ross_Paintings/master/data/bob_ross_paintings.csv')
      const formattedData = rawData.map((d, index) => {
        // Replace "\r\n" and "\\r\\n" with an empty string
        const sanitizedDataString = d.colors && d.colors.replace(/(\r\n|\\r\\n)/g, "");
        // Replace single quotes with double quotes
        const validJSONString = sanitizedDataString && sanitizedDataString.replace(/'/g, "\"");
        const parseColorArray = validJSONString && JSON.parse(validJSONString)

        return {
          index: index + 1,
          painting_index: Number(d.painting_index),
          season: Number(d.season),
          episode: Number(d.episode),
          num_colors: Number(d.num_colors),
          colors: parseColorArray,
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
        }
      })
      setData(formattedData)
    }
    fetchData()
  }, [])

  //The flatMap function expects a callback function that handles elements of a specific type, 
  //but TypeScript cannot determine the type of the elements in the array automatically.
  //To resolve this issue, you can explicitly specify the type of elements in parseColorArray or handle the callback function accordingly. 
  //Assuming parseColorArray is an array of arrays of strings, you can define its type as string[][]. Here's how you can do it:
  //const mergedArray = ogColors && ogColors.flatMap((c: string[]) => c)
  //const uniqueArray = mergedArray && mergedArray.filter((item: string, index: number) => mergedArray.indexOf(item) === index);
  const originalArray = data && data.length > 0 && data.map(d => d.colors).flatMap(c => c)
  const uniqueArray = originalArray && originalArray.filter((item, index) => originalArray.indexOf(item) === index);

  const yAccessor = (d: Data): number | undefined => d.num_colors
  const xAccessor = (d: Data): number | undefined => d.painting_index

  useEffect(() => {
    //selectedColourAccessor is intended to be used as the new value for colourAccessor
    //type of selectedColourAccessor has to match the expected type (d: Data) => number | undefined for colourAccessor.
    const selectedColourAccessor = (): ((d: Data) => number | undefined) => {
      const colours = selectedColour! && selectedColour === "Alizarin Crimson" ? (d: Data) => d && d.Alizarin_Crimson :
        selectedColour === "Bright Red" ? (d: Data) => d && d.Bright_Red :
          selectedColour === "Cadmium Yellow" ? (d: Data) => d && d.Cadmium_Yellow :
            selectedColour === "Phthalo Green" ? (d: Data) => d && d.Phthalo_Green :
              selectedColour === "Prussian Blue" ? (d: Data) => d && d.Prussian_Blue :
                selectedColour === "Sap Green" ? (d: Data) => d && d.Sap_Green :
                  selectedColour === "Titanium White" ? (d: Data) => d && d.Titanium_White :
                    selectedColour === "Van Dyke Brown" ? (d: Data) => d && d.Van_Dyke_Brown :
                      selectedColour === "Burnt Umber" ? (d: Data) => d && d.Burnt_Umber :
                        selectedColour === "Indian Yellow" ? (d: Data) => d && d.Indian_Yellow :
                          selectedColour === "Phthalo Blue" ? (d: Data) => d && d.Phthalo_Blue :
                            selectedColour === "Yellow Ochre" ? (d: Data) => d && d.Yellow_Ochre :
                              selectedColour === "Liquid Black" ? (d: Data) => d && d.Liquid_Black :
                                selectedColour === "Midnight Black" ? (d: Data) => d && d.Midnight_Black :
                                  selectedColour === "Liquid Clear" ? (d: Data) => d && d.Liquid_Clear :
                                    selectedColour === "Dark Sienna" ? (d: Data) => d && d.Dark_Sienna : (d: Data) => d && d.Indian_Red
      return colours;
    }
    const colourFn = selectedColourAccessor
    colourFn && setColourAccessor(colourFn);
  }, [data, selectedColour])

  useEffect(() => {
    const selectedColourRange = () => {
      if (selectedColour) {
        if (selectedColour === "Alizarin Crimson") {
          return (['#e32636', '#f7c2c7'])
        } else if (selectedColour === "Bright Red") {
          return (['#ff1414', '#ffc5c5'])
        } else if (selectedColour === "Cadmium Yellow") {
          return (['#fff714', '#fffcb1'])
        } else if (selectedColour === "Phthalo Green") {
          return (['#030906', '#ebf8f1'])
        } else if (selectedColour === "Prussian Blue") {
          return (['#003153', '#008ef0'])
        } else if (selectedColour === "Sap Green") {
          return (['#a7bd91', '#0A3410'])
        } else if (selectedColour === "Titanium White") {
          return (['#ffffff', '#858585'])
        } else if (selectedColour === "Van Dyke Brown") {
          return (['#a52a2a', '#f6e9e9'])
        } else if (selectedColour === "Black Gesso") {
          return (['#000000', '#e5e5e5'])
        } else if (selectedColour === "Burnt Umber") {
          return (['#8A3324', '#e7d6d3'])
        } else if (selectedColour === "Indian Yellow") {
          return (['#E3A857', '#f6e4cc'])
        } else if (selectedColour === "Phthalo Blue") {
          return (['#000F89', '#cccfe7'])
        } else if (selectedColour === "Yellow Ochre") {
          return (['#CB9D06', '#FDEFC4'])
        } else if (selectedColour === "Liquid Black") {
          return (['#000000', '#e5e5e5'])
        } else if (selectedColour === "Midnight Black") {
          return (['#000000', '#e5e5e5'])
        } else if (selectedColour === "Liquid Clear") {
          return (['ffffff', 'ffffff'])
        } else if (selectedColour === "Dark Sienna") {
          return (['#3c1414', '#b23b3b'])
        } else if (selectedColour === "Indian Red") {
          return (['#cd5c5c', '#f6e3e3'])
        } else {
          return (['ffffff', 'ffffff'])
        }
      }
      return []
    }
    setColourRange(selectedColourRange)
  }, [selectedColour])

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

  const colourScale = data && colourAccessor && d3.scaleLinear<string>()
    .domain(d3.extent(data, colourAccessor) as [number, number])
    .range(colourRange)

  const colourGenerator = (d: Data) => {
    if (data && colourAccessor) {
      const colourValue = colourAccessor(d);
      if (colourValue === undefined) {
        throw new Error("colourValue is undefined");
      }
      if (colourScale === undefined) {
        throw new Error("colourScale is undefined");
      }
      return colourScale(colourValue) as string;
    }
    return ""
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
      {data ?
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "60%" }}>
            <svg
              width={dimensions.width}
              height={dimensions.height}
            >
              <g transform={`translate(${dimensions.margin.left}, ${dimensions.margin.top})`}>
                <>
                  <Axis
                    position='bottom'
                    scale={xScale}
                    timeScale={undefined}
                    xTicks={10}
                    width={-(dimensions.width - dimensions.margin.left - dimensions.margin.right)}
                    height={-(dimensions.height - dimensions.margin.top - dimensions.margin.bottom)}
                    transform={`translate(${dimensions.margin.left},${dimensions.height - dimensions.margin.top - dimensions.margin.bottom})`}
                    x={(dimensions.width - dimensions.margin.left - dimensions.margin.right) / 2}
                    y={dimensions.margin.bottom}
                    text='Painting index'
                  />
                  <Axis
                    position='left'
                    scale={yScale}
                    timeScale={undefined}
                    yTicks={10}
                    width={-(dimensions.width - dimensions.margin.left - dimensions.margin.right)}
                    height={-(dimensions.height - dimensions.margin.top - dimensions.margin.bottom)}
                    transform={`translate(${dimensions.margin.left}, 0)`}
                    x={-((dimensions.height - dimensions.margin.top - dimensions.margin.bottom) / 2)}
                    y={-dimensions.margin.left + 20}
                    text={'The nubmer of total colour use'}
                  />
                  {data && data.map(d => {
                      return (
                        <circle
                          key={d.index}
                          cx={cxyGenerator(d, true, false)}
                          cy={cxyGenerator(d, false, true)}
                          r={5}
                          fill={colourGenerator(d)}
                          tabIndex={0}
                        />
                      )
                    })}
                </>
              </g>
            </svg>
          </div>
          <div style={{ width: "40%" }}>
            <Dropdown
              htmlFor="colours"
              title="Colours"
              children={
                <select
                  id="colours" name="colours" style={{ width: 300 }}
                  value={selectedColour}
                  onChange={e => setSelectedColour(e.target.value)}
                >
                  <>
                    <option>select a Colour</option>
                    {uniqueArray && uniqueArray.map((item, i) => {
                      return (
                        <option key={i} value={item} style={{ maxWidth: 300 }}>
                          {item}
                        </option>
                      )
                    })}
                  </>
                </select>
              }
            />
          </div>
        </div>
        :
        <p>Loading</p>
      }
    </>
  )
}
