import React, { Component } from 'react';
import './index.css';
import { USER_ID, ACCESS_TOKEN, API_URL } from '../../Lib/config';
import { ajax } from "rxjs/ajax";
import { take, map } from "rxjs/operators";
import Controls from '../Controls';

declare var L;

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state = {
      captureDates: []
    };
  }

  componentDidMount() {
    ajax('https://api2.terravion.com/layers/getLayersFromBlockId?blockId=48ed28ca-d272-4d1f-bfe0-cb95b61eecbc&access_token=2e68cee0-b2fd-4ef5-97f6-8e44afb09ffa').pipe(
      take(1),
      map((_res) => _res.response)
    ).subscribe((_captures) => {
      this.setState({
        ...this.state,
        captureDates: _captures.map(_l => _l.layerDateEpoch).sort().map(_l => ([_l, new Date(_l).toString()])),
      });
    })

    this.map = L.map('map').setView([38.540580, -121.877271], 15);

    this.mapbox_Layer = L.tileLayer("https://api.tiles.mapbox.com/v2/cgwright.ca5740e5/{z}/{x}/{y}.jpg",{
      drawControl: false,
      maxZoom: 22,
      maxNativeZoom: 19
    }).addTo(this.map);

    this.nc_layer = L.tileLayer(this.createEndPoint('', ''), {
      attribution: 'TerrAvion',
      maxZoom: 19,
      tms: true
    }).addTo(this.map);

    const overlays = {
      'Mapbox': this.mapbox_Layer,
      'NC': this.nc_layer
    };

    this.layersControl = L.control.layers(null, overlays).addTo(this.map);
  }

  createEndPoint = (startDate, endDate) => (
    `${API_URL}/users/${USER_ID}/{z}/{x}/{y}.png?epochStart=${startDate}&epochEnd=${endDate}&access_token=${ACCESS_TOKEN}&product=NC`
  );

  loadDates = (startIndex, endIndex) => {
    this.layersControl.removeLayer(this.nc_layer);
    this.map.removeLayer(this.nc_layer);
    this.nc_layer = L.tileLayer(this.createEndPoint(
      this.state.captureDates[startIndex][0], this.state.captureDates[endIndex][0]
    ), {
      attribution: 'TerrAvion',
      maxZoom: 19,
      tms: true
    }).addTo(this.map);
    this.layersControl.addOverlay(this.nc_layer, 'NC');
  }

  componentWillUnmount() {
    this.map = null;
  }

  render() {
    const { captureDates } = this.state;
    const { loadDates } = this;
    return (
      <div className="whole-page">
        <div id="map"></div>
        {captureDates.length && (<Controls captureDates={captureDates} handleUpdate={ loadDates } />)}
      </div>
    );
  }
}
