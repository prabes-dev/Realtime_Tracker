const map = new maplibregl.Map({
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [13.388, 52.517],
  zoom: 9.5,
  container: "map",
});

//adds direction plugin
const directions = new MapboxDirections({
 accessToken: 'pk.eyJ1IjoiZXN0aGVyY2F0ZXYiLCJhIjoiY2wyN2w3M256MDBqYjN0bW1uOG16ZzVqdiJ9.apozKCwK2RIwWPweckfjSg',
  unit: 'metric',
  profile: 'mapbox/driving',
});

let directionsVisible = true; // initial state
const directionBtn = document.getElementById('direction-btn');

// assume 'directions' is an instance of MapboxDirections
directionBtn.addEventListener('click', () => {
  if (directionsVisible) {
    map.removeControl(directions); // hide panel
  } else {
    map.addControl(directions, 'top-left'); // show panel
  }
  directionsVisible = !directionsVisible; // toggle state
});

map.addControl(directions, 'top-left');

map.addControl(new maplibregl.NavigationControl(), "top-right");


// Store user marker and latest position
let userMarker = null;
let latestCoords = null;
const locateBtn = document.getElementById("locate-btn");

// Start watching location
function startTrackingLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Update latest coordinates
        latestCoords = [longitude, latitude];

        // Update or add marker on map
        if (userMarker) {
          userMarker.setLngLat(latestCoords);
        } else {
          userMarker = new maplibregl.Marker({ color: "#007cba" })
            .setLngLat(latestCoords)
            .addTo(map);
        }

        locateBtn.disabled = false;
        locateBtn.classList.remove("loading");
      },
      (error) => {
        console.error("Location error:", error);
        locateBtn.disabled = true;
        setTimeout(() => {
          locateBtn.disabled = false;
        }, 3000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Always get fresh data
      }
    );
  } else {
    locateBtn.disabled = true;
  }
}

// Fly to current location on button click
locateBtn.addEventListener("click", () => {
  if (latestCoords) {
    map.flyTo({
      center: latestCoords,
      zoom: 15,
      essential: true,
    });
  }
});

// Start tracking immediately
startTrackingLocation();
