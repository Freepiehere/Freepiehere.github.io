import React, { Component } from 'react';
import axios from 'axios';
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import statesData from "./components/us-states";
import './App.css';

//import { ReactLeafletSearch } from 'react-leaflet-search';

//Add search bar
class App extends Component {
  state = {
    isCountyRes: false,
    currenntZoom:6,
    markers:[[51.505, -0.09]],
    State_Crime: [],
    Agency_Crime: [],
    County_Agency: {}
  }

  componentDidMount() {
    this.getStateCrime();
    this.getCountyCrime();
    this.getCountyAgency();

    this.countiesData = require("./components/us-counties");
    this.setState({geojsondata:this.countiesData});
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
      this.setState({Agency_Crime: data.data.County_Crime});
    })
    .catch(error => console.log(error));
  }

  getCountyAgency = _ => {
    axios.get('/County_Agency')
    .then((data) => {
      this.setState({County_Agency: data.data.County_Agency});
    })
    .catch(error => console.log(error));
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

  onZoom = (leafletMap) =>  {
    if(this.state.currentZoom<=7 && this.leafletMap.leafletElement.getZoom()>7) {
      console.log("display counties");
      this.setState({isCountyRes: true});
      //this.setState({state:this.state});
    } else if (this.state.currentZoom>7 && this.leafletMap.leafletElement.getZoom()<=7) {
      console.log("display states");
      this.setState({isCountyRes: false});

    }
    this.setState({currentZoom:this.leafletMap.leafletElement.getZoom()});
  }
  
  getColor = (name) => {

    var State_Crime = this.state.State_Crime;
    if(!State_Crime) return;
    var k;
    var stateRate;
    for (k=0;k<State_Crime.length;k++)  {
      if(name===State_Crime[k].State) {
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
      fillColor: '#FFEDA0',//this.getColor(feature.properties.name),
      weight:2,
      opacity:1,
      color:'black',
      dashArray: '3',
      fillOpacity: 0.5
    }
  }

  render()  {
    console.log(this.state.Agency_Crime);
    console.log(this.state.County_Agency.features);
    const isCountyRes = this.state.isCountyRes;
    let geodata;
    if (isCountyRes)  {
      geodata = <GeoJSON key="countiesmap" data={this.countiesData} style={this.style} onEachFeature={this.onEachFeature} />
    } else  {
      geodata = <GeoJSON key="statemap" data={statesData} style={this.style} onEachFeature={this.onEachFeature} />

    }
    return (
        <Map 
          onZoomend={this.onZoom} 
          ref={m => { this.leafletMap = m; }} 
          center={[39.9528,-75.1638]} 
          zoom={this.state.currenntZoom}>
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
          
          {geodata}
          
          
        </Map>
        );
    
    
//    <ReactLeafletSearch 
//          position="topleft" />
    
  }
}

export default App;
