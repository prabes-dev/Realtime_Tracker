      // Initialize map
      const map = new maplibregl.Map({
        style: "https://tiles.openfreemap.org/styles/liberty",
        center: [13.388, 52.517],
        zoom: 9.5,
        container: "map",
      });
      map.addControl(new maplibregl.NavigationControl(), "top-right");

      // Store user location
      let userLocation = null;
      let userMarker = null;
      const locateBtn = document.getElementById("locate-btn");

      // Get user location immediately on page load
      function getUserLocation() {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              // Store the location
              userLocation = { lat: latitude, lng: longitude };

              // Update button to ready state
              locateBtn.disabled = false;
              locateBtn.classList.remove("loading");

              console.log("Location obtained:", userLocation);
            },
            (error) => {
              console.error("Location error:", error);

              // Update button to show error state
              locateBtn.textContent = "📍 Location Unavailable";
              locateBtn.disabled = true;

              // Optional: Show user-friendly message
              setTimeout(() => {
                locateBtn.textContent = "📍 My Location";
                locateBtn.disabled = false;
              }, 3000);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000, // Cache location for 5 minutes
            }
          );
        } else {
          locateBtn.textContent = "📍 Not Supported";
          locateBtn.disabled = true;
        }
      }

      // Handle locate button click
      locateBtn.addEventListener("click", () => {
        if (userLocation) {
          // Instantly fly to stored location
          const { lat, lng } = userLocation;

          // Add or update the marker
          if (userMarker) {
            userMarker.setLngLat([lng, lat]);
          } else {
            userMarker = new maplibregl.Marker({
              color: "#007cba",
            })
              .setLngLat([lng, lat])
              .addTo(map);
          }

          map.flyTo({
            center: [lng, lat],
            zoom: 15,
            essential: true,
          });
        } else {
          // Fallback: try to get location again
          locateBtn.textContent = "📍 Getting Location...";
          locateBtn.disabled = true;
          getUserLocation();
        }
      });

      // Get location on page load
      getUserLocation();
