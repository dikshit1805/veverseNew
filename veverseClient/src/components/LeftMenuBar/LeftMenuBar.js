import React, {useState} from 'react'
import {Link} from "react-router-dom"
import MenuRow from './MenuRow/MenuRow'
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import HomeIcon from '@material-ui/icons/Home';
import "./LeftMenuBar.css"

function LeftMenuBar() {
  const [current, setCurrent] = useState(1);

  return (
    <div className="leftmenubar">
      <Link className="leftmenubar_link" to="/"  onClick={() => setCurrent(1)}>
        <MenuRow selected={current === 1} Icon={HomeIcon} title="Home"/>
      </Link>
      <Link className="leftmenubar_link" to="/myvideos"  onClick={() => setCurrent(2)}>
        <MenuRow selected={current === 2} Icon={PlayArrowIcon} title="Videos"/>
      </Link>

    </div>
  )
}

export default LeftMenuBar
