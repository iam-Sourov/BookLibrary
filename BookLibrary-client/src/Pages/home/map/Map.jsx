import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import { Badge } from "@/components/ui/badge";
import { Truck } from 'lucide-react';

const createCustomIcon = () => {
  return L.divIcon({
    className: "custom-marker-icon",
    html: `
      <div class="relative flex items-center justify-center w-8 h-8 group">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-40 duration-1000"></span>
        <div class="relative flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-lg border border-background transition-transform group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const Map = () => {
  const [isDark, setIsDark] = React.useState(() => 
    document.documentElement.classList.contains("dark")
  );

  React.useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    
    return () => observer.disconnect();
  }, []);

  const customIcon = createCustomIcon();

  const cities = [
    { name: "Dhaka (HQ)", pos: [23.8103, 90.4125], main: true },
    { name: "Chittagong", pos: [22.3569, 91.7832], main: true },
    { name: "Sylhet", pos: [24.8949, 91.8687], main: true },
    { name: "Rajshahi", pos: [24.3745, 88.6042], main: true },
    { name: "Khulna", pos: [22.8456, 89.5403], main: true },
    { name: "Gazipur", pos: [24.0958, 90.4125] },
    { name: "Narayanganj", pos: [23.6238, 90.5000] },
    { name: "Tangail", pos: [24.2513, 89.9167] },
    { name: "Faridpur", pos: [23.6071, 89.8429] },
    { name: "Narsingdi", pos: [23.9322, 90.7154] },
    { name: "Manikganj", pos: [23.8644, 90.0047] },
    { name: "Munshiganj", pos: [23.5422, 90.5305] },
    { name: "Comilla", pos: [23.4607, 91.1809] },
    { name: "Cox's Bazar", pos: [21.4272, 92.0058] },
    { name: "Feni", pos: [23.0186, 91.3966] },
    { name: "Brahmanbaria", pos: [23.9571, 91.1119] },
    { name: "Noakhali", pos: [22.8724, 91.0973] },
    { name: "Chandpur", pos: [23.2321, 90.6631] },
    { name: "Lakshmipur", pos: [22.9447, 90.8282] },
    { name: "Moulvibazar", pos: [24.4829, 91.7774] },
    { name: "Habiganj", pos: [24.3749, 91.4155] },
    { name: "Sunamganj", pos: [25.0658, 91.3950] },
    { name: "Bogra", pos: [24.8481, 89.3730] },
    { name: "Pabna", pos: [24.0040, 89.2500] },
    { name: "Sirajganj", pos: [24.4534, 89.7008] },
    { name: "Jessore", pos: [23.1634, 89.2182] },
    { name: "Kushtia", pos: [23.9013, 89.1204] },
    { name: "Satkhira", pos: [22.7185, 89.0705] },
    { name: "Barisal", pos: [22.7010, 90.3535] },
    { name: "Patuakhali", pos: [22.3596, 90.3299] },
    { name: "Rangpur", pos: [25.7439, 89.2752] },
    { name: "Dinajpur", pos: [25.6217, 88.6355] },
    { name: "Mymensingh", pos: [24.7471, 90.4203] },
    { name: "Jamalpur", pos: [24.9375, 89.9378] },
  ];

  return (
    <div className="relative w-full rounded-3xl border border-border bg-card overflow-hidden group">
      <style>{`
        .leaflet-container {
          background-color: var(--color-background) !important;
        }
        .leaflet-bar {
          border: 1px solid var(--color-border) !important;
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4) !important;
          background-color: var(--color-card) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .leaflet-bar a {
          background-color: var(--color-card) !important;
          color: var(--color-foreground) !important;
          border-bottom: 1px solid var(--color-border) !important;
          transition: all 0.2s ease !important;
        }
        .leaflet-bar a:hover {
          background-color: var(--color-muted) !important;
          color: var(--color-primary) !important;
        }
        .leaflet-control-attribution {
          background: var(--color-card) !important;
          color: var(--color-muted-foreground) !important;
          border-top-left-radius: 8px !important;
          border-left: 1px solid var(--color-border) !important;
          border-top: 1px solid var(--color-border) !important;
        }
        .leaflet-control-attribution a {
          color: var(--color-primary) !important;
        }
        .leaflet-popup-content-wrapper {
          background: var(--color-card) !important;
          color: var(--color-foreground) !important;
          border: 1px solid var(--color-border) !important;
          border-radius: 14px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6) !important;
          padding: 4px !important;
        }
        .leaflet-popup-tip {
          background: var(--color-card) !important;
          border-left: 1px solid var(--color-border) !important;
          border-bottom: 1px solid var(--color-border) !important;
        }
      `}</style>
      <div className="w-full h-[450px] md:h-[550px] relative z-0">
        <MapContainer
          center={[23.75, 90.35]}
          zoom={7}
          scrollWheelZoom={false}
          className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url={isDark 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            } />
          {cities.map((city, i) => (
            <Marker
              key={i}
              position={city.pos}
              icon={customIcon}>
              <Popup className="custom-popup">
                <div className="p-1.5 text-center">
                  <span className="font-bold text-sm block mb-0.5">{city.name}</span>
                  <span className="text-xs text-muted-foreground">Standard Delivery: 2-3 Days</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      <div className="absolute top-20 left-2 z-400 bg-card/65 backdrop-blur-md border border-border shadow-2xl p-5 rounded-2xl max-w-[220px] hidden md:block">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Truck className="h-4 w-4 text-primary" />
          </div>
          <h4 className="font-bold text-sm text-foreground">Logistics</h4>
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-extrabold text-foreground">{cities.length}</div>
          <p className="text-xs text-muted-foreground">Districts Covered</p>
        </div>
        <div className="mt-4 pt-3 border-t border-border/50">
          <Badge variant="outline" className="w-full justify-center border text-[10px] h-6 bg-background/20 font-medium">
            Updated: Today
          </Badge>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background/20 to-transparent pointer-events-none z-400" />
    </div>
  );
};

export default Map;