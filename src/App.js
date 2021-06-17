import React, {useEffect} from 'react'
import './App.css';

const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');


function App() {

  const mapLoaded = (map) => {
    var size = 200;

    var pulsingDot = {
      width: size,
      height: size,
      data: new Uint8Array(size * size * 4),

      onAdd: function () {
        var canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext('2d');
      },

      render: function () {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = size / 2 * 0.3;
        var outerRadius = size / 2 * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 200, 200,' + (1 - t) + ')';
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = 'rgba(255, 100, 100, 1)';
        context.strokeStyle = 'white';
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // keep the map repainting
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
      }
    };

    map.addImage('pulsing-dot', pulsingDot, {pixelRatio: 2});

    map.addLayer({
      "id": "points",
      "type": "symbol",
      "source": {
        "type": "geojson",
        "data": {
          "type": "FeatureCollection",
          "features": [{
            "type": "Feature",
            "geometry": {
              "type": "Point",
              "coordinates": [0, 0]
            }
          }]
        }
      },
      "layout": {
        "icon-image": "pulsing-dot"
      }
    });
  }

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2ludGVyczgxMCIsImEiOiJja3EwOWsybXQwMHdwMm5tcTBtejV5NmxzIn0.l73pc951LYq7xZmJ79TVwg';
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
    });

    map.on('load', function () {
      mapLoaded(map)
    })
  }, [])

  return (
    <div id="wrapper">
      <div id="map"></div>
    </div>
  );
}

export default React.memo(App);
