package com.dailycodework.lakesidehotel.controller;

import com.dailycodework.lakesidehotel.exception.InvalidSeatRequestException;
import com.dailycodework.lakesidehotel.exception.ResourceNotFoundException;
import com.dailycodework.lakesidehotel.model.Seat;
import com.dailycodework.lakesidehotel.response.SeatResponse;
import com.dailycodework.lakesidehotel.response.AirplaneResponse;
import com.dailycodework.lakesidehotel.service.ISeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Blob;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/seats")
public class SeatController {
    
    private final ISeatService seatService;

    @GetMapping("/all-seats")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<List<SeatResponse>> getAllSeats() {
        List<Seat> seats = seatService.getAllSeats();
        List<SeatResponse> seatResponses = new ArrayList<>();
        for (Seat seat : seats) {
            SeatResponse seatResponse = getSeatResponse(seat);
            seatResponses.add(seatResponse);
        }
        return ResponseEntity.ok(seatResponses);
    }

    @PostMapping("/airplane/{airplaneId}/seat")
    public ResponseEntity<?> saveSeat(@PathVariable Long airplaneId, @RequestBody Seat seatRequest) {
        try {
            String confirmationCode = seatService.saveSeat(airplaneId, seatRequest);
            return ResponseEntity.ok("Seat saved successfully. Confirmation code: " + confirmationCode);
        } catch (InvalidSeatRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/confirmation/{confirmationCode}")
    public ResponseEntity<?> getSeatByConfirmationCode(@PathVariable String confirmationCode) {
        try {
            Seat seat = seatService.findBySeatConfirmationCode(confirmationCode);
            SeatResponse seatResponse = getSeatResponse(seat);
            return ResponseEntity.ok(seatResponse);
        } catch (ResourceNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @GetMapping("/user/{email}/seats")
    public ResponseEntity<List<SeatResponse>> getSeatsByUserEmail(@PathVariable String email) {
        List<Seat> seats = seatService.getSeatsByUserEmail(email);
        List<SeatResponse> seatResponses = new ArrayList<>();
        for (Seat seat : seats) {
            SeatResponse seatResponse = getSeatResponse(seat);
            seatResponses.add(seatResponse);
        }
        return ResponseEntity.ok(seatResponses);
    }

    @DeleteMapping("/seat/{seatId}/delete")
    public ResponseEntity<String> cancelSeat(@PathVariable Long seatId) {
        seatService.cancelSeat(seatId);
        return ResponseEntity.ok("Seat with ID " + seatId + " has been cancelled.");
    }

    private SeatResponse getSeatResponse(Seat seat) {
        try {
            byte[] photoBytes = convertBlobToBytes(seat.getAirplane().getPhoto()); // Convert Blob to byte[]
            
            AirplaneResponse airplaneResponse = new AirplaneResponse(
                    seat.getAirplane().getId(),
                    seat.getAirplane().getAirplaneType(),
                    seat.getAirplane().getTicketPrice(),
                    photoBytes, // Use byte[] directly
                    null,
                    seat.getAirplane().getCapacity(),
                    seat.getAirplane().getDepartureDate(),
                    seat.getAirplane().getLandingDate()
            );

            return new SeatResponse(
                    seat.getId(),
                    seat.getGuestFullName(),
                    seat.getGuestEmail(),
                    seat.getSeatConfirmationCode(),
                    airplaneResponse,
                    seat.getDepartureDate(),
                    seat.getLandingDate(),
                    seat.getAirplane().getTicketPrice()
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
