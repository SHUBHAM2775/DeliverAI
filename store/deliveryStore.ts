'use client';

import { create } from 'zustand';

export interface DeliverySlot {
  id: string;
  time: string;
  successRate: 'high' | 'medium' | 'low';
  label: string;
}

export interface Parcel {
  id: string;
  senderId: string;
  senderName: string;
  receiverName: string;
  receiverPhone: string;
  commodityName: string;
  deliveryAddress: string;
  suggestedSlots: DeliverySlot[];
  selectedSlot?: DeliverySlot;
  status: 'created' | 'slots_suggested' | 'link_sent' | 'slot_selected' | 'confirmed';
  createdAt: Date;
  
  // ML Input Fields
  storeId: string;
  pickupAvailabilityWindow: string;
  sellerAllowedTimeRange: string;
  parcelCategory: string;
  deliveryLatitude: number;
  deliveryLongitude: number;
  storeLatitude: number;
  storeLongitude: number;
}

export interface ReceiverLink {
  code: string;
  parcelId: string;
  generatedAt: Date;
}

export interface Notification {
  id: string;
  type: 'sender' | 'admin' | 'receiver';
  message: string;
  parcelId: string;
  timestamp: Date;
  read: boolean;
}

interface DeliveryStore {
  parcels: Parcel[];
  receiverLinks: ReceiverLink[];
  notifications: Notification[];
  
  // Parcel actions
  createParcel: (parcel: Omit<Parcel, 'id' | 'createdAt' | 'status' | 'suggestedSlots'>) => string;
  updateParcelSlots: (parcelId: string, slots: DeliverySlot[]) => void;
  updateParcelStatus: (parcelId: string, status: Parcel['status']) => void;
  selectSlot: (parcelId: string, slot: DeliverySlot) => void;
  
  // Link actions
  generateReceiverLink: (parcelId: string) => string;
  getParcelByCode: (code: string) => Parcel | undefined;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  getNotificationsByType: (type: 'sender' | 'admin' | 'receiver') => Notification[];
}

const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

export const useDeliveryStore = create<DeliveryStore>((set, get) => ({
  parcels: [],
  receiverLinks: [],
  notifications: [],

  createParcel: (parcelData) => {
    const id = `PRC-${generateId()}`;
    const newParcel: Parcel = {
      ...parcelData,
      id,
      status: 'created',
      suggestedSlots: [],
      createdAt: new Date(),
    };
    
    set((state) => ({
      parcels: [...state.parcels, newParcel],
    }));
    
    // Add notification for sender
    get().addNotification({
      type: 'sender',
      message: `New parcel ${id} created and added to your dashboard`,
      parcelId: id,
    });
    
    return id;
  },

  updateParcelSlots: (parcelId, slots) => {
    set((state) => ({
      parcels: state.parcels.map((p) =>
        p.id === parcelId
          ? { ...p, suggestedSlots: slots, status: 'slots_suggested' as const }
          : p
      ),
    }));
    
    // Add notification for admin
    get().addNotification({
      type: 'admin',
      message: `Sender has suggested delivery slots for parcel ${parcelId}`,
      parcelId,
    });
  },

  updateParcelStatus: (parcelId, status) => {
    set((state) => ({
      parcels: state.parcels.map((p) =>
        p.id === parcelId ? { ...p, status } : p
      ),
    }));
  },

  selectSlot: (parcelId, slot) => {
    set((state) => ({
      parcels: state.parcels.map((p) =>
        p.id === parcelId
          ? { ...p, selectedSlot: slot, status: 'confirmed' as const }
          : p
      ),
    }));
    
    const parcel = get().parcels.find(p => p.id === parcelId);
    
    // Add notifications for sender and admin
    get().addNotification({
      type: 'sender',
      message: `Receiver chose ${slot.label} slot for parcel ${parcelId}`,
      parcelId,
    });
    
    get().addNotification({
      type: 'admin',
      message: `Slot confirmed for parcel ${parcelId}: ${slot.label}`,
      parcelId,
    });
  },

  generateReceiverLink: (parcelId) => {
    const code = generateId();
    const newLink: ReceiverLink = {
      code,
      parcelId,
      generatedAt: new Date(),
    };
    
    set((state) => ({
      receiverLinks: [...state.receiverLinks, newLink],
      parcels: state.parcels.map((p) =>
        p.id === parcelId ? { ...p, status: 'link_sent' as const } : p
      ),
    }));
    
    return code;
  },

  getParcelByCode: (code) => {
    const link = get().receiverLinks.find((l) => l.code === code);
    if (!link) return undefined;
    return get().parcels.find((p) => p.id === link.parcelId);
  },

  addNotification: (notificationData) => {
    const notification: Notification = {
      ...notificationData,
      id: generateId(),
      timestamp: new Date(),
      read: false,
    };
    
    set((state) => ({
      notifications: [...state.notifications, notification],
    }));
  },

  markNotificationAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
    }));
  },

  getNotificationsByType: (type) => {
    return get().notifications.filter((n) => n.type === type);
  },
}));
