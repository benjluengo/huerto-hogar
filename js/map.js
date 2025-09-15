// Initialize Google Maps
function initMap() {
    console.log('initMap called');
    // Check if we have a valid API key
    const apiKey = document.querySelector('script[src*="maps.googleapis.com"]').src.match(/key=([^&]+)/)?.[1];
    console.log('API Key found:', apiKey);
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
        console.log('Invalid API key detected, showing error');
        handleMapError();
        return;
    }

    // Center the map on Chile
    const chileCenter = { lat: -35.6751, lng: -71.5430 };

    // Create the map
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: chileCenter,
        styles: [
            {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
            },
            {
                featureType: 'landscape',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.fill',
                stylers: [{ color: '#ffffff' }, { lightness: 17 }]
            },
            {
                featureType: 'road.highway',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#ffffff' }, { lightness: 29 }, { weight: 0.2 }]
            },
            {
                featureType: 'road.arterial',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }, { lightness: 18 }]
            },
            {
                featureType: 'road.local',
                elementType: 'geometry',
                stylers: [{ color: '#ffffff' }, { lightness: 16 }]
            },
            {
                featureType: 'poi',
                elementType: 'geometry',
                stylers: [{ color: '#f5f5f5' }, { lightness: 21 }]
            },
            {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{ color: '#dedede' }, { lightness: 21 }]
            },
            {
                elementType: 'labels.text.stroke',
                stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { lightness: 16 }]
            },
            {
                elementType: 'labels.text.fill',
                stylers: [{ saturation: 36 }, { color: '#333333' }, { lightness: 40 }]
            },
            {
                elementType: 'labels.icon',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{ color: '#f2f2f2' }, { lightness: 19 }]
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.fill',
                stylers: [{ color: '#fefefe' }, { lightness: 20 }]
            },
            {
                featureType: 'administrative',
                elementType: 'geometry.stroke',
                stylers: [{ color: '#fefefe' }, { lightness: 17 }, { weight: 1.2 }]
            }
        ]
    });

    // Store locations
    const locations = [
        { name: 'Santiago', lat: -33.4489, lng: -70.6693 },
        { name: 'Puerto Montt', lat: -41.4689, lng: -72.9411 },
        { name: 'Villarica', lat: -39.2857, lng: -72.2279 },
        { name: 'Nacimiento', lat: -37.5063, lng: -72.6757 },
        { name: 'Viña del Mar', lat: -33.0246, lng: -71.5518 },
        { name: 'Valparaíso', lat: -33.0472, lng: -71.6127 },
        { name: 'Concepción', lat: -36.8201, lng: -73.0444 }
    ];

    // Add markers for each location
    locations.forEach(location => {
        const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: `Huerto Hogar - ${location.name}`,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#2f855a" stroke="#ffffff" stroke-width="3"/>
                        <text x="20" y="25" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="12" font-weight="bold">🥕</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 40)
            }
        });

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="font-family: 'Montserrat', sans-serif; text-align: center;">
                    <h3 style="color: #2f855a; margin: 0 0 8px 0;">Huerto Hogar</h3>
                    <p style="margin: 0; color: #666;">${location.name}</p>
                    <p style="margin: 8px 0 0 0; font-size: 14px;">¡Nueva tienda disponible!</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });

    // Fit map to show all markers
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
        bounds.extend(new google.maps.LatLng(location.lat, location.lng));
    });
    map.fitBounds(bounds);

    // Adjust zoom level if too close
    google.maps.event.addListenerOnce(map, 'bounds_changed', function() {
        if (map.getZoom() > 8) {
            map.setZoom(8);
        }
    });
}

// Handle map loading error
function handleMapError() {
    console.log('Map loading failed - showing fallback message');
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background-color: #f8f9fa; border-radius: 12px; color: #6c757d; font-family: 'Montserrat', sans-serif;">
                <div style="text-align: center;">
                    <i class="fas fa-map-marked-alt" style="font-size: 48px; margin-bottom: 16px; color: #2f855a;"></i>
                    <h3 style="margin: 0 0 8px 0;">Mapa no disponible</h3>
                    <p style="margin: 0 0 8px 0;">Las ubicaciones de nuestras tiendas están en proceso de actualización.</p>
                    <p style="margin: 0; font-size: 14px; color: #999;">Para activar el mapa, obtén una clave API de Google Maps y reemplaza 'YOUR_GOOGLE_MAPS_API_KEY' en el código.</p>
                </div>
            </div>
        `;
    }
}

// Fallback if Google Maps fails to load
window.addEventListener('load', function() {
    setTimeout(() => {
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            handleMapError();
        }
    }, 5000); // Wait 5 seconds for Google Maps to load
});
