import React, { Component } from 'react';
import './index.css';
import Slider from '@material-ui/lab/Slider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

export default class Controls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      captureDates: props.captureDates,
      sliderStart: 0,
      sliderEnd: props.captureDates.length - 1
    };
  }

  handleStartChange = (event, sliderStart) => {
    this.setState({ ...this.state, sliderStart });
  };

  handleEndChange = (event, sliderEnd) => {
    this.setState({ ...this.state, sliderEnd });
  };

  loadDates = () => {
    this.props.handleUpdate(this.state.sliderStart, this.state.sliderEnd);
  }

  render() {
    const { captureDates, sliderStart, sliderEnd } = this.state;
    return (
      <div className="map-controls">
          <Typography variant="title">Controls - Create NC Layer</Typography>
          <Typography variant="subheading" id="label">Start Date: {captureDates[sliderStart][1]}</Typography>
          <Slider value={sliderStart} min={0} max={captureDates.length - 1} step={1} aria-labelledby="label" onChange={this.handleStartChange} />
          <Typography variant="subheading" id="label">End Date: {captureDates[sliderEnd][1]}</Typography>
          <Slider value={sliderEnd} min={0} max={captureDates.length - 1} step={1} aria-labelledby="label" onChange={this.handleEndChange} />
          <Button
            color="secondary"
            onClick={this.loadDates}
            disabled={sliderStart >= sliderEnd}
          >
            {sliderStart >= sliderEnd ? 'Start Date Must Be Before End Date' : 'Update Map'}
          </Button>
        </div>
    );
  }
}
