"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import ProfileDropdown from "@/components/ProfileDropdown";
import {
    MagnifyingGlassIcon,
    BellIcon,
    PhotoIcon,
    PlusIcon,
    XMarkIcon,
    CalendarIcon,
    MapPinIcon,
} from "@heroicons/react/24/outline";

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

interface DeliverySlot {
    startTime: string;
    endTime: string;
}

export default function DeliveryFormPage() {
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    // Sender profile state
    const [shopName, setShopName] = useState<string>("");
    const [shopContact, setShopContact] = useState<string>("");
    const [shopStartHour, setShopStartHour] = useState<number | null>(null);
    const [shopEndHour, setShopEndHour] = useState<number | null>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    // Form state
    const [customerName, setCustomerName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [pincode, setPincode] = useState("");
    const [address, setAddress] = useState("");
    const [area, setArea] = useState("");

    const [category, setCategory] = useState("");
    const [itemName, setItemName] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [isFragile, setIsFragile] = useState(false);
    const [itemImage, setItemImage] = useState<File | null>(null);

    const [senderLat, setSenderLat] = useState("");
    const [senderLng, setSenderLng] = useState("");
    const [locStatus, setLocStatus] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([
        { startTime: "", endTime: "" }
    ]);

    const toTimeString = (hour: number | null | undefined) =>
        hour === null || hour === undefined ? "" : `${String(hour).padStart(2, "0")}:00`;

    // Fetch sender profile on mount
    useEffect(() => {
        const fetchSenderProfile = async () => {
            try {
                setIsLoadingProfile(true);
                const response = await fetch("/api/sender-profile");
                if (response.ok) {
                    const data = await response.json();
                    setShopName(data.organizationName || "");
                    setShopContact(data.phone || data.email || "");
                    setShopStartHour(data.startHour ?? null);
                    setShopEndHour(data.endHour ?? null);

                    const start = toTimeString(data.startHour);
                    const end = toTimeString(data.endHour);
                    if (start || end) {
                        setDeliverySlots([{ startTime: start, endTime: end }]);
                    }
                } else {
                    console.error("Failed to fetch sender profile");
                }
            } catch (error) {
                console.error("Error fetching sender profile:", error);
            } finally {
                setIsLoadingProfile(false);
            }
        };

        fetchSenderProfile();
    }, []);

    const handleAddSlot = () => {
        if (deliverySlots.length < 3) {
            setDeliverySlots([...deliverySlots, { startTime: "", endTime: "" }]);
        }
    };

    const handleRemoveSlot = (index: number) => {
        if (deliverySlots.length > 1) {
            setDeliverySlots(deliverySlots.filter((_, i) => i !== index));
        }
    };

    const handleSlotChange = (index: number, field: keyof DeliverySlot, value: string) => {
        const newSlots = [...deliverySlots];
        newSlots[index][field] = value;
        setDeliverySlots(newSlots);
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setItemImage(e.target.files[0]);
        }
    };

    const fileToBase64 = (file: File) =>
        new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const handleSubmit = async () => {
        if (!customerName || !phone || !category || !itemName || !address || !area || !pincode) {
            alert("Please fill in all required fields");
            return;
        }

        setSubmitError("");
        setIsSubmitting(true);

        try {
            const imageBase64 = itemImage ? await fileToBase64(itemImage) : null;

            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customerName,
                    phone,
                    email,
                    pincode,
                    address,
                    area,
                    category,
                    itemName,
                    description,
                    quantity,
                    isFragile,
                    senderLat,
                    senderLng,
                    imageBase64,
                    deliverySlots,
                }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.error || "Failed to create order");
            }

            alert("Delivery request stored successfully!");
            router.push("/sender_page/dashboard");
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Failed to submit delivery request";
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setLocStatus("Geolocation not supported in this browser.");
            return;
        }
        setLocStatus("Requesting location...");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                setSenderLat(latitude.toFixed(6));
                setSenderLng(longitude.toFixed(6));
                setLocStatus("Location captured.");
            },
            (err) => {
                setLocStatus(`Location denied: ${err.message}`);
            },
            { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
    };

    const handleCancel = () => {
        router.push("/sender_page/dashboard");
    };

    return (
        <div className="flex-1 overflow-y-auto bg-gray-50 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <style jsx>{`
                div::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
            <div className="p-6 min-h-full">
                {/* Header */}
                <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 relative z-10">
                    <h1 className="text-xl font-bold text-gray-900">Create New Delivery</h1>
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 w-48"
                            />
                            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                        <button 
                            className="p-2 hover:bg-gray-100 rounded-lg transition relative"
                            onClick={() => router.push('/sender_page/notification')}
                        >
                            <BellIcon className="h-5 w-5 text-gray-600" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">1</span>
                        </button>
                        <div 
                            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition relative"
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                        >
                            <span className="text-sm font-medium text-gray-700">Rahul Sharma</span>
                            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
                                RS
                            </div>
                            <ProfileDropdown isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
                        </div>
                    </div>
                </header>

                {/* Form Layout - 2 columns */}
                <div className="grid grid-cols-2 gap-5">
                    {/* Left Column */}
                    <div className="space-y-5">
                        {/* Sender Information */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Sender Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1.5">Shop Name</label>
                                    <input
                                        type="text"
                                        value={isLoadingProfile ? "Loading..." : shopName || "Unavailable"}
                                        disabled
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1.5">Contact</label>
                                    <input
                                        type="text"
                                        value={isLoadingProfile ? "Loading..." : shopContact || "Unavailable"}
                                        disabled
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                        <MapPinIcon className="w-4 h-4 text-orange-500" />
                                        <span>Pickup Location (auto-detect)</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleGetLocation}
                                        className="px-3 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg"
                                    >
                                        Get My Location
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                                        <input
                                            type="text"
                                            value={senderLat}
                                            readOnly
                                            placeholder="--"
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                                        <input
                                            type="text"
                                            value={senderLng}
                                            readOnly
                                            placeholder="--"
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700"
                                        />
                                    </div>
                                </div>
                                {locStatus && (
                                    <p className="text-xs text-gray-600">{locStatus}</p>
                                )}
                            </div>
                        </div>

                        {/* Customer Information */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Customer Information</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">
                                            Customer Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter customer name"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">
                                            Phone <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            placeholder="Enter phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">Email</label>
                                        <input
                                            type="email"
                                            placeholder="Enter email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">Pincode</label>
                                        <input
                                            type="text"
                                            placeholder="Enter pincode"
                                            value={pincode}
                                            onChange={(e) => setPincode(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5">Address</label>
                                    <textarea
                                        placeholder="Enter full address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    />
                                </div>
                                <div className="w-1/2">
                                    <label className="block text-sm text-gray-600 mb-1.5">Area</label>
                                    <input
                                        type="text"
                                        placeholder="Enter area/locality"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-5">
                        {/* Commodity Details */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Commodity Details</h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                                        >
                                            <option value="">Select category</option>
                                            {categories.map((cat) => (
                                                <option key={cat} value={cat}>{cat}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-1.5">
                                            Item Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter item name"
                                            value={itemName}
                                            onChange={(e) => setItemName(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1.5">Description</label>
                                    <textarea
                                        placeholder="Enter item description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={2}
                                        className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                    />
                                </div>
                                <div className="flex items-end gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm text-gray-600 mb-1.5">Quantity / Weight</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., 2 units, 1.5 kg"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer pb-2.5">
                                        <input
                                            type="checkbox"
                                            checked={isFragile}
                                            onChange={(e) => setIsFragile(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                        />
                                        <span className="text-sm text-gray-600">Mark as Fragile</span>
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm text-orange-500 mb-1.5">Item Image</label>
                                    <label className="w-28 h-24 border-2 border-dashed border-orange-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 transition bg-white">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        {itemImage ? (
                                            <div className="text-center">
                                                <span className="text-xs text-gray-600 truncate max-w-[100px] block">{itemImage.name}</span>
                                            </div>
                                        ) : (
                                            <>
                                                <PhotoIcon className="w-8 h-8 text-gray-400" />
                                                <span className="text-xs text-orange-500 mt-1">Upload</span>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Shop Working Hours */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Shop Working Hours</h2>
                            {isLoadingProfile ? (
                                <p className="text-sm text-gray-500">Loading shop hours...</p>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-2">Shop Opening Time</label>
                                            <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-semibold">
                                                {shopStartHour !== null ? `${String(shopStartHour).padStart(2, '0')}:00` : "--:--"}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-2">Shop Closing Time</label>
                                            <div className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 font-semibold">
                                                {shopEndHour !== null ? `${String(shopEndHour).padStart(2, '0')}:00` : "--:--"}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Your shop operates within these hours</p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-2">
                            {submitError && (
                                <p className="text-sm text-red-500 pr-3">{submitError}</p>
                            )}
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-5 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-5 py-2.5 bg-orange-500 rounded-lg text-sm font-medium text-white hover:bg-orange-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? "Saving..." : "Send to Customer"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}