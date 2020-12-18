$(document).ready(function () {

    //LEAFLET DRAW MAP
    let useDBdata = 1;   //WHEN CALLING drawMap, DETERMINE IF WE SHOULD USE QUERY THE DB FOR DATA OR USE STATIC DATA
    let staticArray = [];
    const drawMap = () => {

        const mymap = L.map('mapid').setView([33.25652510159925, -111.69469356536865], 14);

        L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
                'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            id: 'mapbox/streets-v11',
            tileSize: 512,
            zoomOffset: -1
        }).addTo(mymap);


        //###CHECK TO SEE IF MAINTENANCE HAS BEEN COMPLETED AND COLOR CIRCLE RED IF IT HAS
        // if (completed){
        //     marker = L.circle([lat, long], {
        //       color: "grey"   
        //     }).addTo(mymap).bindPopup(popupDiv(data[i].garage, data[i].address,data[i].lastname,data[i].id, completed));
        // }else{
        //     marker = L.circle([lat, long], {
        //         color: "green"   
        //       }).addTo(mymap).bindPopup(popupDiv(data[i].garage, data[i].address,data[i].lastname,data[i].id, completed));
        // }
        
        // let marker = L.circle([33.26042994983704,-111.69744014739990],{
        //     color: "green"
        // }).addTo(mymap)
        console.log(staticArray);
        for (i = 0; i < staticArray.length; i++) {


            const lat = staticArray[i].lat;
            console.log(lat);
            const long = staticArray[i].long;
            const completed = staticArray[i].completed;
            const lastname = staticArray[i].lastname;

            if (completed) {
                marker = new L.circle([lat, long], {
                    color: "grey"
                })
                mymap.addLayer(marker)
                marker.bindPopup(popupDiv(staticArray[i].garage, staticArray[i].address, staticArray[i].lastname, staticArray[i].id, completed));
            } else {
                marker = new L.circle([lat, long], {
                    color: "green"
                })
                mymap.addLayer(marker)
                marker.bindPopup(popupDiv(staticArray[i].garage, staticArray[i].address, staticArray[i].lastname, staticArray[i].id, completed));
            }
        }
    } //end of drawMap


   
    //RETRIEVE DATA FROM DB
    const getDataFromDB = () => {
        $.get("/api/all", function (data){
            staticArray = data;
            drawMap();
        })
        // fetch('/api/all')
        //     .then(response => response.json())
        //     .then(data => {

        //         staticArray = data;
        //         // console.log(staticArray);
        //         drawMap();
        //     })
        };  // end fetch
       

    //CUSTOM POPUP TO INCLUDE EACH INDIVIDUAL CUSTOMER RECORD FROM THE DB
    //const testDiv = document.querySelector("#testdiv");

    const popupDiv = (garage, address, lastname, db_id, completed) => {
        const newDiv = document.createElement("div");
        // newDiv.setAttribute("id", id);
        let garageEl = $("<p></p").text("garage: " + garage);
        let addressEl = $("<p></p>").text("address: " + address);
        let lastnameEl = $("<p></p>").text("lastname: " + lastname);

        //
        if (completed) {
            completedButtonEl = $("<button></button>").text("UNDO COMPLETED TASK").css("background-color", "red").attr("id", db_id).click(function () {

                $.ajax({
                    method: "PUT",
                    url: "/api/completed/" + db_id,
                    data: {
                        completed: 0
                    }
                });
                // removeTheCircle(lastname);
            });
        } else {
            completedButtonEl = $("<button></button>").text("TASK COMPLETED").css("background-color", "aqua").attr("id", db_id).click(function () {

                $.ajax({
                    method: "PUT",
                    url: "/api/completed/" + db_id,
                    data: {
                        completed: 1
                    }
                });
                // removeTheCircle(lastname);
            });
        } //end of else

        $(newDiv).append(garageEl, addressEl, lastnameEl, completedButtonEl);

        return newDiv;
    }  // end of popupDiv

    getDataFromDB();
    

});  // end of document ready


// REDRAW MARKER AND POPUP AFTER CLICKING BUTTON
// issue #1 - need to pass lat and long around


// const redrawMarker = (garage, address, lastname, id, completed) => {
//     if (completed) {
//         const marker = L.circle([lat, long], {
//             color: "grey"
//         }).addTo(mymap).bindPopup(popupDiv(garage, address, lastname, id, completed));
//     } else {
//         const marker = L.circle([lat, long], {
//             color: "green"
//         }).addTo(mymap).bindPopup(popupDiv(garage, address, lastname, id, completed));
//     }
// }


// const removeTheCircle = (lastname) => {
//     mymap.removeLayer(markerObject[lastname]);
// }