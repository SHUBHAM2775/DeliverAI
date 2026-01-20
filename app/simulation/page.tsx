'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Truck, MapPin, Clock, Store, Mail, Sparkles, RefreshCw } from 'lucide-react';

export default function SimulationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Editable Input Fields
  const [receiverEmail, setReceiverEmail] = useState('');
  const [pickupWindow, setPickupWindow] = useState('08:00 - 18:00');
  const [sellerTimeRange, setSellerTimeRange] = useState('09:00 - 17:00');
  const [parcelCategory, setParcelCategory] = useState('Electronics');
  const [deliveryLatitude, setDeliveryLatitude] = useState('40.7128');
  const [deliveryLongitude, setDeliveryLongitude] = useState('-74.0060');
  const [storeLatitude, setStoreLatitude] = useState('40.7128');
  const [storeLongitude, setStoreLongitude] = useState('-74.0060');

  const categories = [
    "Electronics",
    "Documents",
    "Food",
    "Clothes",
    "Medicine",
    "Furniture",
    "Books",
    "Other",
  ];

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
  
  const mockAreas = ['Manhattan', 'Brooklyn', 'Queens', 'Bronx', 'Downtown', 'Midtown', 'Uptown', 'Financial District'];
  const mockStreets = [
    '5th Avenue', 'Broadway', 'Park Avenue', 'Madison Avenue', '42nd Street',
    'Times Square', 'Wall Street', 'Houston Street', 'Spring Street', 'Canal Street'
  ];

  const generatePhoneNumber = () => {
    const area = Math.floor(Math.random() * 900 + 100);
    const prefix = Math.floor(Math.random() * 900 + 100);
    const line = Math.floor(Math.random() * 9000 + 1000);
    return `+1 (${area}) ${prefix}-${line}`;
  };

  const generateEmail = (name: string) => {
    const domain = ['gmail.com', 'yahoo.com', 'outlook.com', 'example.com'][Math.floor(Math.random() * 4)];
    return `${name.toLowerCase().replace(' ', '.')}${Math.floor(Math.random() * 1000)}@${domain}`;
  };

  const generateCommodityName = (category: string) => {
    const commodities: Record<string, string[]> = {
      'Electronics': ['Laptop', 'Phone', 'Tablet', 'Charger', 'Headphones'],
      'Documents': ['Contract', 'Report', 'Certificate', 'Invoice', 'Legal Papers'],
      'Food': ['Pizza Box', 'Cake', 'Groceries', 'Frozen Items', 'Bakery Items'],
      'Clothes': ['T-Shirt', 'Jeans', 'Dress', 'Jacket', 'Shoes'],
      'Medicine': ['Prescription Bottle', 'Vitamins', 'Medical Supplies', 'Syrup', 'Tablets'],
      'Furniture': ['Chair', 'Table', 'Shelf', 'Lamp', 'Bookcase'],
      'Books': ['Novel', 'Textbook', 'Anthology', 'Comic', 'Magazine'],
      'Other': ['Gift Box', 'Package', 'Parcel', 'Container', 'Item']
    };
    const list = commodities[category] || commodities['Other'];
    return list[Math.floor(Math.random() * list.length)];
  };

  const generateAddress = (area: string) => {
    const streetNum = Math.floor(Math.random() * 9999) + 100;
    const street = mockStreets[Math.floor(Math.random() * mockStreets.length)];
    const zip = Math.floor(Math.random() * 90000) + 10000;
    return `${streetNum} ${street}, ${area}, NY ${zip}`;
  };

  const handleRandomizeInputs = async () => {
    try {
      setErrorMessage('');
      // Fetch a random order from the database
      const response = await fetch('/api/orders?all=true');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      const orders = data.orders || [];
      
      if (orders.length === 0) {
        setErrorMessage('No orders found in database');
        return;
      }
      
      // Pick a random order
      const randomOrder = orders[Math.floor(Math.random() * orders.length)];
      
      // Populate ALL fields from the random order
      setParcelCategory(randomOrder.category || 'Electronics');
      setReceiverEmail(randomOrder.customerEmail || generateEmail(randomOrder.customer || 'receiver'));
      
      // Set coordinates from geoLocation if available
      if (randomOrder.pickupLat && randomOrder.pickupLng) {
        setDeliveryLatitude(randomOrder.pickupLat.toString());
        setDeliveryLongitude(randomOrder.pickupLng.toString());
        // Use same coordinates for store location as well
        setStoreLatitude(randomOrder.pickupLat.toString());
        setStoreLongitude(randomOrder.pickupLng.toString());
      }
      
      // Parse working hours if available
      if (randomOrder.workingHours && randomOrder.workingHours !== 'N/A') {
        const [start, end] = randomOrder.workingHours.split(' - ');
        setPickupWindow(randomOrder.workingHours);
        if (start && end) {
          const startHour = parseInt(start.split(':')[0]);
          const endHour = parseInt(end.split(':')[0]);
          const sellerStart = Math.min(startHour + 1, endHour - 2);
          const sellerEnd = Math.max(sellerStart + 2, endHour - 1);
          setSellerTimeRange(`${String(sellerStart).padStart(2, '0')}:00 - ${String(sellerEnd).padStart(2, '0')}:00`);
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch random order');
    }
  };

  const handleSubmit = async () => {
    if (!receiverEmail || !pickupWindow || !sellerTimeRange || !parcelCategory || !deliveryLatitude || !deliveryLongitude) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // Generate realistic data
      const senderName = mockSenders[Math.floor(Math.random() * mockSenders.length)];
      const receiverName = mockReceivers[Math.floor(Math.random() * mockReceivers.length)];
      const receiverPhone = generatePhoneNumber();
      const area = mockAreas[Math.floor(Math.random() * mockAreas.length)];
      const address = generateAddress(area);
      const pincode = Math.floor(Math.random() * 90000) + 10000;
      const commodityName = generateCommodityName(parcelCategory);
      
      // Create order payload matching the delivery-form structure exactly
      const orderData = {
        customerName: receiverName,
        phone: receiverPhone,
        email: receiverEmail,
        pincode: pincode.toString(),
        address,
        area,
        category: parcelCategory,
        itemName: commodityName,
        description: `Simulated ${parcelCategory.toLowerCase()} delivery`,
        quantity: `${Math.floor(Math.random() * 5) + 1} unit(s)`,
        isFragile: Math.random() > 0.7,
        pickupLat: parseFloat(deliveryLatitude),
        pickupLng: parseFloat(deliveryLongitude),
        imageBase64: null,
        deliverySlots: [
          {
            startTime: pickupWindow.split(' - ')[0],
            endTime: pickupWindow.split(' - ')[1],
          },
        ],
      };

      // Call the same /api/orders endpoint used by delivery-form
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to create simulation order');
      }

      setSuccessMessage(
        `✓ Simulation order created!\n📦 Parcel ID: ${data.orderId}\n📧 Link sent to: ${receiverEmail}`
      );
      setShowSuccess(true);

      // Reset form with new random values
      handleRandomizeInputs();

      setTimeout(() => {
        setShowSuccess(false);
      }, 4000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to create simulation order';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't auto-load on mount - user clicks button to load random order

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50">
      <div className="p-8 min-h-full">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-indigo-600" />
              Delivery Simulation
            </h1>
            <p className="text-sm text-gray-500 mt-1">Auto-generate realistic delivery orders to test the system</p>
          </div>
          <button
            onClick={() => router.push('/admin_page/overview')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          >
            View Admin Dashboard
          </button>
        </header>

        {/* Main Form */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Input Fields */}
          <div className="col-span-2 space-y-6">
            {/* Receiver Configuration */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-orange-500" />
                Receiver Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Receiver Email <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      value={receiverEmail}
                      onChange={(e) => setReceiverEmail(e.target.value)}
                      placeholder="receiver@example.com"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Parcel Category <span className="text-red-500">*</span></label>
                    <select
                      value={parcelCategory}
                      onChange={(e) => setParcelCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Windows */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Time Windows
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Pickup Availability Window <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={pickupWindow}
                    onChange={(e) => setPickupWindow(e.target.value)}
                    placeholder="e.g., 08:00 - 18:00"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: HH:MM - HH:MM</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Seller Allowed Time Range <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    value={sellerTimeRange}
                    onChange={(e) => setSellerTimeRange(e.target.value)}
                    placeholder="e.g., 09:00 - 17:00"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Format: HH:MM - HH:MM</p>
                </div>
              </div>
            </div>

            {/* Location Coordinates */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-500" />
                Location Coordinates
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Location</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Latitude <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        step="0.0001"
                        value={deliveryLatitude}
                        onChange={(e) => setDeliveryLatitude(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Longitude <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        step="0.0001"
                        value={deliveryLongitude}
                        onChange={(e) => setDeliveryLongitude(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Store Location (Optional)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Store Latitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={storeLatitude}
                        onChange={(e) => setStoreLatitude(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Store Longitude</label>
                      <input
                        type="number"
                        step="0.0001"
                        value={storeLongitude}
                        onChange={(e) => setStoreLongitude(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Package className="w-4 h-4" />
                {isSubmitting ? 'Creating...' : 'Create Parcel'}
              </button>
            </div>
          </div>

          {/* Right Column - Info & Messages */}
          <div className="space-y-6">
            {/* Randomize Button */}
            <button
              onClick={handleRandomizeInputs}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 transition shadow-md"
            >
              <RefreshCw className="w-5 h-5" />
              Load Random Order
            </button>

            {/* Info Card */}
            <div className="bg-indigo-50 rounded-xl border border-indigo-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                How It Works
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">1</span>
                  <span>Load random existing order</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">2</span>
                  <span>Edit inputs as needed</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">3</span>
                  <span>Creates new order in system</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">4</span>
                  <span>Sends link to receiver</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-indigo-600 font-bold">5</span>
                  <span>Receiver can select slots</span>
                </li>
              </ul>
            </div>

            {/* Success Message */}
            {showSuccess && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-6 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-green-900 mb-2">Success!</p>
                    <p className="text-sm text-green-700 whitespace-pre-line">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">!</span>
                  </div>
                  <div>
                    <p className="font-bold text-red-900 mb-1">Error</p>
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
