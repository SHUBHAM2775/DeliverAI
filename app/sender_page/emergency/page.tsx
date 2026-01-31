'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import SenderHeader from '@/components/SenderHeader';

interface Order {
  id: string;
  commodity: string;
  customer: string;
  status: string;
  area: string;
  pincode: string;
}

export default function EmergencyPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const isReadyToSend = selectedOrderIds.length > 0 && description.trim().length > 0;

  // Auto-clear error when form is ready
  useEffect(() => {
    if (isReadyToSend && errorMessage) {
      setErrorMessage('');
    }
  }, [isReadyToSend, errorMessage]);

  // Fetch active orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleSendEmergencyAlert = async () => {
    // Final validation before send
    if (selectedOrderIds.length === 0) {
      setErrorMessage('Please select at least one order');
      return;
    }

    if (!description.trim()) {
      setErrorMessage('Please describe the disruption');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Send alert for each selected order
      const responses = await Promise.all(
        selectedOrderIds.map((orderId) =>
          fetch('/api/emergency-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderId,
              disruption: description,
            }),
          }).then((r) => r.json().then((data) => ({ ...data, status: r.status })))
        )
      );

      // Count successful emails
      const mailsSent = responses.filter((r) => r.mailSent).length;
      const totalOrders = selectedOrderIds.length;
      const skipped = totalOrders - mailsSent;

      // Show success message
      let message = `✓ Emergency alert processed!\n📧 `;
      if (mailsSent > 0) {
        message += `${mailsSent} order${mailsSent !== 1 ? 's' : ''} notified`;
        if (skipped > 0) {
          message += ` (${skipped} order${skipped !== 1 ? 's' : ''} skipped)`;
        }
      } else {
        message += `All orders processed`;
      }

      setSuccessMessage(message);
      setShowSuccess(true);
      setDescription('');
      setSelectedOrderIds([]);

      setTimeout(() => {
        setShowSuccess(false);
        router.push('/sender_page/dashboard');
      }, 3000);
    } catch (error) {
      setErrorMessage('Something went wrong while processing your request. Please try again.');
      console.error('Emergency alert error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <style>{`
        div::-webkit-scrollbar {
          display: none;
        }
        @keyframes siren-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes siren-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .siren-icon {
          animation: siren-spin 2s linear infinite;
        }
        .siren-glow {
          animation: siren-pulse 1s ease-in-out infinite;
        }
      `}</style>

      <div className="p-8 min-h-full">
        <SenderHeader title="Emergency SOS" subtitle="Report urgent delivery issues" />

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Alert Section */}
          <div className="col-span-2 space-y-6">
            {/* Emergency Alert Box */}
            <div className="bg-linear-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-300 p-8">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <div className="siren-glow w-20 h-20 bg-red-500 rounded-full absolute inset-0 opacity-30"></div>
                  <div className="siren-icon relative w-20 h-20 flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-12 h-12 text-red-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-red-900 mb-2">Delivery Disruption Alert</h2>
                  <p className="text-red-800">
                    Report an emergency or disruption that is preventing delivery. The customer will be notified immediately and given a chance to reschedule.
                  </p>
                </div>
              </div>
            </div>

            {/* Order Selection */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-gray-900">Select Order</h3>
                <span className="text-xs text-gray-500">Order ID and disruption description are required</span>
              </div>
              {orders.length === 0 ? (
                <p className="text-gray-500">No active orders found</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-700">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-red-600 border-gray-300 rounded"
                        checked={orders.length > 0 && selectedOrderIds.length === orders.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedOrderIds(orders.map((o) => o.id));
                          } else {
                            setSelectedOrderIds([]);
                          }
                        }}
                      />
                      <span className="font-medium">Select all</span>
                    </label>
                    <span className="text-xs text-gray-500">{selectedOrderIds.length} selected</span>
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {orders.map((order) => {
                      const checked = selectedOrderIds.includes(order.id);
                      return (
                        <label
                          key={order.id}
                          className={`w-full p-4 rounded-lg border-2 transition block cursor-pointer ${checked
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-white hover:border-red-300'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                className="mt-1 h-4 w-4 text-red-600 border-gray-300 rounded"
                                checked={checked}
                                onChange={(e) => {
                                  setErrorMessage('');
                                  if (e.target.checked) {
                                    setSelectedOrderIds((prev) => [...new Set([...prev, order.id])]);
                                  } else {
                                    setSelectedOrderIds((prev) => prev.filter((id) => id !== order.id));
                                  }
                                }}
                              />
                              <div>
                                <p className="font-semibold text-gray-900">{order.commodity}</p>
                                <p className="text-sm text-gray-600">📦 {order.customer}</p>
                                <p className="text-xs text-gray-500 mt-1">{order.area} • {order.pincode}</p>
                              </div>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${order.status === 'CREATED' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                              }`}>
                              {order.status}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Disruption Description */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Describe the Disruption</h3>
              <textarea
                value={description}
                onChange={(e) => {
                  setErrorMessage('');
                  setDescription(e.target.value);
                }}
                placeholder="e.g., Warehouse fire, Vehicle accident, Weather emergency, Stock shortage, etc."
                rows={6}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                This message will be included in the alert email sent to the customer.
              </p>
            </div>

            {/* Error Message */}
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

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => router.push('/sender_page/dashboard')}
                className="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSendEmergencyAlert}
                disabled={isSubmitting || !isReadyToSend}
                title={!isReadyToSend ? 'Please select an order and describe the disruption' : ''}
                className={`px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition ${isReadyToSend
                    ? 'bg-red-600 text-white hover:bg-red-700 cursor-pointer'
                    : 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-70'
                  }`}
              >
                <ExclamationTriangleIcon className="w-5 h-5" />
                {isSubmitting ? 'Sending Alert...' : 'Send Emergency Alert'}
              </button>
            </div>
          </div>

          {/* Right Column - Info Card */}
          <div className="space-y-6">
            {/* Info Card */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
                What Happens Next
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold shrink-0">1</span>
                  <span>Customer receives emergency notification email</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold shrink-0">2</span>
                  <span>Email includes your disruption description</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold shrink-0">3</span>
                  <span>Customer can click link to reschedule delivery slots</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-600 font-bold shrink-0">4</span>
                  <span>You can monitor updates in the dashboard</span>
                </li>
              </ul>
            </div>

            {/* Success Message */}
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
