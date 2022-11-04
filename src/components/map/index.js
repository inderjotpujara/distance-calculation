import React, { Component } from 'react';
import ReactMapGL, { Layer, Marker, Source } from 'react-map-gl';
import CONFIG from '../../config.json';
import Pin from './pin';
import uuid from 'react-uuid';
import { getDistanceFromLatLonInKm, middlePoint } from '../../utils';
import { FullscreenControl } from 'react-map-gl';
import { GeolocateControl } from 'react-map-gl';
import { NavigationControl } from 'react-map-gl';
import { ScaleControl } from 'react-map-gl';

function DrawMarkers({ markers }) {
    return (
        markers.length && markers.map((marker, index) =>
            <Marker
                longitude={marker.longitude}
                latitude={marker.latitude}
                anchor="bottom"
                key={uuid()}
            >
                <Pin size={120} name={index+1} />
            </Marker>
        )
    );
}

class MapDraw extends Component {
    constructor(props) {
        super(props);

        this.state = {
            markers: [],
            prevMarker: null,
            currMarker: null,
            lineData: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: [
                        
                    ]
                },
                'features': []
            },
            distanceData: {
                'type': 'FeatureCollection',
                'features': []
            },
            viewport: {
                latitude: 13.063725,
                longitude: 77.589673,
                zoom: 7.0,
                bearing: 0,
                pitch: 0,
                dragPan: true,
                width: '100%',
                height: '100%'
            },
        }
        this.mapRef = React.createRef(null);
    }

    onMapClick = (event) => {
        const incomingMarker = {
            latitude: event.lngLat[1],
            longitude: event.lngLat[0]
        };
        let { prevMarker, currMarker, lineData, distanceData } = this.state;

        lineData = {
            ...lineData,
            geometry: {
                type: "LineString",
                coordinates: [
                    ...lineData.geometry.coordinates,
                    [incomingMarker.longitude, incomingMarker.latitude]
                ]
            }
        };

        if (prevMarker === null) { 
            prevMarker = incomingMarker
            currMarker = incomingMarker
            
        } else {
            prevMarker = currMarker;
            currMarker = incomingMarker;
            distanceData = {
                ...distanceData,
                features: [
                    ...distanceData.features,
                    {
                        'type': 'Feature',
                        'properties': {
                            'description': `${getDistanceFromLatLonInKm(prevMarker.latitude, prevMarker.longitude, currMarker.latitude, currMarker.longitude)} kms`,
                            'icon': 'theatre-15'
                        },
                        'geometry': {
                            'type': 'Point',
                            'coordinates': middlePoint(prevMarker.latitude, prevMarker.longitude, currMarker.latitude, currMarker.longitude),
                        }
                    },
                ]

            }
        }

        const markers = [
            ...this.state.markers,
            incomingMarker
        ]
        this.setState({ markers, prevMarker, currMarker, lineData, distanceData });
    }
    
    onReset = () => {
        this.setState({
            markers: [],
            prevMarker: null,
            currMarker: null,
            lineData: {
                type: "Feature",
                properties: {},
                geometry: {
                    type: "LineString",
                    coordinates: [

                    ]
                },
                'features': []
            },
            distanceData: {
                'type': 'FeatureCollection',
                'features': []
            },
            viewport: {
                latitude: 13.063725,
                longitude: 77.589673,
                zoom: 6.8,
                bearing: 0,
                pitch: 0,
                dragPan: true,
                width: '100%',
                height: '100%'
            }
        })
    }

    render() {

        const { markers, lineData, viewport, distanceData } = this.state;
        return (
            <>
                <button style={{ position: 'absolute', top:0, right:0, zIndex:10 }} onClick={this.onReset}>Reset</button>
                <ReactMapGL
                    {...viewport}
                    mapboxApiAccessToken={CONFIG.MAPBOX_ACCESS_TOKEN}
                    onViewportChange={(newViewport) => {
                        this.setState({ viewport: newViewport });
                    }}
                    style={{ width: '100vw', height: '100vh' }}
                    onClick={this.onMapClick}
                    mapStyle={"mapbox://styles/mapbox/dark-v9"}
                >
                    <FullscreenControl position="top-left" />
                    <NavigationControl position="top-left" />
                    <GeolocateControl position="top-left"/>
                    
                    <ScaleControl />
                    <DrawMarkers markers={markers} />

                    <Source id="distance" type="geojson" data={distanceData}>
                        <Layer
                            id="poi-labels'"
                            type="symbol"
                            source="distanceData"
                            layout={{
                                'text-field': ['get', 'description'],
                                'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
                                'text-radial-offset': 0.5,
                                'text-justify': 'auto',
                                'icon-image': ['get', 'icon']
                            }}
                            paint={{
                                "text-color": "green",
                            }}
                        />
                    </Source>

                    <Source id="line" type="geojson" data={lineData}>
                        <Layer
                            id="lineLayer"
                            type="line"
                            source="lineData"
                            layout={{
                                "line-join": "round",
                                "line-cap": "round"
                            }}
                            paint={{
                                "line-color": "yellow",
                                "line-width": 5
                            }}
                        />
                    </Source>
                </ReactMapGL>
            </>
        );
    }
}

export default MapDraw;