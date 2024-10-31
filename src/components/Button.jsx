import React from "react";

function ButtonComponent({ onGetLocation, onCheckDelivery }) {
  return (
    <div className="flex flex-col md:flex-row md:justify-center md:space-x-4 space-y-2 md:space-y-0">
      <button 
        className="btn btn-primary w-full md:w-auto"
        onClick={onGetLocation}
      >
        Get My Location
      </button>
      <button 
        className="btn btn-secondary w-full md:w-auto"
        onClick={onCheckDelivery}
      >
        Check Delivery Availability
      </button>
    </div>
  );
}

export default ButtonComponent;
