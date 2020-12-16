$(document).ready(function () {


//TRIED TO BUILD THIS DIV AND PROVIDE IT AS ARG FOR bindPopup
const testDiv = document.querySelector("#testdiv");

const popupDiv = (garage, address, lastname, id) => {
    const newDiv = document.createElement("div");
    newDiv.setAttribute("id", id);
    let garageP = $("<p></p").text("garage: "+garage);
    let addressP =$("<p></p>").text("address: "+address);
    let lastnameP =$("<p></p>").text("lastname: "+lastname);
    let completedButton =$("<button></button>").text("Completed");
        
    $(newDiv).append(garageP,addressP,lastnameP,completedButton);

    return newDiv;
}

const mymap = L.map('mapid').setView([33.25652510159925, -111.69469356536865], 14);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(mymap);


// FETCH USED AS ALTERNATIVE TO JQUERY'S AJAX
fetch('/api/all')
    .then(response => response.json())
    .then(data => {
        // THIS LOOP DRAWS ALL THE MARKERS AND MAKES CALL TO popupDiv
        for (i = 0; i < data.length; i++) {
          
            const lat = data[i].lat;
            const long = data[i].long;
                      
            const marker = L.circle([lat, long], {
                color: 'green'
            }).addTo(mymap).bindPopup(popupDiv(data[i].garage, data[i].address,data[i].lastname,data[i].id));


            //EXAMPLE ON HOW TO SEPARTE THE BIND POPUP
            // marker.bindPopup(data[i].address);
                     
            
        }
    });


    // DEALILNG WITH EVENTS
    // AS WRITTEN, THIS ONLY RESPONDS TO CLICKS THAT ARE NOT CIRCLES
    function onMapClick(e) {
       console.log(e);
    }

    mymap.on('click', onMapClick);

  //THIS IS THE STATIC DATA USED B4 HOOKING UP DB DATA

// const cords = [
//     [33.25996119783698, -111.69651746749877,"candy" ],
//     [33.26042994983704, -111.6974401473999,"canes"],
//     [33.25149631507163, -111.68724775314331,"are"],
//     [33.25078302039739, -111.68699026107787, "tasty"]
// ];

// THIS LOOP DRAWS ALL THE MARKERS used for testing static data

// for (i = 0; i < cords.length; i++) {
//     const lat = cords[i][0];
//     const long = cords[i][1];

//     let marker = L.circle([lat,long]).addTo(mymap).bindPopup(cords[i][2]);
//     console.log(i);
// }

// console.log(cords);
// const lat = cords[0];
// const long = cords[1];
// let marker = L.marker([lat, long]).addTo(mymap);

// let marker = L.marker([33.25996119783698, -111.69651746749877]).addTo(mymap);
// let marker2 = L.marker([33.26042994983704, -111.6974401473999]).addTo(mymap);
// let marker3 = L.marker([33.25149631507163, -111.68724775314331]).addTo(mymap);
// let marker4 = L.marker([33.25078302039739, -111.68699026107787]).addTo(mymap);

// popupDiv(data[i].garage, data[i].address,data[i].lastname,data[i].id);

});