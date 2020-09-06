import React from 'react';

import './DrawingState.css';

export default function DrawingState(props) {
  return (
    <div className="drawing-state-container">
      <span>It's your turn!</span>
      <canvas className="drawing-state-canvas"/>
      <button onClick={props.handleDrawingSubmit}>Submit</button>
    </div>
  );
}
