import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'react-redux';

import store from './store';
import Home from './components/common/home';
import Adminpanel from './components/customAdminDetails/index';

import ModalContextProvider from './utils/context/providers/modalContext';
import SubServicesModalContextProvider from './utils/context/providers/subServicesModalContext';

const App = () => {
  return (
    <Provider store={store}>
      <ModalContextProvider>
        <SubServicesModalContextProvider>
          <BrowserRouter>
            <div className="App">
                <Route exact path ='/' component={Home} />
                <Route  path ='/admin-page' component={Adminpanel} />
            </div>
          </BrowserRouter>
        </SubServicesModalContextProvider>
      </ModalContextProvider>
    </Provider>
  );
}

export default App;
