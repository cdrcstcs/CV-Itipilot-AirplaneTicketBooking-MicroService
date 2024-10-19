package org.backend.controller;

import org.backend.exception.InvalidTicketRequestException;
import org.backend.exception.ResourceNotFoundException;
import org.backend.model.Ticket;
import org.backend.response.TicketResponse;
import org.backend.response.AirplaneResponse;
import org.backend.service.ITicketService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/tickets")
public class TicketController {

    private final ITicketService ticketService;

    public TicketController(ITicketService ticketService) {
        this.ticketService = ticketService;
    }

    @GetMapping("/all-tickets")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<TicketResponse>> getAllTickets() {
        List<Ticket> tickets = ticketService.getAllTickets();
        List<TicketResponse> ticketResponses = new ArrayList<>();
        for (Ticket ticket : tickets) {
            TicketResponse ticketResponse = getTicketResponse(ticket);
            ticketResponses.add(ticketResponse);
        }
        return ResponseEntity.ok(ticketResponses);
    }

    @PostMapping("/airplane/{airplaneId}/ticket")
    public ResponseEntity<?> saveTicket(@PathVariable Long airplaneId, @RequestBody Ticket ticketRequest) {
        try {
            String confirmationCode = ticketService.saveTicket(airplaneId, ticketRequest);
            return ResponseEntity.ok("Ticket saved successfully. Confirmation code: " + confirmationCode);
        } catch (InvalidTicketRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getTicketByConfirmationCode(@PathVariable String confirmationCode) {
        try {
            Ticket ticket = ticketService.findByTicketConfirmationCode(confirmationCode);
            TicketResponse ticketResponse = getTicketResponse(ticket);
            return ResponseEntity.ok(ticketResponse);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping("/user/{email}/tickets")
    public ResponseEntity<List<TicketResponse>> getTicketsByUserEmail(@PathVariable String email) {
        List<Ticket> tickets = ticketService.getTicketsByUserEmail(email);
        List<TicketResponse> ticketResponses = new ArrayList<>();
        for (Ticket ticket : tickets) {
            TicketResponse ticketResponse = getTicketResponse(ticket);
            ticketResponses.add(ticketResponse);
        }
        return ResponseEntity.ok(ticketResponses);
    }

    @DeleteMapping("/ticket/{ticketId}/delete")
    public ResponseEntity<String> cancelTicket(@PathVariable Long ticketId) {
        ticketService.cancelTicket(ticketId);
        return ResponseEntity.ok("Ticket with ID " + ticketId + " has been cancelled.");
    }

    private TicketResponse getTicketResponse(Ticket ticket) {
        try {
            byte[] photoBytes = convertBlobToBytes(ticket.getAirplane().getPhoto()); // Convert Blob to byte[]

            AirplaneResponse airplaneResponse = new AirplaneResponse(
                    ticket.getAirplane().getId(),
                    ticket.getAirplane().getAirplaneType(),
                    ticket.getAirplane().getTicketPrice(),
                    photoBytes, // Use byte[] directly
                    null,
                    ticket.getAirplane().getCapacity(),
                    ticket.getAirplane().getDepartureDate(),
                    ticket.getAirplane().getLandingDate()
            );

            return new TicketResponse(
                    ticket.getId(),
                    ticket.getGuestFullName(),
                    ticket.getGuestEmail(),
                    ticket.getTicketConfirmationCode(),
                    airplaneResponse,
                    ticket.getDepartureDate(),
                    ticket.getLandingDate(),
                    ticket.getAirplane().getTicketPrice()
            );
        } catch (SQLException e) {
            // Handle or log SQLException
            e.printStackTrace();
            return null; // Or handle gracefully based on your application's requirements
        }
    }

    // Utility method to convert Blob to byte[]
    private byte[] convertBlobToBytes(Blob blob) throws SQLException {
        if (blob != null) {
            return blob.getBytes(1, (int) blob.length()); // Read all bytes from position 1 to the end
        }
        return null;
    }
}
