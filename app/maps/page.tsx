'use client';

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader, AlertCircle, MapPin, Phone, Globe } from 'lucide-react';

interface PlaceResult {
  name: string;
  formatted_address?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types?: string[];
  phone_number?: string;
  website?: string;
  rating?: number;
  user_ratings_total?: number;
}

export default function MapsPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<PlaceResult[]>([]);
  const [searchRadius, setSearchRadius] = useState(5000); // 5km default
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const placeMarkersRef = useRef<google.maps.Marker[]>([]);

  // Load Google Maps script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setError('Failed to load Google Maps. Please check your API key.');
      setLoading(false);
    };
    script.onload = () => {
      initializeMap();
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize map and get user location
  const initializeMap = () => {
    if (!mapRef.current) return;

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });

          // Create map centered at user location
          const mapInstance = new google.maps.Map(mapRef.current!, {
            zoom: 14,
            center: { lat: latitude, lng: longitude },
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }],
              },
            ],
          });

          setMap(mapInstance);

          // Add user location marker
          const userMarker = new google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: mapInstance,
            title: 'Your Location',
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
          });

          userMarkerRef.current = userMarker;

          // Search for nearby places
          searchNearbyPlaces(mapInstance, latitude, longitude);
          setLoading(false);
        },
        (error) => {
          setError(
            'Unable to access your location. Please enable location services.'
          );
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  // Search for nearby establishments
  const searchNearbyPlaces = (
    mapInstance: google.maps.Map,
    lat: number,
    lng: number
  ) => {
    const service = new google.maps.places.PlacesService(mapInstance);

    const request: google.maps.places.PlaceSearchRequest = {
      location: new google.maps.LatLng(lat, lng),
      radius: searchRadius,
      type: 'establishment',
    };

    service.nearbySearch(request, (results, status) => {
      if (
        status === google.maps.places.PlacesServiceStatus.OK &&
        results
      ) {
        setNearbyPlaces(results.slice(0, 15)); // Show top 15 results

        // Clear existing markers
        placeMarkersRef.current.forEach((marker) => marker.setMap(null));
        placeMarkersRef.current = [];

        // Add markers for each place
        results.slice(0, 15).forEach((place, index) => {
          if (place.geometry?.location) {
            const marker = new google.maps.Marker({
              position: place.geometry.location,
              map: mapInstance,
              title: place.name,
              label: {
                text: (index + 1).toString(),
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
              },
            });

            // Add click listener to show info window
            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="p-2">
                  <h3 class="font-bold text-sm">${place.name}</h3>
                  <p class="text-xs text-gray-600">${place.formatted_address || ''}</p>
                </div>
              `,
            });

            marker.addListener('click', () => {
              // Close other info windows
              infoWindow.open(mapInstance, marker);
            });

            placeMarkersRef.current.push(marker);
          }
        });
      }
    });
  };

  // Handle radius change
  const handleRadiusChange = (newRadius: number) => {
    setSearchRadius(newRadius);
    if (map && userLocation) {
      searchNearbyPlaces(map, userLocation.lat, userLocation.lng);
    }
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="p-6 lg:p-8">
        <Card className="max-w-2xl mx-auto p-8 border-2 border-yellow-200 bg-yellow-50">
          <div className="flex gap-4">
            <AlertCircle className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-yellow-900 mb-3">
                Google Maps API Key Required
              </h2>
              <p className="text-yellow-800 mb-4">
                The Maps feature requires a Google Maps API key to work. Here's how to add it:
              </p>
              <ol className="space-y-2 text-yellow-800 mb-6 list-decimal list-inside">
                <li>Click the <strong>Vars</strong> tab in the left sidebar</li>
                <li>Look for <code className="bg-yellow-100 px-2 py-1 rounded">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code></li>
                <li>Paste your Google Maps API key</li>
                <li>Refresh this page</li>
              </ol>
              <p className="text-sm text-yellow-700 mb-4">
                Don't have an API key? Get one from <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Google Cloud Console</a>
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your location...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-900">{error}</p>
            <p className="text-sm text-red-700 mt-1">
              Make sure your API key has the necessary permissions and is restricted to your domain.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden h-[600px] lg:h-[700px]">
            <div ref={mapRef} className="w-full h-full" />
          </Card>
        </div>

        {/* Sidebar with nearby places */}
        <div className="flex flex-col gap-4">
          {/* Radius Control */}
          <Card className="p-4">
            <h3 className="font-bold mb-4">Search Radius</h3>
            <div className="space-y-2">
              {[1000, 2500, 5000, 10000].map((radius) => (
                <Button
                  key={radius}
                  variant={searchRadius === radius ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => handleRadiusChange(radius)}
                >
                  {radius / 1000} km
                </Button>
              ))}
            </div>
          </Card>

          {/* Nearby Places List */}
          <Card className="p-4 flex-1 overflow-y-auto">
            <h3 className="font-bold mb-4">Nearby Establishments</h3>
            <div className="space-y-3">
              {nearbyPlaces.length > 0 ? (
                nearbyPlaces.map((place, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border border-border hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <span className="font-bold text-sm text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {index + 1}
                      </span>
                      <p className="font-medium text-sm line-clamp-2">
                        {place.name}
                      </p>
                    </div>

                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {place.formatted_address || 'Address not available'}
                    </p>

                    {place.rating && (
                      <div className="text-xs text-muted-foreground mb-2">
                        ⭐ {place.rating} ({place.user_ratings_total} reviews)
                      </div>
                    )}

                    <div className="flex gap-2 text-xs">
                      {place.phone_number && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7"
                          asChild
                        >
                          <a href={`tel:${place.phone_number}`}>
                            <Phone className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      {place.website && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7"
                          asChild
                        >
                          <a href={place.website} target="_blank" rel="noopener noreferrer">
                            <Globe className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No establishments found in this area
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
