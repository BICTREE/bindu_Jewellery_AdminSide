import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify'
import App from './App'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from "./redux/Store.js"
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor} >
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </PersistGate>
  </Provider>
)