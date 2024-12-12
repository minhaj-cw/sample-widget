import React from 'react';
import ReactDOM from 'react-dom/client';
import Widget from './Widget.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
// window.businessId = 1

root.render(
    <Widget businessId={window.businessId} />
);