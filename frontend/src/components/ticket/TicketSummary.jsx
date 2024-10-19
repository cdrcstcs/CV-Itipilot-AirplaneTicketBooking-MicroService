import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const TicketSummary = ({ Ticket, onConfirm }) => {
  const [isTicketConfirmed, setIsTicketConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleConfirmTicket = () => {
    setIsLoading(true); // Set isLoading to true immediately to show spinner

    // Simulate a delay in Ticket confirmation
    setTimeout(() => {
      setIsTicketConfirmed(true); // Set Ticket confirmed after delay
      onConfirm(); // Callback to parent component if needed
    }, 3000);
  };

  useEffect(() => {
    if (isTicketConfirmed) {
      // If Ticket is confirmed, navigate to success page
      navigate("/Ticket-success");

      // Reset isLoading state after navigating
      setIsLoading(false);
    }
  }, [isTicketConfirmed, navigate]);

  return (
    <div className="row">
      <div className="col-md-6"></div>
      <div className="card card-body mt-5">
        <h4 className="card-title hotel-color">Reservation Summary</h4>
        <p>
          Name: <strong>{Ticket.guestFullName}</strong>
        </p>
        <p>
          Email: <strong>{Ticket.guestEmail}</strong>
        </p>
        <Button variant="success" onClick={handleConfirmTicket} disabled={isLoading}>
          {isLoading && (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          )}
          {isLoading ? " Confirming..." : "Confirm Ticket"}
        </Button>
      </div>
    </div>
  );
};

export default TicketSummary;
