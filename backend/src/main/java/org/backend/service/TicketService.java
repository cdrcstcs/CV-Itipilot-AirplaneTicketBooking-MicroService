package org.backend.service;
import org.backend.exception.ResourceNotFoundException;
import org.backend.model.Ticket;
import org.backend.model.Airplane;
import org.backend.repository.TicketRepository;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
public class TicketService implements ITicketService {

    private final TicketRepository ticketRepository;
    private final IAirplaneService airplaneService;

    public TicketService(TicketRepository ticketRepository, IAirplaneService airplaneService) {
        this.ticketRepository = ticketRepository;
        this.airplaneService = airplaneService;
    }

    @Override
    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    @Override
    public List<Ticket> getTicketsByUserEmail(String email) {
        return ticketRepository.findByGuestEmail(email);
    }

    @Override
    public void cancelTicket(Long ticketId) {
        ticketRepository.deleteById(ticketId);
    }

    @Override
    public List<Ticket> getAllTicketsByAirplaneId(Long airplaneId) {
        return ticketRepository.findByAirplaneId(airplaneId);
    }

    @Override
    public String saveTicket(Long airplaneId, Ticket ticketRequest) {
        Airplane airplane = airplaneService.getAirplaneById(airplaneId).orElseThrow(() -> new ResourceNotFoundException("Airplane not found with id: " + airplaneId));
        ticketRequest.setAirplane(airplane);
        ticketRepository.save(ticketRequest);
        ticketRequest.setDepartureDate(airplane.getDepartureDate());
        ticketRequest.setLandingDate(airplane.getLandingDate());
        airplane.addTicket(ticketRequest);
        return ticketRequest.getTicketConfirmationCode();
    }

    @Override
    public Ticket findByTicketConfirmationCode(String confirmationCode) {
        return ticketRepository.findByTicketConfirmationCode(confirmationCode).orElseThrow(() -> new ResourceNotFoundException("No Ticket found with confirmation code: " + confirmationCode));
    }
}
