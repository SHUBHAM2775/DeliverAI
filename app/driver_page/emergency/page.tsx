'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExclamationTriangleIcon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface OrderItem {
  id: string;
  commodity: string;
  customer: string;
  status: string;
  area: string;
  pincode: string;
}

export default function DriverEmergencyPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders?all=true');
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders', error);
      }
    };
    fetchOrders();
  }, []);

  const handleSend = async () => {
    if (!selectedOrderId) {
      setErrorMessage('Please select an order');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please describe the disruption');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/driver-emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selectedOrderId, disruption: description }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Failed to send alert');
      }
      setSuccessMessage('Alert sent to sender and customer');
      setShowSuccess(true);
      setDescription('');
      setSelectedOrderId('');
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send alert';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>{`
        div::-webkit-scrollbar { display: none; }
        @keyframes siren-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes siren-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .siren-icon { animation: siren-spin 2s linear infinite; }
        .siren-glow { animation: siren-pulse 1s ease-in-out infinite; }
      `}</style>

      <div className="p-8 min-h-full">
        <header className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2.5 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="w-7 h-7 text-red-600" />
            </div>
            Driver Emergency SOS
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 w-48"
              />
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition relative"
              onClick={() => router.push('/driver_page/notifications')}
            >
              <BellIcon className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">1</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 space-y-6">
            <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-300 p-8">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="siren-glow w-20 h-20 bg-red-500 rounded-full absolute inset-0 opacity-30"></div>
                  <div className="siren-icon relative w-20 h-20 flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-red-900 mb-2">On-Ground Disruption</h2>
                  <p className="text-red-800">Report a mishap you witnessed (accident, blockage, weather, etc.). Sender will be alerted and customer notified to reschedule.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Select Order</h3>
              {orders.length === 0 ? (
                <p className="text-gray-500">No orders found</p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {orders.map((order) => (
                    <button
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedOrderId === order.id ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-white hover:border-red-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{order.commodity}</p>
                          <p className="text-sm text-gray-600">📦 {order.customer}</p>
                          <p className="text-xs text-gray-500 mt-1">{order.area} • {order.pincode}</p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${
                          order.status === 'CREATED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Describe the Incident</h3>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Vehicle accident, road blocked, severe weather, safety issue, etc."
                rows={6}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">This description goes to the sender (notification) and to the customer (email) with a reschedule link.</p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 rounded-xl border border-red-200 p-4">
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

            <div className="flex justify-end gap-3">
              <button
                onClick={() => router.push('/driver_page')}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                disabled={isSubmitting}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
                {isSubmitting ? 'Sending Alert...' : 'Send Emergency Alert'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                What Happens
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold shrink-0">1</span>
                  <span>Sender gets an alert in Notifications</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold shrink-0">2</span>
                  <span>Customer gets email with your disruption note</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold shrink-0">3</span>
                  <span>Email includes reschedule link</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold shrink-0">4</span>
                  <span>History stored for reference</span>
                </li>
              </ul>
            </div>

            {showSuccess && (
              <div className="bg-green-50 rounded-xl border border-green-200 p-6 animate-pulse">
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">✓</span>
                  </div>
                  <div>
                    <p className="font-bold text-green-900 mb-2">Success!</p>
                    <p className="text-sm text-green-700 whitespace-pre-line">{successMessage}</p>
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
