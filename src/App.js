import React, {useEffect, useRef} from 'react'
import './App.css';

import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js'
import MapboxLanguage from '@mapbox/mapbox-gl-language'

const china = require('./100000_full.json')

function App() {

  const mapRef = useRef()

  const mapLoaded = (map) => {
    // 中文
    map.addControl(new MapboxLanguage({defaultLanguage: 'zh'}));

    initFill(map)

    addMarkers(map)
  }

  //首次填充颜色
  const initFill =(map) => {
    china.features.forEach(item => {
      item.properties.confirmed = Math.random() * 10000
    })

    map.addSource("fillSourceID", {
      type: "geojson" /* geojson类型资源 */,
      data: china, /* geojson数据 */
    });
    map.addLayer({
      id: "fillID",
      type: "fill" /* fill类型一般用来表示一个面，一般较大 */,
      source: "fillSourceID",

      paint: {
        "fill-color": {
          property: "confirmed", // this will be your density property form you geojson
          stops: [
            [0, "#ffffff"],
            // [10, "#ffd0a6"],
            // [100, "#ffaa7f"],
            // [500, "#ff704e"],
            // [1000, "#f04040"],
            [10000, "#b50a09"]
          ]
        },
        "fill-opacity": 0.8, /* 透明度 */
        "fill-opacity-transition": {
          "duration": 1000,
          "delay": 0
        }
      }
    });
  }

  const addMarkers = (map) => {
    // Create a default Marker and add it to the map.
    const marker1 = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([117, 40])
      .addTo(map);

  }

  const changeColor = () => {
    if(mapRef.current){
      china.features.forEach(item => {
        item.properties.confirmed = Math.random() * 10000
      })

      const source = mapRef.current.getSource("fillSourceID")
      source.setData(china)
    }
  }
  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1Ijoid2ludGVyczgxMCIsImEiOiJja3EwOWsybXQwMHdwMm5tcTBtejV5NmxzIn0.l73pc951LYq7xZmJ79TVwg';
    let map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/light-v9',
      center: [
        105,
        36
      ],
      zoom: 3,
      "transition": {
        "duration": 300,
        "delay": 0
      }
      // maxBounds: [[70, 17 ], [ 136, 55]]
    });

    map.on('load', function () {
      mapRef.current = map
      window.map = map
      mapLoaded(map)
    })
  }, [])

  return (
    <div id="wrapper">
      <div id="map"></div>

      <button onClick={changeColor}>更新</button>
    </div>
  );
}

export default React.memo(App);
