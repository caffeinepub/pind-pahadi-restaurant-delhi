import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Booking {
    status: BookingStatus;
    screenshotFileName?: string;
    date: string;
    name: string;
    time: string;
    deposit: bigint;
    specialRequest: string;
    phone: string;
    guests: bigint;
}
export interface UserProfile {
    name: string;
}
export enum BookingStatus {
    pending = "pending",
    rejected = "rejected",
    confirmed = "confirmed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllBookings(): Promise<void>;
    confirmBooking(id: bigint): Promise<void>;
    deleteBooking(id: bigint): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getBookingsByStatus(status: BookingStatus): Promise<Array<Booking>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    rejectBooking(id: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitBooking(name: string, phone: string, guests: bigint, date: string, time: string, specialRequest: string, screenshotFileName: string | null): Promise<boolean>;
    submitBookingInternal(name: string, phone: string, guests: bigint, date: string, time: string, specialRequest: string, screenshotFileName: string | null): Promise<boolean>;
}
