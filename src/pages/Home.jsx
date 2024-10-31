import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import HeaderComponent from "../components/Header";
import ButtonComponent from "../components/Button";
import MapComponent from "../components/Map";
import { useAuthContext } from "../context/AuthContext"; // แก้ไขการนำเข้า

const Home = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuthContext(); // แก้ไขการนำเข้าข้อมูลผู้ใช้

  const center = [13.83687318, 100.030047];
  const [stores, setStores] = useState([]);
  const [myLocation, setMyLocation] = useState({ lat: "", lng: "" });
  const [selectedStore, setSelectedStore] = useState(null);
  const [deliveryZone, setDeliveryZone] = useState({
    lat: null,
    lng: null,
    radius: 1000,
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${base_url}/api/v1/stores`);
        if (response.status === 200) {
          setStores(response.data);
        }
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };
    fetchStores();
  }, [base_url]);

  const handlerGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMyLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          Swal.fire({
            title: "Error!",
            text: "Unable to retrieve your location. Please try again later.",
            icon: "error",
            confirmButtonText: "OK",
          });
        }
      );
    } else {
      Swal.fire({
        title: "Error!",
        text: "Geolocation is not supported by this browser.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Radius of the Earth in km
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return R * c * 1000; // Distance in meters
  };
  

  const handleEdit = (storeId) => {
    console.log("Edit store with ID:", storeId);
    // Add your edit logic here
  };

  const handleDelete = async (storeId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(
          `${base_url}/api/v1/stores/${storeId}`
        );
        if (response.status === 200) {
          Swal.fire("Deleted!", "Your store has been deleted.", "success");
          setStores(stores.filter((store) => store.id !== storeId)); // Remove store from local state
        }
      } catch (error) {
        console.error("Error deleting store:", error);
        Swal.fire("Error!", "There was a problem deleting the store.", "error");
      }
    }
  };

  const handleLocationCheck = () => {
    if (!myLocation.lat || !myLocation.lng) {
      Swal.fire({
        title: "Error!",
        text: "Please enter your valid location",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    if (!selectedStore) {
      Swal.fire({
        title: "Error!",
        text: "Please select a store",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    const distance = calculateDistance(
      myLocation.lat,
      myLocation.lng,
      selectedStore.lat,
      selectedStore.lng
    );

    if (distance <= deliveryZone.radius) {
      Swal.fire({
        title: "Success",
        text: "You are within the delivery zone for " + selectedStore.name,
        icon: "success",
        confirmButtonText: "OK",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "You are outside the delivery zone for " + selectedStore.name,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="p-4">
      <HeaderComponent />
      <ButtonComponent
        onGetLocation={handlerGetLocation}
        onCheckDelivery={handleLocationCheck}
      />
      <div className="flex-1 mt-4 md:mt-8">
        <div className="border border-gray-300 rounded-lg shadow-md overflow-hidden">
          <MapComponent
            center={center}
            stores={stores}
            selectedStore={selectedStore}
            myLocation={myLocation}
            onSelectStore={setSelectedStore}
            onLocationSelect={setMyLocation}
            user={user} // ส่ง user ไปยัง MapComponent
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
