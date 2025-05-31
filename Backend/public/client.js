document.getElementById('locate-btn').addEventListener('click', () => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Add or update the marker
        if (window.userMarker) {
          window.userMarker.setLngLat([longitude, latitude]);
        } else {
          window.userMarker = new maplibregl.Marker()
            .setLngLat([longitude, latitude])
            .addTo(map);
        }

        map.flyTo({
          center: [longitude, latitude],
          zoom: 15,
          essential: true,
        });
      },
      (error) => {
        alert('Location access denied or unavailable.');
        console.error(error);
      }
    );
  } else {
    alert('Geolocation is not supported by your browser.');
  }
});

const map = new maplibregl.Map({
  style: "https://tiles.openfreemap.org/styles/liberty",
  center: [13.388, 52.517],
  zoom: 9.5,
  container: "map",
});
map.addControl(new maplibregl.NavigationControl(), "top-right");




