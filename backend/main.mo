import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  type Booking = {
    name : Text;
    phone : Text;
    guests : Nat;
    date : Text;
    time : Text;
    specialRequest : Text;
  };

  module BookingModule {
    public func compareByDate(booking1 : Booking, booking2 : Booking) : Order.Order {
      Text.compare(booking1.date, booking2.date);
    };
  };

  let bookings = List.empty<Booking>();

  public shared func submitBooking(name : Text, phone : Text, guests : Nat, date : Text, time : Text, specialRequest : Text) : async Bool {
    let booking : Booking = {
      name;
      phone;
      guests;
      date;
      time;
      specialRequest;
    };
    bookings.add(booking);
    true;
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };
    bookings.values().toArray().sort(BookingModule.compareByDate);
  };

  public shared ({ caller }) func clearAllBookings() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear bookings");
    };
    bookings.clear();
  };
};
