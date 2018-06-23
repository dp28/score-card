import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';
import { ConnectedApp } from './components/App/App';
import registerServiceWorker from './registerServiceWorker';
import { store } from './state/store';

ReactDOM.render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
