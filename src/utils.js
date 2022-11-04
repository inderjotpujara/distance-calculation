import * as turf from "@turf/turf";

export function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function toRad(num) {
    return num * Math.PI / 180;
}

function toDeg(num) {
    return num * (180 / Math.PI);
}

export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let line = turf.lineString([[lat1, lon1], [lat2, lon2]]);
    return turf.length(line, { units: 'kilometers' }).toFixed(2);
}

export function middlePoint(lat1, lng1, lat2, lng2) {

    var dLng = toRad(lng2 - lng1);

    lat1 = toRad(lat1);
    lat2 = toRad(lat2);
    lng1 = toRad(lng1);

    var bX = Math.cos(lat2) * Math.cos(dLng);
    var bY = Math.cos(lat2) * Math.sin(dLng);
    var lat3 = Math.atan2(Math.sin(lat1) + Math.sin(lat2), Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY));
    var lng3 = lng1 + Math.atan2(bY, Math.cos(lat1) + bX);

    return [toDeg(lng3), toDeg(lat3)];
}
