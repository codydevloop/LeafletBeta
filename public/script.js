$(document).ready(function () {
    //-----------------------------CODE FOR EXCEL UPLOAD AND DATA MANIPULATION---------------------------------------

    let selectedFile;

    document.getElementById('fileUpload')
        .addEventListener('change', (event) => {
            selectedFile = event.target.files[0];

        });

    document.getElementById('uploadExcel')
        .addEventListener('click', (event) => {
            event.preventDefault();

            let month = document.getElementById("nameofmonth").value;
            console.log(month);

            if (month === "") {
                document.getElementById("nameofmonth").placeholder = " !! ERROR - PLEASE ENTER A MONTH";

            } else if (selectedFile) {

                let fileReader = new FileReader();
                fileReader.onload = (event) => {
                    let data = event.target.result;

                    let workbook = XLSX.read(data, {
                        type: "binary"
                    });

                    workbook.SheetNames.forEach(sheet => {
                        let rowObject = XLSX.utils.sheet_to_row_object_array(
                            workbook.Sheets[sheet]
                        );
                        let jsonObject = JSON.stringify(rowObject);
                        //display in body of webpage
                        // document.getElementById("jsonData").innerHTML = jsonObject;
                        // console.log(jsonObject);

                        //**CALL TO PARSE OUT DATA */
                        parseJSON(rowObject)

                    });
                };
                fileReader.readAsBinaryString(selectedFile);



                //create an input box to name this file - preferably a month
                // assign the json object that name

                //parse the JSON object and seperate out the "name" , "address", and "garage code"

                //get lat/long for each address

                //create a new table in the DB with the month as the name and then input all the information

                //reload the page with the new information as an option to choose.
            }
        });   // end uploadExcel event



    //EACH OBJEC CONTAINS A STRING WITH THE CODE, ADDRESS, AND LASTNAME  -  NEED TO SEPARTE THESE FIELDS

    const parseJSON = (allcustomers) => {

        //***SPLIT THE STRINGS BY THE HYPHEN "-"
        let customerSplitObjects = [];

        allcustomers.forEach((element) => {

            //split each customer element
            splitStringArray = element.Customer.split("-");

            //build new array with split items 
            customerSplitObjects.push([splitStringArray, element.Lat, element.Long]);
        });

        //***REBUILD ARRAY OF OBJECTS, TRIM SPACES AND ASSING KEY/VALUE PAIRS */
        let rebuiltArrayOfObjects = [];

        customerSplitObjects.forEach((element) => {
            singleRebuiltObject = { "lastname": element[0][0].trim(), "address": element[0][1].trim(), "code": element[0][2].trim(), "lat": element[1], "long": element[2] };
            rebuiltArrayOfObjects.push(singleRebuiltObject);
        });
        console.log(rebuiltArrayOfObjects);

    }  // end of parseJSON


    // --------------------------------CODE FOR DRAWING MAP------------------------------

    //LEAFLET DRAW MAP
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

        // console.log(staticArray);
        for (i = 0; i < staticArray.length; i++) {


            const lat = staticArray[i].lat;
            const long = staticArray[i].long;
            const completed = staticArray[i].completed;
            const lastname = staticArray[i].lastname;

            if (completed) {
                marker = new L.circle([lat, long], {
                    color: "grey"
                })
                mymap.addLayer(marker)
                marker.bindPopup(popupDiv(staticArray[i].garage, staticArray[i].address, staticArray[i].lastname, staticArray[i].id, completed, mymap));
            } else {
                marker = new L.circle([lat, long], {
                    color: "green"
                })
                mymap.addLayer(marker)
                marker.bindPopup(popupDiv(staticArray[i].garage, staticArray[i].address, staticArray[i].lastname, staticArray[i].id, completed, mymap));
            }
        }
    } //end of drawMap



    //RETRIEVE DATA FROM DB
    const getDataFromDB = () => {
        $.get("/api/all", function (data) {
            staticArray = data;
            drawMap();
        })
    };  // end fetch


    //CUSTOM POPUP TO INCLUDE EACH INDIVIDUAL CUSTOMER RECORD FROM THE DB
    //const testDiv = document.querySelector("#testdiv");

    const popupDiv = (garage, address, lastname, db_id, completed, mymap) => {
        const newDiv = document.createElement("div");
        // newDiv.setAttribute("id", id);
        let garageEl = $("<p></p").text("garage: " + garage);
        let addressEl = $("<p></p>").text("address: " + address);
        let lastnameEl = $("<p></p>").text("lastname: " + lastname);
        // let zoom = mymap.getZoom();
        // console.log(zoom);


        if (completed) {
            completedButtonEl = $("<button></button>").text("UNDO COMPLETED TASK").css("background-color", "red").attr("id", db_id).click(function () {

                $.ajax({
                    method: "PUT",
                    url: "/api/completed/" + db_id,
                    data: {
                        completed: 0
                    }
                });
                //##THERE HAS TO BE A BETTER WAY TO DO THIS
                //## CONSIDER JUST UPDATING THE STATIC ARRAY (AS IS WORKS NOT, THERE IS NO NEED FOR IT)
                //## ALSO NEED TO FIGURE OUT HOW TO FIND AND PASS THE CURRENT CORDS AND ZOOM LEVEL
                //## SO WHEN THE MAP RELOADS THOSE SETTINGS STICK
                let zoom = mymap.getZoom();
                let center = mymap.getCenter();
                //console.log(center.lat, center.lng);
                
                setTimeout(function () { mymap.remove(), getDataFromDB() }, 3000);

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

                //##THERE HAS TO BE A BETTER WAY TO DO THIS
                //## CONSIDER JUST UPDATING THE STATIC ARRAY (AS IS WORKS NOT, THERE IS NO NEED FOR IT)
                //## ALSO NEED TO FIGURE OUT HOW TO FIND AND PASS THE CURRENT CORDS AND ZOOM LEVEL
                //## SO WHEN THE MAP RELOADS THOSE SETTINGS STICK
                let zoom = mymap.getZoom();
                let center = mymap.getCenter();
                //console.log(center.lat, center.lng);
                setTimeout(function () { mymap.remove(), getDataFromDB() }, 1000);

            });
        } //end of else

        $(newDiv).append(garageEl, addressEl, lastnameEl, completedButtonEl);

        return newDiv;
    }  // end of popupDiv


    const updateStaticArray = () => {
        // recieve an identifier of which element needs to be changed and make the change
        // recieve lat/long and zoom levels of map position when popupDiv is clicked and pass them to drawMap
        //remove map and redraw
    }

    getDataFromDB();




});  // end of document ready


// REDRAW MARKER AND POPUP AFTER CLICKING BUTTON
// issue #1 - need to pass lat and long around

// const redrawMarker = (garage, address, lastname, id, completed, lat, long,mymap) => {



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