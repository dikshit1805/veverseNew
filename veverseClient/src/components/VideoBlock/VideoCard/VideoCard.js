import React from 'react'
import Avatar from "@material-ui/core/Avatar"

import "./VideoCard.css"


function VideoCard({image, title, views, timestamp, video_path,likes}) {
  return (
    <div className="videocard">
      <img className="videocard_thumbnail" src={image} alt={title}/>
      <div className="videocard_info">
        
        <div className="videocard_text" >
          <h4>{title}</h4>
          <p>
            {views} •	{timestamp}
          </p>
          <p>{likes}</p>
        </div>
      </div>
      
    </div>
  )
}

export default VideoCard
