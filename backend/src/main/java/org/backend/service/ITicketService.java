package org.backend.service;

import org.backend.model.Ticket;

import java.util.List;

public interface ITicketService {

    void cancelTicket(Long seatId);

    List<Ticket> getAllTicketsByAirplaneId(Long airplaneId);

    String saveTicket(Long airplaneId, Ticket seatRequest);

    Ticket findByTicketConfirmationCode(String confirmationCode);

    List<Ticket> getAllTickets();

    List<Ticket> getTicketsByUserEmail(String email);
}
