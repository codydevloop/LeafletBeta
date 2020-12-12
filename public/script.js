

const mymap = L.map('mapid').setView([33.25652510159925, -111.69469356536865], 14);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);


//THIS ARRAY NEES TO BE POPULATED WITH THE INFO FROM THE DB

const cords = [
    [33.25996119783698, -111.69651746749877,"candy" ],
    [33.26042994983704, -111.6974401473999,"canes"],
    [33.25149631507163, -111.68724775314331,"are"],
    [33.25078302039739, -111.68699026107787, "tasty"]


];

// THIS LOOP DRAWS ALL THE MARKERS

for (i = 0; i < cords.length; i++) {
    const lat = cords[i][0];
    const long = cords[i][1];

    let marker = L.circle([lat,long]).addTo(mymap).bindPopup(cords[i][2]);
    // console.log(i);
}

// console.log(cords);
// const lat = cords[0];
// const long = cords[1];
// let marker = L.marker([lat, long]).addTo(mymap);

// let marker = L.marker([33.25996119783698, -111.69651746749877]).addTo(mymap);
// let marker2 = L.marker([33.26042994983704, -111.6974401473999]).addTo(mymap);
// let marker3 = L.marker([33.25149631507163, -111.68724775314331]).addTo(mymap);
// let marker4 = L.marker([33.25078302039739, -111.68699026107787]).addTo(mymap);

