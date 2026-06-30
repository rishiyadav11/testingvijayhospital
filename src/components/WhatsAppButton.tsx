"use client";

import React from "react";

export function WhatsAppButton() {
  const phoneNumber = "919306710615"; // +91 93067 10615
  const message = encodeURIComponent(
    "Hello, I would like to inquire about your hospital services."
  );

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-32 md:bottom-8 right-8 z-40 flex items-center justify-center"
      title="Chat on WhatsApp"
    >
      <div className="relative group">
        {/* Pulsing background */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse opacity-75" />
        
        {/* Button */}
        <div className="relative w-16 h-16 bg-green-500 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center hover:bg-green-600">
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.947 1.215c-1.566.755-2.821 1.77-3.7 3.082-.876 1.307-1.286 2.716-.88 4.753.405 2.069 1.362 3.461 3.116 4.413 1.755.952 3.268 1.194 4.532 1.422 1.264.228 2.806.158 4.833-1.052 2.027-1.21 3.231-2.805 3.539-4.782.308-1.977.084-3.505-1.159-4.664-1.243-1.159-2.948-1.573-4.734-1.387z" />
          </svg>
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
          Chat on WhatsApp
        </div>
      </div>
    </a>
  );
}
