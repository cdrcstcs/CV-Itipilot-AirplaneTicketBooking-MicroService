package org.backend.repository;

import org.backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    List<Ticket> findByAirplaneId(Long airplaneId);

    Optional<Ticket> findByTicketConfirmationCode(String seatConfirmationCode);

    List<Ticket> findByGuestEmail(String guestEmail);
}
