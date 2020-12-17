$(document).ready(function () {

    //LEAFLET DRAW MAP

    const mymap = L.map('mapid').setView([33.25652510159925, -111.69469356536865], 14);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);


    // USING THESE VARIABLES IN ORDER TO KEEP TRACK OF LAYERS AND POSSIBLY DELETE IF NEEDED
    let markerObject = {};
    let marker;

    // FETCH USED AS ALTERNATIVE TO JQUERY'S AJAX
    fetch('/api/all')
        .then(response => response.json())
        .then(data => {

            // THIS LOOP DRAWS ALL THE MARKERS AND MAKES CALL TO popupDiv FOR CUSTOM POPUP
            for (i = 0; i < data.length; i++) {

                const lat = data[i].lat;
                const long = data[i].long;
                const completed = data[i].completed;
                const lastname = data[i].lastname;
                //console.log("from loop:" + completed);

                let cordsToObject = new L.circle([lat, long]);
                markerObject[lastname] = cordsToObject;


                //CHECK TO SEE IF MAINTENANCE HAS BEEN COMPLETED AND COLOR CIRCLE RED IF IT HAS
                // if (completed){
                //     marker = L.circle([lat, long], {
                //       color: "grey"   
                //     }).addTo(mymap).bindPopup(popupDiv(data[i].garage, data[i].address,data[i].lastname,data[i].id, completed));
                // }else{
                //     marker = L.circle([lat, long], {
                //         color: "green"   
                //       }).addTo(mymap).bindPopup(popupDiv(data[i].garage, data[i].address,data[i].lastname,data[i].id, completed));
                // }

                if (completed) {
                    marker = new L.circle([lat, long], {
                        color: "grey"
                    })
                    mymap.addLayer(marker)
                    marker.bindPopup(popupDiv(data[i].garage, data[i].address, data[i].lastname, data[i].id, completed));
                } else {
                    marker = new L.circle([lat, long], {
                        color: "green"
                    })
                    mymap.addLayer(marker)
                    marker.bindPopup(popupDiv(data[i].garage, data[i].address, data[i].lastname, data[i].id, completed));
                }

                //EXAMPLE ON HOW TO SEPARTE THE BIND POPUP
                // marker.bindPopup(data[i].address);          
            }
        });

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
                removeTheCircle(lastname);
            });
            // ##REDRAW
            //redrawMarker(garage, address, lastname, db_id, completed);
            //mymap.removeLayer(this);
            // mymap.removeLayer(this.marker);


        } else {
            completedButtonEl = $("<button></button>").text("TASK COMPLETED").css("background-color", "aqua").attr("id", db_id).click(function () {

                $.ajax({
                    method: "PUT",
                    url: "/api/completed/" + db_id,
                    data: {
                        completed: 1
                    }
                });
                removeTheCircle(lastname);
            });
            // ##REDRAW
            //redrawMarker(garage, address, lastname, db_id, completed);
            //mymap.removeLayer(this);
            // mymap.removeLayer(this.marker);

        }

        $(newDiv).append(garageEl, addressEl, lastnameEl, completedButtonEl);

        return newDiv;
    }

    const removeTheCircle = (lastname) => {

        // console.log(markerObject);
        //console.log(address);
        // map.removeLayer(markerArray);
        // console.log(markerObject[lastname])
        mymap.removeLayer(markerObject[lastname]);
        // redraw(markerObject[lastname]);
        

    }


});


// REDRAW MARKER AND POPUP AFTER CLICKING BUTTON
// issue #1 - need to pass lat and long around
// issue #2 - at this point, mymap is not defined



const redrawMarker = (garage, address, lastname, id, completed) => {

    if (completed) {
        const marker = L.circle([lat, long], {
            color: "grey"
        }).addTo(mymap).bindPopup(popupDiv(garage, address, lastname, id, completed));
    } else {
        const marker = L.circle([lat, long], {
            color: "green"
        }).addTo(mymap).bindPopup(popupDiv(garage, address, lastname, id, completed));
    }

}