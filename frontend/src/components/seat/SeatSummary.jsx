import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const SeatSummary = ({ seat, onConfirm }) => {
  const [isSeatConfirmed, setIsSeatConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirmSeat = () => {
    setIsLoading(true); // Set isLoading to true immediately to show spinner

    // Simulate a delay in seat confirmation
    setTimeout(() => {
      setIsSeatConfirmed(true); // Set seat confirmed after delay
      onConfirm(); // Callback to parent component if needed
    }, 3000);
  };

  useEffect(() => {
    if (isSeatConfirmed) {
      // If seat is confirmed, navigate to success page
      navigate("/seat-success");

      // Reset isLoading state after navigating
      setIsLoading(false);
    }
  }, [isSeatConfirmed, navigate]);

  return (
    <div className="row">
      <div className="col-md-6"></div>
      <div className="card card-body mt-5">
        <h4 className="card-title hotel-color">Reservation Summary</h4>
        <p>
          Name: <strong>{seat.guestFullName}</strong>
        </p>
        <p>
          Email: <strong>{seat.guestEmail}</strong>
        </p>
        <Button variant="success" onClick={handleConfirmSeat} disabled={isLoading}>
          {isLoading && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {isLoading ? " Confirming..." : "Confirm Seat"}
        </Button>
      </div>
    </div>
  );
};

export default SeatSummary;
