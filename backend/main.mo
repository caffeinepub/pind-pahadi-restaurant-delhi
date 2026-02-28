import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  public type UserProfile = {
    name : Text;
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not (AccessControl.isAdmin(accessControlState, caller))) {
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

  public type PaymentDetails = {
    advanceAmount : Nat;
    paymentMethod : Text;
    upiDetails : Text;
    bankDetails : Text;
  };

  public type Booking = {
    name : Text;
    phone : Text;
    guests : Nat;
    date : Text;
    time : Text;
    specialRequest : Text;
    status : BookingStatus;
    paymentDetails : PaymentDetails;
    screenshotFileName : ?Text;
  };

  public type BookingStatus = {
    #pending;
    #confirmed;
    #rejected;
  };

  let bookings = Map.empty<Nat, Booking>();
  var lastId = 0;

  module BookingModule {
    public func compareByDate(booking1 : Booking, booking2 : Booking) : Order.Order {
      Text.compare(booking1.date, booking2.date);
    };
  };

  public query ({ caller }) func getAllBookings() : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get all bookings");
    };
    bookings.values().toArray().sort(BookingModule.compareByDate);
  };

  public query ({ caller }) func getBookingsByStatus(status : BookingStatus) : async [Booking] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can get bookings");
    };
    bookings.values().toArray().filter(func(booking) { booking.status == status }).sort(BookingModule.compareByDate);
  };

  public shared ({ caller }) func clearAllBookings() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear bookings");
    };
    bookings.clear();
  };

  public shared ({ caller }) func confirmBooking(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can confirm bookings");
    };

    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        bookings.add(
          id,
          { booking with status = #confirmed }
        );
      };
    };
  };

  public shared ({ caller }) func rejectBooking(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can reject bookings");
    };
    switch (bookings.get(id)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        bookings.add(
          id,
          { booking with status = #rejected }
        );
      };
    };
  };

  public shared ({ caller }) func deleteBooking(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete bookings");
    };
    if (not bookings.containsKey(id)) {
      Runtime.trap("Booking not found");
    };
    bookings.remove(id);
  };

  public shared ({ caller }) func submitBooking(
    name : Text,
    phone : Text,
    guests : Nat,
    date : Text,
    time : Text,
    specialRequest : Text,
    screenshotFileName : ?Text,
    paymentDetails : PaymentDetails,
  ) : async Bool {
    if (guests < 1 or guests > 10) {
      Runtime.trap("Invalid number of guests. Must be between 1 and 10.");
    };

    let booking : Booking = {
      name;
      phone;
      guests;
      date;
      time;
      specialRequest;
      status = #pending;
      paymentDetails;
      screenshotFileName;
    };

    bookings.add(lastId, booking);
    lastId += 1;
    true;
  };
};
