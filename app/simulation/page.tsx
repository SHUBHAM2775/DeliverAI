'use client';

import { useState } from 'react';
import { useDeliveryStore } from '@/store/deliveryStore';
import { useRouter } from 'next/navigation';
import { Package, Truck, User, Phone, MapPin, Clock, Store, MapPinned, Sparkles } from 'lucide-react';

export default function SimulationPage() {
  const { createParcel } = useDeliveryStore();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastParcelId, setLastParcelId] = useState('');
  const [lastParcelDetails, setLastParcelDetails] = useState<any>(null);

  const mockSenders = [
    'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 
    'Ethan Hunt', 'Fiona Green', 'George Miller', 'Hannah Lee',
    'Isaac Newton', 'Julia Roberts', 'Kevin Hart', 'Laura Palmer'
  ];
  
  const mockReceivers = [
    'Emma Wilson', 'Frank Miller', 'Grace Lee', 'Henry Davis',
    'Ivy Chen', 'Jack Ryan', 'Kelly White', 'Liam Brown',
    'Maya Singh', 'Noah Taylor', 'Olivia Moore', 'Peter Parker'
  ];
  
  const mockCommodities = ['Toys', 'Books', 'Clothes', 'Food', 'Electronics'];
  
  const mockStreets = [
    'Main Street', 'Oak Avenue', 'Pine Road', 'Elm Street', 'Maple Drive',
    'Cedar Lane', 'Birch Boulevard', 'Willow Way', 'Ash Court', 'Cherry Circle'
  ];
  
  const mockCities = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'Los Angeles', lat: 34.0522, lng: -118.2437 },
    { name: 'Chicago', lat: 41.8781, lng: -87.6298 },
    { name: 'Houston', lat: 29.7604, lng: -95.3698 },
    { name: 'Phoenix', lat: 33.4484, lng: -112.0740 },
    { name: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
  ];

  const generatePhoneNumber = () => {
    const area = Math.floor(Math.random() * 900 + 100);
    const prefix = Math.floor(Math.random() * 900 + 100);
    const line = Math.floor(Math.random() * 9000 + 1000);
    return `+1 (${area}) ${prefix}-${line}`;
  };

  const generateRandomTime = (minHour: number, maxHour: number) => {
    const hour = Math.floor(Math.random() * (maxHour - minHour + 1)) + minHour;
    const minute = Math.random() < 0.5 ? '00' : '30';
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  };

  const generateTimeRange = (startHour: number, endHour: number) => {
    const start = generateRandomTime(startHour, endHour - 2);
    const startNum = parseInt(start.split(':')[0]);
    const end = generateRandomTime(startNum + 1, endHour);
    return `${start} - ${end}`;
  };

  const generateCoordinates = (baseLat: number, baseLng: number) => {
    // Add random variation (±0.05 degrees ~ 5km)
    const latVariation = (Math.random() - 0.5) * 0.1;
    const lngVariation = (Math.random() - 0.5) * 0.1;
    return {
      lat: parseFloat((baseLat + latVariation).toFixed(6)),
      lng: parseFloat((baseLng + lngVariation).toFixed(6))
    };
  };

  const handleCreateParcel = () => {
    const city = mockCities[Math.floor(Math.random() * mockCities.length)];
    const deliveryCoords = generateCoordinates(city.lat, city.lng);
    const storeCoords = generateCoordinates(city.lat, city.lng);
    const commodityName = mockCommodities[Math.floor(Math.random() * mockCommodities.length)];
    
    const pickupStart = Math.floor(Math.random() * 16) + 8; // 8-23
    const pickupEnd = pickupStart + Math.floor(Math.random() * 6) + 3; // +3 to +8 hours
    const pickupWindow = generateTimeRange(pickupStart, Math.min(pickupEnd, 23));
    
    const sellerStart = pickupStart + Math.floor(Math.random() * 2);
    const sellerEnd = Math.min(pickupEnd - 1, sellerStart + Math.floor(Math.random() * 4) + 2);
    const sellerRange = generateTimeRange(sellerStart, sellerEnd);

    const mockParcelData = {
      senderId: `SENDER-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      senderName: mockSenders[Math.floor(Math.random() * mockSenders.length)],
      receiverName: mockReceivers[Math.floor(Math.random() * mockReceivers.length)],
      receiverPhone: generatePhoneNumber(),
      commodityName: commodityName,
      deliveryAddress: `${Math.floor(Math.random() * 9999) + 100} ${mockStreets[Math.floor(Math.random() * mockStreets.length)]}, ${city.name}, ${Math.floor(Math.random() * 90000) + 10000}`,
      
      // ML Input Fields
      storeId: `STR_${Math.floor(Math.random() * 90000) + 10000}`,
      pickupAvailabilityWindow: pickupWindow,
      sellerAllowedTimeRange: sellerRange,
      parcelCategory: commodityName,
      deliveryLatitude: deliveryCoords.lat,
      deliveryLongitude: deliveryCoords.lng,
      storeLatitude: storeCoords.lat,
      storeLongitude: storeCoords.lng,
    };

    const parcelId = createParcel(mockParcelData);
    setLastParcelId(parcelId);
    setLastParcelDetails(mockParcelData);
    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b-4 border-black p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <Truck className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-black">Delivery Simulation</h1>
            <p className="text-gray-600">Generate demo delivery orders with ML data</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-4xl w-full">
          {/* Info Card */}
          <div className="bg-white rounded-2xl shadow-2xl border-4 border-black p-8 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-6 h-6 text-indigo-600" />
              <h2 className="text-2xl font-bold text-black">Simulation Module</h2>
            </div>
            <p className="text-gray-700 mb-6">
              Create mock delivery parcels to test the entire workflow from sender to receiver.
              Each parcel includes randomized data and ML input fields for route optimization.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <User className="w-4 h-4 text-blue-600" />
                <span>Random Sender</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <User className="w-4 h-4 text-green-600" />
                <span>Random Receiver</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Package className="w-4 h-4 text-purple-600" />
                <span>Random Commodity</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Random Location</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Store className="w-4 h-4 text-orange-600" />
                <span>Store ID</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Time Windows</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <MapPinned className="w-4 h-4 text-pink-600" />
                <span>Coordinates</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <Package className="w-4 h-4 text-indigo-600" />
                <span>Category</span>
              </div>
            </div>

            <button
              onClick={handleCreateParcel}
              className="w-full bg-black text-white font-bold py-4 px-6 rounded-xl hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <Package className="w-5 h-5" />
                <span>Create New Parcel</span>
              </div>
            </button>
          </div>

          {/* Success Message */}
          {showSuccess && lastParcelDetails && (
            <div className="bg-green-500 text-white rounded-xl p-6 shadow-xl border-4 border-black animate-bounce mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-green-500" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-lg mb-2">Parcel Created Successfully!</p>
                  <div className="space-y-1 text-sm">
                    <p>📦 Parcel ID: <span className="font-mono font-semibold">{lastParcelId}</span></p>
                    <p>👤 Sender: {lastParcelDetails.senderName}</p>
                    <p>📍 Receiver: {lastParcelDetails.receiverName}</p>
                    <p>📱 Phone: {lastParcelDetails.receiverPhone}</p>
                    <p>🏬 Store: {lastParcelDetails.storeId}</p>
                    <p>⏰ Pickup Window: {lastParcelDetails.pickupAvailabilityWindow}</p>
                    <p>📍 Coordinates: ({lastParcelDetails.deliveryLatitude}, {lastParcelDetails.deliveryLongitude})</p>
                  </div>
                  <p className="mt-3 text-sm font-semibold">✓ Sent to sender dashboard</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="bg-white rounded-2xl shadow-xl border-4 border-black p-6">
            <h3 className="font-bold text-lg mb-4 text-black">Quick Navigation</h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => router.push('/sender_page/dashboard')}
                className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold py-3 px-4 rounded-lg transition-all border-2 border-blue-300"
              >
                Sender
              </button>
              <button
                onClick={() => router.push('/admin_page/overview')}
                className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold py-3 px-4 rounded-lg transition-all border-2 border-purple-300"
              >
                Admin
              </button>
              <button
                onClick={() => router.push('/receiver_page/slot-selection')}
                className="bg-green-100 hover:bg-green-200 text-green-800 font-semibold py-3 px-4 rounded-lg transition-all border-2 border-green-300"
              >
                Receiver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
