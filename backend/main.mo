import List "mo:core/List";
import Text "mo:core/Text";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
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

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Booking = {
    name : Text;
    phone : Text;
    guests : Nat;
    date : Text;
    time : Text;
    specialRequest : Text;
    deposit : Nat;
    screenshotFileName : ?Text;
  };

  module BookingModule {
    public func compareByDate(booking1 : Booking, booking2 : Booking) : Order.Order {
      Text.compare(booking1.date, booking2.date);
    };
  };

  // Store bookings in a persistent list that lives in actor state
  let bookings = List.empty<Booking>();

  // Anyone (including unauthenticated/anonymous guests) can submit a booking,
  // since customers do not need to be logged in to make a table reservation.
  public shared func submitBooking(
    name : Text,
    phone : Text,
    guests : Nat,
    date : Text,
    time : Text,
    specialRequest : Text,
    screenshotFileName : ?Text,
  ) : async Bool {
    let deposit = guests * 100;
    let booking : Booking = {
      name;
      phone;
      guests;
      date;
      time;
      specialRequest;
      deposit;
      screenshotFileName;
    };
    bookings.add(booking);
    true;
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can get all bookings");
    };
    bookings.values().toArray().sort(BookingModule.compareByDate);
  };

  public shared ({ caller }) func clearAllBookings() : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can clear bookings");
    };
    bookings.clear();
  };
};
