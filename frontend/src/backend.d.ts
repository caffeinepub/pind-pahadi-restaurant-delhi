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
    date: string;
    name: string;
    time: string;
    specialRequest: string;
    phone: string;
    guests: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearAllBookings(): Promise<void>;
    getAllBookings(): Promise<Array<Booking>>;
    getCallerUserRole(): Promise<UserRole>;
    isCallerAdmin(): Promise<boolean>;
    submitBooking(name: string, phone: string, guests: bigint, date: string, time: string, specialRequest: string): Promise<boolean>;
}
