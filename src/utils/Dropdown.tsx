import React, { Fragment } from 'react'

interface DropdownProps {
  title?: string;
  name?: string;
  children: React.ReactNode;
  htmlFor: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  title,
  children,
  htmlFor
}) => {
  return (
    <form action='#'>
      <label htmlFor={htmlFor} style={{paddingRight: 8}}>
        {title}:
      </label>
      <Fragment>
        {children}
      </Fragment>
    </form >
  )
}

export default Dropdown