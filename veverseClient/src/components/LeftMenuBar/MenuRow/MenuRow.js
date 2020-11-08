import React from 'react'
import "./MenuRow.css"

function MenuRow({selected, Icon, title}) {
  return (
    <div className={`menurow ${selected && "selected"}`}>
      <Icon className="icon"/>
      <h2 className="title">{title}</h2>
    </div>
  )
}

export default MenuRow;
