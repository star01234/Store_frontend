// src/components/Header.jsx
import React from "react";

function HeaderComponent() {
  return (
    <div className="text-center mb-4">
      <h1 className="text-4xl font-bold">
        <span className="text-primary">STORE DELIVERY</span>
        <span className="text-red-500"> ZONE CHECKER</span>
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        ตรวจสอบพื้นที่การจัดส่งของร้านค้า
      </p>
    </div>
  );
}

export default HeaderComponent;
