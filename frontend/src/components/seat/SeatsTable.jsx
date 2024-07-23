import { parseISO } from "date-fns";
import React, { useState, useEffect } from "react";
import DateSlider from "../common/DateSlider";

const SeatsTable = ({ seatInfo, handleSeatCancellation }) => {
  const [filteredSeats, setFilteredSeats] = useState(seatInfo);

  const filterSeats = (startDate, endDate) => {
    let filtered = seatInfo;
    if (startDate && endDate) {
      filtered = seatInfo.filter((seat) => {
        const seatStartDate = parseISO(seat.departureDate);
        const seatEndDate = parseISO(seat.landingDate);
        return seatStartDate >= startDate && seatEndDate <= endDate && seatEndDate > startDate;
      });
    }
    setFilteredSeats(filtered);
  };

  useEffect(() => {
    setFilteredSeats(seatInfo);
  }, [seatInfo]);

  return (
    <section className="p-4">
      <DateSlider onDateChange={filterSeats} onFilterChange={filterSeats} />
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Seat ID</th>
            <th>Airplane ID</th>
            <th>Airplane Type</th>
            <th>Departure Date</th>
            <th>Landing Date</th>
            <th>Guest Name</th>
            <th>Guest Email</th>
            <th>Ticket Price</th>
            <th>Confirmation Code</th>
            <th colSpan={2}>Actions</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {filteredSeats.map((seat, index) => (
            <tr key={seat.id}>
              <td>{index + 1}</td>
              <td>{seat.id}</td>
              <td>{seat.airplane.id}</td>
              <td>{seat.airplane.airplaneType}</td>
              <td>{seat.departureDate}</td>
              <td>{seat.landingDate}</td>
              <td>{seat.guestName}</td>
              <td>{seat.guestEmail}</td>
              <td>${seat.ticketPrice}</td>
              <td>{seat.seatConfirmationCode}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleSeatCancellation(seat.id)}>
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredSeats.length === 0 && <p>No Seats found for the selected dates</p>}
    </section>
  );
};

export default SeatsTable;
