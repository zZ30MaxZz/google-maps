let map;
let marker;
let place;
let mapDiv = document.getElementById("map");
let zoom = 15;
let coordinates = { lat: -13.637348, lng: -72.878876 };
let input = document.getElementById("autocomplete-input");
let autocomplete;
let geocoder;
let icon = "https://icons.iconarchive.com/icons/icons-land/vista-map-markers/48/Map-Marker-Marker-Outside-Chartreuse-icon.png";



// Initialize and add the map
function initMap() {
    // The map, centered
    map = new google.maps.Map(mapDiv, {
        zoom: zoom,
        center: coordinates,
    });

    // The marker, positioned
    marker = new google.maps.Marker({
        position: coordinates,
        map: map,
        draggable: true,
        icon: icon
    });
    // [END maps_add_map_instantiate_marker]

    //Geocoder
    geocoder = new google.maps.Geocoder();

    //Autocomplete
    initAutocomplete();

    //Draggable pin
    marker.addListener("dragend", fillInAddressFromMarker);

    //Drag map
    map.addListener("dragend", fillInAddressFromMapMarker);
}

function initAutocomplete() {
    const options = {
        componentRestrictions: { country: "pe" },
        fields: ["address_components", "geometry", "icon", "name"],
        strictBounds: false,
        types: ["establishment"],
    };

    autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddressFromMarker() {
    var lat = marker.getPosition().lat();
    var lng = marker.getPosition().lng();

    pushLocation(lat, lng);

    geocodeCoordinates(lat, lng, input);
}

function fillInAddressFromMapMarker() {
    var lat = map.getCenter().lat();
    var lng = map.getCenter().lng();

    pushLocation(lat, lng);

    geocodeCoordinates(lat, lng, input);
}

function geocodeCoordinates(lat, lng, input) {
    geocoder
        .geocode({
            location: {
                lat: lat,
                lng: lng,
            }
        })
        .then((response) => {
            if (response.results[0]) {
                input.value = response.results[0].formatted_address;
            } else {
                //window.alert("No results found");
            }
        })
        .catch((e) => console.error("Geocoder failed due to: " + e));
}


function fillInAddress() {
    place = autocomplete.getPlace();

    if (place.geometry) {
        var lat = place.geometry.location.lat();
        var lng = place.geometry.location.lng();

        let address1 = "";
        let postcode = "";

        var direction;

        // Get each component of the address from the place details,
        // and then fill-in the corresponding field on the form.
        // place.address_components are google.maps.GeocoderAddressComponent objects
        // which are documented at http://goo.gle/3l5i5Mr
        for (const component of place.address_components) {
            // @ts-ignore remove once typings fixed
            const componentType = component.types[0];

            switch (componentType) {
                case "street_number": {
                    address1 = `${component.long_name} ${address1}`;
                    break;
                }

                case "route": {
                    address1 += component.short_name;
                    break;
                }

                case "postal_code": {
                    postcode = `${component.long_name}${postcode}`;
                    break;
                }

                case "postal_code_suffix": {
                    postcode = `${postcode}-${component.long_name}`;
                    break;
                }
                case "locality":
                    direction += component.long_name;
                    break;
                case "administrative_area_level_1": {
                    direction += component.short_name;
                    break;
                }
                case "country":
                    direction += component.long_name;
                    break;
            }
        }

        pushLocation(lat, lng);
        map.setZoom(zoom);
    }
}

function pushLocation(lat, lng) {
    coordinates = { lat: lat, lng: lng }

    var laLatLng = new google.maps.LatLng(lat, lng);

    map.panTo(laLatLng);


    marker.setPosition(laLatLng);
}


window.initMap = initMap;
  // [END maps_add_map]