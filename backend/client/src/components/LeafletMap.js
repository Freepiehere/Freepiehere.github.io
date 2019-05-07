import React, { Component } from 'react';
import axios from 'axios';
import { Map, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import { ReactLeafletSearch } from 'react-leaflet-search';
import '../App.css';

import statesData from "./us-states";
var countiesData = require("./us-counties");

export default class LeafletMap extends Component {


  state = {
    center: [39.9528,-75.1638],
    currentZoom: 7,
    markers: [[51.505, -0.09]],
    State_Crime: [],
    County_Crime: []
  }

  constructor(props)  {
    super(props); 
    
    this.getCountyCrime();
    this.getStateCrime();
  }

  componentDidMount() {
    this.getStateCrime();
    this.getCountyCrime();
  }

  getStateCrime = _ => {
    axios.get('/State_Crime')
    .then((data) => {
      
      this.setState({State_Crime:data.data.State_Crime});
    })
    .catch(error => console.log(error));
  }

  getCountyCrime = _ => {
    axios.get('/County_Crime')
    .then((data) => {
      this.setState({County_Crime:data.data.County_Crime.features})
    })
    .catch(error => console.log(error));
  }

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

  /*addMarker = (e) =>  {
    const {markers} = this.state
    markers.push(e.latlng)
    this.setState({markers:markers;})
  }*/

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

  onZoomEvent = (map) =>  {
    this.setState({currentZoom:this.leafletMap.leafletElement.getZoom()});
    if (this.state.currentZoom<8 && this.leafletMap.leafletElement.getZoom()>=8)  {
      this.render();
    } else if (this.state.currentZoom>=8 && this.leafletMap.leafletElement.getZoom<8) {
      this.render();
    }
    
  }

  renderCounties()  {
    console.log(this.state.County_Crime);
    return (
      <Map
      ref={map => { this.leafletMap = map; }}
      onZoomEnd={this.onZoomEvent}
      center={this.state.center}
      zoom={this.state.currentZoom}>
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
        onEachFeature={this.onEachFeature} />

      <GeoJSON
        key ='countyjson'
        data={countiesData} 
        style={this.style}
        onEachFeature={this.onEachFeature}/>
      </Map>
    )
  }

  renderStates()  {
    return (
      <Map 
      ref={map => { this.leafletMap = map; }} 
      onZoomEnd={this.onZoomEvent}
      center={this.state.center} 
      zoom={this.state.currentZoom}>
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

    );  
  }
  
  render()  {
/**
 * call one of two render functions using county and state geometry/data
 * 
 */

 if (this.state.currentZoom<8)  {
   return (this.renderStates());
 }  else  {
   return (this.renderCounties());
 }

  
  }
}
    /*
        Modules: 
            addMarker
            onEachFeature
            zoomToFeature
            (reset)highlighFeature
            style
            getColor
    */
