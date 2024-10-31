import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationMap from "./LocationMap";
import { useNavigate } from "react-router-dom";

const storeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/9198/9198446.png",
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [0, -40],
});

const selectedStoreIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/7877/7877890.png",
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [0, -40],
});

const houseIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/7720/7720526.png",
  iconSize: [38, 38],
  iconAnchor: [22, 38],
  popupAnchor: [0, -40],
});

function CenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function MapComponent({
  center,
  stores,
  selectedStore,
  myLocation,
  onSelectStore,
  onLocationSelect,
  user,
  handleDelete,
}) {
  const navigate = useNavigate();
  const [activeStore, setActiveStore] = useState(null);

  const handleSelectStore = (store) => {
    onSelectStore(store);
    setActiveStore(store);
  };

  const handleEdit = (storeId) => {
    navigate(`/edit-store/${storeId}`);
  };

  const handleConfirmDelete = async (storeId) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await handleDelete(storeId); // เรียกใช้ฟังก์ชัน handleDelete ที่ส่งมาจาก props
        alert("Store deleted successfully!"); // แสดงข้อความยืนยัน
      } catch (error) {
        console.error("Error deleting store:", error);
        alert("Failed to delete store!"); // แสดงข้อความแสดงข้อผิดพลาด
      }
    }
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "75vh", width: "100%" }}
    >
      <CenterMap center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {stores.map((store) => (
        <Marker
          key={store.id}
          position={[store.lat, store.lng]}
          icon={
            selectedStore && selectedStore.id === store.id
              ? selectedStoreIcon
              : storeIcon
          }
          eventHandlers={{ click: () => handleSelectStore(store) }}
        >
          <Popup>
            <b>{store.name}</b>
            <p>{store.address}</p>
            <p>Delivery Radius: {store.radius} meters</p>
            <div className="flex items-center space-x-2 mt-2">
              <a
                href={store.direction}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500"
              >
                Get Direction
              </a>
              {user ? (
                user.id === store.adminId ? (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEdit(store.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleConfirmDelete(store.id)}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500">
                    You do not have permission to edit or delete this store.
                  </p>
                )
              ) : (
                <p className="text-gray-500">
                  Please log in to manage this store.
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {activeStore && (
        <Circle
          center={[activeStore.lat, activeStore.lng]}
          radius={activeStore.radius}
          color="#A020F0"
          fillOpacity={0.2}
        />
      )}

      <LocationMap
        myLocation={myLocation}
        icon={houseIcon}
        onLocationSelect={onLocationSelect}
      />
    </MapContainer>
  );
}

export default MapComponent;
