import Map "mo:core/Map";
import Nat "mo:core/Nat";

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
    status : {
      #pending;
      #confirmed;
      #rejected;
    };
  };

  type NewBooking = {
    name : Text;
    phone : Text;
    guests : Nat;
    date : Text;
    time : Text;
    specialRequest : Text;
    status : {
      #pending;
      #confirmed;
      #rejected;
    };
    paymentDetails : {
      advanceAmount : Nat;
      paymentMethod : Text;
      upiDetails : Text;
      bankDetails : Text;
    };
    screenshotFileName : ?Text;
  };

  type OldActor = {
    bookings : Map.Map<Nat, OldBooking>;
  };
  type NewActor = {
    bookings : Map.Map<Nat, NewBooking>;
  };

  public func run(old : OldActor) : NewActor {
    let newBookings = old.bookings.map<Nat, OldBooking, NewBooking>(
      func(_id, oldBooking) {
        {
          oldBooking with
          status = oldBooking.status;
          paymentDetails = {
            advanceAmount = oldBooking.deposit;
            paymentMethod = "Not specified";
            upiDetails = "Not specified";
            bankDetails = "Not specified";
          };
        };
      }
    );
    { bookings = newBookings };
  };
};
