import React from 'react';

import DrawingState from '../../pageStates/RoomPageStates/DrawingState/DrawingState';

import './TestPage.css';

export default function TestPage(props) {
  let display;

  switch (props.match.params.pageState) {
    case 'drawing-state':
      display = <DrawingState />;
      break;
    default:
      break;
  }

  return (
    <div className="full-height test-page-container">
      <h1>TEST (Room)</h1>
      {display || (
        <div>
          <h2>Select a Page State</h2>
          <ul>
            <li>
              <Link to="/room-test/drawing-state">Drawing State</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
