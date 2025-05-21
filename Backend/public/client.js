const socket = io("http://localhost:3000/");  // dont need to specify the port if you are using the default port for both backend and frontend

if(navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    socket.emit("location", { latitude, longitude });
  }, (error) => {
    console.error("Error getting location: ", error);
  },
  {
    enableHighAccuracy: true,
    maximumAge:0,
    timeout: 5000
  }
);
}

const map = L.map("map").setView([0, 0], 8); // Initialize the map with a default view
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: 'prabes-dev',
}).addTo(map); // Add OpenStreetMap tiles to the map


const markers = {}; // Object to store markers by socket ID


// Listen for location updates from the server
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude], 8); // Center the map on the new location

  if (markers[id]) {
    markers[id].setLatLng([latitude, longitude]); // Update existing marker position
  } else {
    const marker = L.marker([latitude, longitude]).addTo(map); 
    markers[id] = marker; // Store the marker by socket ID
  }
});

// Remove the marker from the map
socket.on("user-disconnected", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]); 
        delete markers[id]; 
    }
})