import React from 'react'
import Avatar from "@material-ui/core/Avatar"
import moment from 'moment'
import numeral from 'numeral'
import "./VideoCard.css"
import noimage from '../../../images/no-image.png'

function VideoCard({image, title, views, timestamp, video_path,profile_pic,likes}) {
  return (
    <div className="videocard">
      <img className="videocard_thumbnail" src={image} alt={noimage}/>
      <div className="videocard_info">
        <Avatar src= {profile_pic}></Avatar>
        <div className="videocard_text" >
          <h4>{title}</h4>
          <p>
            {numeral(views).format('0.0a').toUpperCase()} Views •	{numeral(likes).format('0.0a').toUpperCase()} Likes
          </p>
          <p>{moment(timestamp.toLocaleTimeString() + ' ' + timestamp.toLocaleDateString(),"h:mm:ss a DD/MM/YYYY").fromNow()}</p>
          
        </div>
      </div>
      
    </div>
  )
}

export default VideoCard
