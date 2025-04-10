"use client";

import React from "react";
import { CldUploadWidget } from "next-cloudinary";

const UploadImages = ({ text, onSuccess }) => {
  return (
    <div>
      <CldUploadWidget uploadPreset="kyc_project" onSuccess={onSuccess}>
        {({ open }) => {
          const handleClick = () => {
            if (typeof open === "function") {
              open();
            } else {
              console.error("Open function is not available");
            }
          };

          return (
            <button
              className="border-2 border-dashed rounded-lg p-4 cursor-pointer flex w-full items-center justify-center hover:border-blue-500"
              onClick={handleClick}
              type="button"
            >
              {text}
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default UploadImages;
