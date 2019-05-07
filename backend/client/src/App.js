import React, { Component } from 'react';
import axios from 'axios';
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import statesData from "./components/us-states";
import { ReactLeafletSearch } from 'react-leaflet-search';
import LeafletMap from "./components/LeafletMap"
import './App.css';

//Add search bar
class App extends Component {
  render()  {
    return(
      <div className="App">
        <LeafletMap />
      </div>
    );
  }
}
export default App;
