import React, { useState, useEffect } from "react";
import moment from "moment";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

const SeatSummary = ({ seat, onConfirm }) => {
  const [isSeatConfirmed, setIsSeatConfirmed] = useState(false);
  const navigate = useNavigate();

  const handleConfirmSeat = () => {
    setTimeout(() => {
      setIsSeatConfirmed(true);
      onConfirm();
    }, 3000);
  };

  useEffect(() => {
    if (isSeatConfirmed) {
      navigate("/seat-success");
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
		<Button variant="success" onClick={handleConfirmSeat}>
			<span
				className="spinner-border spinner-border-sm mr-2"
				role="status"
				aria-hidden="true"
			></span>
			Seat Confirmed
        </Button>
        </div>
    </div>
  );
};

export default SeatSummary;
