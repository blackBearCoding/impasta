import React, { useState } from 'react';

import DrawingState from '../../pageStates/RoomPageStates/DrawingState/DrawingState';

import './TestPage.css';

export default function TestPage() {
  const [stateComponent, setStateComponent] = useState(null);

  return (
    <div className="full-height test-page-container">
      <h1>TEST (Room)</h1>
      <h2>{stateComponent ? stateComponent.name : 'Select a page state'}</h2>
      {stateComponent ? (
        <>
          <button onClick={() => setStateComponent(null)}>Back</button>
          {stateComponent.component}
        </>
      ) : (
        <div>
          <button
            onClick={() =>
              setStateComponent({ name: 'Drawing State', component: <DrawingState /> })
            }
          >
            Drawing State
          </button>
        </div>
      )}
    </div>
  );
}
