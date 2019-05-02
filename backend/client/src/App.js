import React, { Component } from 'react';
import axios from 'axios';
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import statesData from "./components/us-states";
import './App.css';

//Add search bar
class App extends Component {
  state = {
    markers:[[51.505, -0.09]],
    State_Crime: [],
    County_Crime: []
  }

  constructor(props)  {
    super(props);
  }

  componentDidMount() {
    this.getStateCrime();
    this.getCountyCrime();
    console.log(this.state.County_Crime)
    console.log(this.state.State_Crime);
  }

  getStateCrime = _ => {
    axios.get('/State_Crime')
    .then((data) => {
      this.setState({State_Crime: data.data.State_Crime});
    })
    .catch(error => console.log(error));
  }

  getCountyCrime = _ => {
    axios.get('/County_Crime')
    .then((data) => {
      this.setState({County_Crime: data.data.County_Crime});
    })
    .catch(error => console.log(error));
  }

  showStateCrime = crime_stat => <div> key={crime_stat.State}>{crime_stat.Violent_Crime_rate}</div>


  getColor = (name) => {
    var State_Crime = this.state.State_Crime;
    if(!State_Crime) return;
    var k;
    var stateRate;
    for (k=0;k<State_Crime.length;k++)  {
      if(name==State_Crime[k].State) {
        stateRate = State_Crime[k].Violent_Crime_rate;
        break;
      }
    }
    return stateRate > 600 ? '#800026' :
            stateRate > 515  ? '#BD0026' :
            stateRate > 432  ? '#E31A1C' :
            stateRate > 349  ? '#FC4E2A' :
            stateRate > 266   ? '#FD8D3C' :
            stateRate > 183   ? '#FEB24C' :
            stateRate > 100   ? '#FED976' :
                              '#FFEDA0';
  }

  //geoJSON-dependent mysql routing name -> county -> agencies(/county averages)
  style = (feature) => {
    return  {
      fillColor: this.getColor(feature.properties.name),
      weight:2,
      opacity:1,
      color:'black',
      dashArray: '3',
      fillOpacity: 0.5
    }
  }

  addMarker = (e) =>  {
    const {markers} = this.state
    markers.push(e.latlng)
    this.setState({markers})
  }

  onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: this.highlightFeature.bind(this),
      mouseout: this.resetHighlightFeature.bind(this),
      click: this.zoomToFeature.bind(this)
    });
  }

  zoomToFeature(e)  {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.fitBounds(e.target.getBounds());
  }

  highlightFeature (e)  {
    var layer = e.target;
    layer.setStyle(  {
      weight:3,
      fillOpacity: 0.7
    });
  }

  resetHighlightFeature(e)  {
    var layer = e.target;
    layer.setStyle(this.style(layer.feature));
  }
  
  render()  {
    const { State_Crime } = this.state.State_Crime;
    const { County_Crime } = this.state.County_Crime;
    console.log(County_Crime);
    
    
    return (
      //Point of attack for switching between state and county dispalys:
      //statesData value. 
      <div className="App">
        <Map 
          ref={m => { this.leafletMap = m; }} 
          center={[39.9528,-75.1638]} 
          zoom={7}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.markers.map((position,idx) =>
            <Marker 
            key={`marker-${idx}`} 
            position={position}>
              <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
              </Popup>
            </Marker>
          )}
          
          <GeoJSON  
            key = 'statejson' 
            data={statesData} 
            style={this.style}
            onEachFeature={this.onEachFeature} />
        </Map>
        
      </div>
    );
  }
}

export default App;
