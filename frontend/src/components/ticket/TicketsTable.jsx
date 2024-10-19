import { parseISO } from "date-fns";
import React, { useState, useEffect } from "react";
import DateSlider from "../common/DateSlider";

const TicketsTable = ({ TicketInfo, handleTicketCancellation }) => {
  const [filteredTickets, setFilteredTickets] = useState(TicketInfo);

  const filterTickets = (startDate, endDate) => {
    let filtered = TicketInfo;
    if (startDate && endDate) {
      filtered = TicketInfo.filter((Ticket) => {
        const TicketStartDate = parseISO(Ticket.departureDate);
        const TicketEndDate = parseISO(Ticket.landingDate);
        return TicketStartDate >= startDate && TicketEndDate <= endDate && TicketEndDate > startDate;
      });
    }
    setFilteredTickets(filtered);
  };

  useEffect(() => {
    setFilteredTickets(TicketInfo);
  }, [TicketInfo]);

  return (
    <section className="p-4">
      <DateSlider onDateChange={filterTickets} onFilterChange={filterTickets} />
      <table className="table table-bordered table-hover shadow">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Ticket ID</th>
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
          {filteredTickets.map((Ticket, index) => (
            <tr key={Ticket.id}>
              <td>{index + 1}</td>
              <td>{Ticket.id}</td>
              <td>{Ticket.airplane.id}</td>
              <td>{Ticket.airplane.airplaneType}</td>
              <td>{Ticket.departureDate}</td>
              <td>{Ticket.landingDate}</td>
              <td>{Ticket.guestName}</td>
              <td>{Ticket.guestEmail}</td>
              <td>${Ticket.ticketPrice}</td>
              <td>{Ticket.TicketConfirmationCode}</td>
              <td>
                <button className="btn btn-danger btn-sm" onClick={() => handleTicketCancellation(Ticket.id)}>
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredTickets.length === 0 && <p>No Tickets found for the selected dates</p>}
    </section>
  );
};

export default TicketsTable;
