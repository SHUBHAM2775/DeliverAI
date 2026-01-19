"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileDropdown from "@/components/ProfileDropdown";
import {
    MagnifyingGlassIcon,
    BellIcon,
    PhotoIcon,
    PlusIcon,
    XMarkIcon,
    CalendarIcon,
} from "@heroicons/react/24/outline";

// Time slots options
const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM",
    "1:00 PM - 2:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM",
    "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM",
];

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
    date: string;
    timeSlot: string;
}

export default function DeliveryFormPage() {
    const router = useRouter();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

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

    const [deliverySlots, setDeliverySlots] = useState<DeliverySlot[]>([
        { date: "", timeSlot: "" }
    ]);

    const handleAddSlot = () => {
        if (deliverySlots.length < 3) {
            setDeliverySlots([...deliverySlots, { date: "", timeSlot: "" }]);
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

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setItemImage(e.target.files[0]);
        }
    };

    const handleSubmit = () => {
        // Validation
        if (!customerName || !phone || !category || !itemName) {
            alert("Please fill in all required fields");
            return;
        }
        // Submit logic
        alert("Delivery request sent to customer!");
        router.push("/sender_page/dashboard");
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
                                        value="TechMart Electronics"
                                        disabled
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1.5">Contact</label>
                                    <input
                                        type="text"
                                        value="+91 98765 43210"
                                        disabled
                                        className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500"
                                    />
                                </div>
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

                        {/* Proposed Delivery Slots */}
                        <div className="bg-white rounded-xl border border-gray-100 p-5">
                            <h2 className="text-base font-bold text-gray-900 mb-4">Proposed Delivery Slots</h2>
                            <div className="space-y-3">
                                {deliverySlots.map((slot, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div>
                                            <label className="block text-sm text-gray-600 mb-1.5">Date</label>
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    value={slot.date}
                                                    onChange={(e) => handleSlotChange(index, 'date', e.target.value)}
                                                    className="w-40 px-3 py-2.5 bg-gray-800 text-white border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm text-gray-600 mb-1.5">Time Slot</label>
                                            <select
                                                value={slot.timeSlot}
                                                onChange={(e) => handleSlotChange(index, 'timeSlot', e.target.value)}
                                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                                            >
                                                <option value="">Select time</option>
                                                {timeSlots.map((time) => (
                                                    <option key={time} value={time}>{time}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {index === deliverySlots.length - 1 && deliverySlots.length < 3 ? (
                                            <button
                                                type="button"
                                                onClick={handleAddSlot}
                                                className="mt-6 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition"
                                            >
                                                <PlusIcon className="w-5 h-5 text-gray-600" />
                                            </button>
                                        ) : deliverySlots.length > 1 ? (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSlot(index)}
                                                className="mt-6 w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition"
                                            >
                                                <XMarkIcon className="w-5 h-5 text-red-500" />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={handleAddSlot}
                                                className="mt-6 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition"
                                            >
                                                <PlusIcon className="w-5 h-5 text-gray-600" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <p className="text-xs text-orange-400 mt-2">Add 1-3 delivery slots for the customer to choose from</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-2">
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
                                className="px-5 py-2.5 bg-orange-500 rounded-lg text-sm font-medium text-white hover:bg-orange-600 transition"
                            >
                                Send to Customer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}