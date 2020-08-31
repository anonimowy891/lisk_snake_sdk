import React from 'react';

export default (props) => {

  const style1 = {
    left: `${props.dot[0]}%`,
    top: `${props.dot[1]}%`
  }

  return (
    <div className="snake-extra-food" style={style1}></div>
  )
}