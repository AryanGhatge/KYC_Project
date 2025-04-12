"use client";

import React, { useRef, useEffect } from "react";
import { CldUploadWidget } from "next-cloudinary";

const UploadImages = ({ text, onSuccess, inPerson }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      cloudinaryRef.current = window.cloudinary;
      
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: 'kyc_project',
          maxFiles: 1,
          maxFileSize: 5000000,
          // For in-person verification, only allow camera
          sources: inPerson ? ['camera'] : ['local', 'camera'],
          showAdvancedOptions: false,
          cropping: true, // Enable cropping for better photo quality
          multiple: false,
          defaultSource: inPerson ? 'camera' : 'local',
          // Camera settings for in-person verification
          camera: inPerson ? {
            width: 1280,
            height: 720,
            facingMode: "user", // Front camera
          } : undefined,
          styles: {
            palette: {
              window: '#FFFFFF',
              windowBorder: '#90A0B3',
              tabIcon: '#0078FF',
              menuIcons: '#5A616A',
              textDark: '#000000',
              textLight: '#FFFFFF',
              link: '#0078FF',
              action: '#FF620C',
              inactiveTabIcon: '#0E2F5A',
              error: '#F44235',
              inProgress: '#0078FF',
              complete: '#20B832',
              sourceBg: '#E4EBF1'
            }
          }
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            onSuccess(result);
          }
        }
      );
    }
  }, [onSuccess, inPerson]);

  const handleClick = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    } else {
      console.error("Widget not initialized");
    }
  };

  return (
    <div>
      <button
        className={`border-2 border-dashed rounded-lg p-4 cursor-pointer flex w-full items-center justify-center hover:border-blue-500 ${
          inPerson ? 'bg-blue-50' : ''
        }`}
        onClick={handleClick}
        type="button"
      >
        {inPerson ? (
          <div className="flex flex-col items-center">
            <span className="text-blue-600 mb-1">📸</span>
            <span>{text || 'Take Live Photo'}</span>
          </div>
        ) : (
          text || 'Upload Image'
        )}
      </button>
    </div>
  );
};

export default UploadImages;