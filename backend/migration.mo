import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {
  type OldBooking = {
    name : Text;
    phone : Text;
    guests : Nat;
    date : Text;
    time : Text;
    specialRequest : Text;
    deposit : Nat;
    screenshotFileName : ?Text;
  };

  type OldActor = {
    bookings : List.List<OldBooking>;
  };

  public type BookingStatus = {
    #pending;
    #confirmed;
    #rejected;
  };

  type NewBooking = {
    name : Text;
    phone : Text;
    guests : Nat;
    date : Text;
    time : Text;
    specialRequest : Text;
    deposit : Nat;
    screenshotFileName : ?Text;
    status : BookingStatus;
  };

  type NewActor = {
    bookings : Map.Map<Nat, NewBooking>;
  };

  public func run(old : OldActor) : NewActor {
    let bookingsMap = Map.fromIter<Nat, NewBooking>(
      old.bookings.values().enumerate().map(
        func((index, oldBooking)) {
          (
            index,
            {
              oldBooking with
              status = #pending;
            },
          );
        }
      )
    );

    {
      bookings = bookingsMap;
    };
  };
};
