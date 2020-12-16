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


// FETCH USED AS ALTERNATIVE TO JQUERY'S AJAX
fetch('/api/all')
    .then(response => response.json())
    .then(data => {

        // THIS LOOP DRAWS ALL THE MARKERS AND MAKES CALL TO popupDiv FOR CUSTOM POPUP
        for (i = 0; i < data.length; i++) {
          
            const lat = data[i].lat;
            const long = data[i].long;
            const  completed = data[i].completed;
            console.log("from loop:" + completed);
         
            //CHECK TO SEE IF MAINTENANCE HAS BEEN COMPLETED AND COLOR CIRCLE RED IF IT HAS
            if (completed){
                const marker = L.circle([lat, long], {
                  color: "grey"   
                }).addTo(mymap).bindPopup(popupDiv(data[i].garage, data[i].address,data[i].lastname,data[i].id, completed));
            }else{
                const marker = L.circle([lat, long], {
                    color: "green"   
                  }).addTo(mymap).bindPopup(popupDiv(data[i].garage, data[i].address,data[i].lastname,data[i].id, completed));
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
    let garageP = $("<p></p").text("garage: "+garage);
    let addressP =$("<p></p>").text("address: "+address);
    let lastnameP =$("<p></p>").text("lastname: "+lastname);

    //
    if(completed){
        completedButton =$("<button></button>").text("UNDO COMPLETED TASK").css("background-color","red").attr("id", db_id).click(function(){
            // console.log(db_id);
            $.ajax({
                method: "PUT",
                url: "/api/completed/" + db_id,
                data: {
                    completed: 0
                }
            }) 

        });
    }else{
        completedButton =$("<button></button>").text("TASK COMPLETED").css("background-color","aqua").attr("id", db_id).click(function(){
            // console.log(db_id)
            $.ajax({
                method: "PUT",
                url: "/api/completed/" + db_id,
                data: {
                    completed: 1
                }
            }) 
        });
    }
        
    $(newDiv).append(garageP,addressP,lastnameP,completedButton);

    return newDiv;
}


});

const redrawMarker = () => {
    
}