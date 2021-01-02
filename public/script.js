$(document).ready(function () {
    
    let postPath = "";
    
    $("#master").click(function(){
        postPath = "/api/completedjanuary/"
        $("#excelcontainer").hide();
        path = "/api/alljanuary";
        getDataFromDB(path);
        
    })

    $("#testdbdata").click(function(){
        postPath = "/api/completed/"
        path = "/api/all";
        getDataFromDB(path);
        $("#excelcontainer").hide();

    })
    
    
    
    
    //-----------------------------CODE FOR EXCEL UPLOAD AND DATA MANIPULATION---------------------------------------
    //**************** START COMMENT OUT ALL FOR EXCEL *************************************
    let selectedFile;

    document.getElementById('fileUpload')
        .addEventListener('change', (event) => {
            selectedFile = event.target.files[0];
        });

    document.getElementById('uploadExcel')
        .addEventListener('click', (event) => {
            event.preventDefault();
            if (selectedFile) {

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
            }     // end if
        });   // end uploadExcel event


    //  EACH OBJECT CONTAINS A STRING WITH THE CODE, ADDRESS, AND LASTNAME  -  NEED TO SEPARATE AND TRIM THESE FIELDS

    const parseJSON = (allcustomers) => {

        //pull 'name', 'address', 'lat', 'long' and build new array
        let arrayForDB = [];

        allcustomers.forEach((element)=> {
            let newObject = {"lastname": element.Name, "address": element.address, "lat": element.lat, "long": element.long};
            arrayForDB.push(newObject);
        })

       

        // #### ##############  OLD 2020 EXCEL PARSING START ###################
        //#######################################################################
        // //***SPLIT THE STRINGS BY THE HYPHEN "-"
        // let customerSplitObjects = [];

        // allcustomers.forEach((element) => {

        //     //split each customer element
        //     splitStringArray = element.Customer.split("-");

        //     //build new array with split items, add lat and long back in
        //     customerSplitObjects.push([splitStringArray, element.Lat, element.Long]);
        // });

        // //***REBUILD ARRAY OF OBJECTS, TRIM SPACES AND ASSIGN KEY/VALUE PAIRS */

        // let rebuiltArrayOfObjects = [];  // will hold the final product 

        // customerSplitObjects.forEach((element) => {
        //     //removing code for garage
        //     // singleRebuiltObject = { "lastname": element[0][0].trim(), "address": element[0][1].trim(), "code": element[0][2].trim(), "lat": element[1], "long": element[2] };
        //     singleRebuiltObject = { "lastname": element[0][0].trim(), "address": element[0][1].trim(), "lat": element[1], "long": element[2] };
        //     rebuiltArrayOfObjects.push(singleRebuiltObject);
        // });
        //###################################################################
        // #### ##############  OLD 2020 EXCEL PARSING END ###################
        
       

        

        //*********************** LOAD DATA INTO 'January_Master' TABLE OF THE DB **********************************/

        arrayForDB.forEach((element)=>{
            let record = {
                "lastname" : element.lastname,
                "address"  : element.address,
                //"garage" : element.code,  -- removing garage code
                "lat" : element.lat,
                "long" : element.long
            }
            $.ajax({
                method: "POST",
                url: "/api/newjanuary",
                data: record
            });
        })



    }  // end of parseJSON

     //**************** END COMMENT OUT ALL FOR EXCEL ************************************

    // --------------------------------CODE FOR DRAWING MAP------------------------------

    //LEAFLET DRAW MAP
    let staticArray = [];
    const drawMap = (zoom, center) => {
        if (!zoom) {
            zoom = 14;
            center = {
                lat: 33.25652510159925,
                lng: -111.69469356536865
            }
        }
        const mymap = L.map('mapid').setView([center.lat, center.lng], zoom);

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
                marker.bindPopup(popupDiv( staticArray[i].address, staticArray[i].lastname, staticArray[i].id, completed, mymap));
                
            } else {
                marker = new L.circle([lat, long], {
                    color: "green"
                })
                mymap.addLayer(marker)
                marker.bindPopup(popupDiv(staticArray[i].address, staticArray[i].lastname, staticArray[i].id, completed, mymap));
            }
            console.log(staticArray[i]);
        }


    } //end of drawMap



    //RETRIEVE DATA FROM DB
    const getDataFromDB = (path) => {
        $.get(path, function (data) {
            staticArray = data;
            drawMap();
            // console.log(staticArray);
        })
    };  // end fetch


    //CUSTOM POPUP TO INCLUDE EACH INDIVIDUAL CUSTOMER RECORD FROM THE DB
    //const testDiv = document.querySelector("#testdiv");

    const popupDiv = (address, lastname, db_id, completed, mymap) => {
        const newDiv = document.createElement("div");
        // newDiv.setAttribute("id", id);
        // let garageEl = $("<p></p").text("garage: " + garage);
        let addressEl = $("<p></p>").text("address: " + address);
        let lastnameEl = $("<p></p>").text("lastname: " + lastname);
        // let zoom = mymap.getZoom();
        // console.log(zoom);


        if (completed) {
            completedButtonEl = $("<button></button>").text("UNDO COMPLETED TASK").css("background-color", "red").attr("id", db_id).click(function () {

                $.ajax({
                    method: "PUT",
                    url: postPath + db_id,
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
                completed = false;
                //console.log(center.lat, center.lng);
                updateStaticArray(zoom, center, db_id, completed, mymap);
                //setTimeout(function () { mymap.remove(), getDataFromDB() }, 3000);

            });
        } else {
            completedButtonEl = $("<button></button>").text("TASK COMPLETED").css("background-color", "aqua").attr("id", db_id).click(function () {

                $.ajax({
                    method: "PUT",
                    url: postPath + db_id,
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
                completed = true;
                //console.log(center.lat, center.lng);
                updateStaticArray(zoom, center, db_id, completed, mymap);
                //setTimeout(function () { mymap.remove(), getDataFromDB() }, 1000);

            });
        } //end of else

        $(newDiv).append(addressEl, lastnameEl, completedButtonEl);

        return newDiv;
    }  // end of popupDiv


    const updateStaticArray = (zoom, center, db_id, completed, mymap) => {

        for (i = 0; i < staticArray.length; i++) {
            if (staticArray[i].id == db_id) {
                console.log()
                staticArray[i].completed = completed;
            }
        };

        // setTimeout(function () { mymap.remove(), drawMap(zoom, center) }, 1000);
        mymap.remove();
        drawMap(zoom, center);
    }

    //THIS ONLY RUNS WHEN LOADING THE APP THE FIRST TIME - ALL UPDATES ARE FROM staticArray
    // getDataFromDB();




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