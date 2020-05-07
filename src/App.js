import React from 'react';
import { connect } from 'react-redux';
import './App.css';

import HeatMap from './components/HeatMap';

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <header>
          <h1 id="title">Heatmap</h1>
        </header>
        <article>
          <HeatMap />
        </article>
      </div>
    );
  }
  
}

const mapStateToProps = state => ({
  ...state
});


// const mapDispatchToProps = ({
//   pressedKey: (keycode) => dispatch(pressedKey(keycode))
// });

export default connect(mapStateToProps)(App);
