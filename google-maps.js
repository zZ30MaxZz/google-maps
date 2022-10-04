let map;
let mapDiv = document.getElementById("map");
let zoom = 14;
let coordinates = { lat: -13.637348, lng: -72.878876 };



// Initialize and add the map
function initMap() {
    // The map, centered 
    map = new google.maps.Map(mapDiv, {
        zoom: zoom,
        center: coordinates,
    });

    // The marker, positioned 
    const marker = new google.maps.Marker({
        position: coordinates,
        map: map,
    });
    // [END maps_add_map_instantiate_marker]
}

window.initMap = initMap;
  // [END maps_add_map]