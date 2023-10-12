interface BarProps {
  dataSet: object[];
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

const Bar = ({ dataSet, x, y, width, height, fill }: BarProps) => {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
    />
  )
}

export default Bar