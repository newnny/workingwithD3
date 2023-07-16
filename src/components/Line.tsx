interface LineProps {
  d: any;
  fill: string;
  stroke: string;
  strokeWidth: number
}

const Line = ({ d, fill, stroke, strokeWidth }: LineProps) => {
  return (
    <path d={d} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
  )
}

export default Line