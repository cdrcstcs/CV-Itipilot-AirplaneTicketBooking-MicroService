package org.backend.controller;
import org.backend.exception.PhotoRetrievalException;
import org.backend.exception.ResourceNotFoundException;
import org.backend.model.Airplane;
import org.backend.model.Ticket;
import org.backend.response.AirplaneResponse;
import org.backend.response.TicketResponse;
import org.backend.service.ITicketService;
import org.backend.service.IAirplaneService;
import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@RestController
@RequestMapping("/airplanes")
public class AirplaneController {
    private final IAirplaneService airplaneService;
    private final ITicketService ticketService;
    public AirplaneController(IAirplaneService airplaneService, ITicketService ticketService) {
        this.airplaneService = airplaneService;
        this.ticketService = ticketService;
    }
    @PostMapping("/add/new-airplane")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AirplaneResponse> addNewAirplane(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("airplaneType") String airplaneType,
            @RequestParam("ticketPrice") BigDecimal ticketPrice,
            @RequestParam("capacity") int capacity,
            @RequestParam("departureDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate departureDate,
            @RequestParam("landingDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate landingDate) throws SQLException, IOException {

        Airplane savedAirplane = airplaneService.addNewAirplane(photo, airplaneType, ticketPrice, capacity, departureDate, landingDate);

        // Retrieve photo bytes correctly from SerialBlob
        byte[] photoBytes = null;
        Blob photoBlob = savedAirplane.getPhoto();
        if (photoBlob != null) {
            try {
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length()); // Read all bytes from position 1 to the end
            } catch (SQLException e) {
                // Handle exception appropriately
                throw new SQLException("Error retrieving photo bytes from SerialBlob", e);
            }
        }

        AirplaneResponse response = new AirplaneResponse(
                savedAirplane.getId(),
                savedAirplane.getAirplaneType(),
                savedAirplane.getTicketPrice(),
                photoBytes,
                null, // Assuming ticketResponses or related data might be added here
                savedAirplane.getCapacity(),
                savedAirplane.getDepartureDate(),
                savedAirplane.getLandingDate());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/airplane/types")
    public List<String> getAirplaneTypes() {
        return airplaneService.getAllAirplaneTypes();
    }
    @GetMapping("/all-airplanes")
    public ResponseEntity<List<AirplaneResponse>> getAllAirplanes() throws SQLException {
        List<Airplane> airplanes = airplaneService.getAllAirplanes();
        List<AirplaneResponse> airplaneResponses = new ArrayList<>();
        for (Airplane airplane : airplanes) {
            byte[] photoBytes = airplaneService.getAirplanePhotoByAirplaneId(airplane.getId());
            if (photoBytes != null && photoBytes.length > 0) {
                String base64Photo = Base64.encodeBase64String(photoBytes);
                AirplaneResponse airplaneResponse = getAirplaneResponse(airplane);
                airplaneResponse.setPhoto(base64Photo);
                airplaneResponses.add(airplaneResponse);
            }
        }
        return ResponseEntity.ok(airplaneResponses);
    }
    @DeleteMapping("/delete/airplane/{airplaneId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteAirplane(@PathVariable Long airplaneId){
        airplaneService.deleteAirplane(airplaneId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PutMapping("/update/{airplaneId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AirplaneResponse> updateAirplane(@PathVariable Long airplaneId,
                                                           @RequestParam(required = false)  String airplaneType,
                                                           @RequestParam(required = false) BigDecimal ticketPrice,
                                                           @RequestParam(required = false) int capacity,
                                                           @RequestParam(required = false) LocalDate departurDate,
                                                           @RequestParam(required = false) LocalDate landingDate,
                                                           @RequestParam(required = false) MultipartFile photo) throws SQLException, IOException {
        byte[] photoBytes = photo != null && !photo.isEmpty() ?
                photo.getBytes() : airplaneService.getAirplanePhotoByAirplaneId(airplaneId);
        Blob photoBlob = photoBytes != null && photoBytes.length >0 ? new SerialBlob(photoBytes): null;
        Airplane theAirplane = airplaneService.updateAirplane(airplaneId, airplaneType, ticketPrice, photoBytes, capacity, departurDate, landingDate);
        theAirplane.setPhoto(photoBlob);
        AirplaneResponse airplaneResponse = getAirplaneResponse(theAirplane);
        return ResponseEntity.ok(airplaneResponse);
    }
    @GetMapping("/airplane/{airplaneId}")
    public ResponseEntity<Optional<AirplaneResponse>> getAirplaneById(@PathVariable Long airplaneId){
        Optional<Airplane> theAirplane = airplaneService.getAirplaneById(airplaneId);
        return theAirplane.map(airplane -> {
            AirplaneResponse airplaneResponse = getAirplaneResponse(airplane);
            return  ResponseEntity.ok(Optional.of(airplaneResponse));
        }).orElseThrow(() -> new ResourceNotFoundException("Airplane not found"));
    }
    @GetMapping("/available-airplanes")
    public ResponseEntity<List<AirplaneResponse>> getAvailableAirplanes(
            @RequestParam("departureDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate departureDate,
            @RequestParam("landingDate") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate landingDate,
            @RequestParam("airplaneType") String airplaneType
    ) throws SQLException {
        List<Airplane> availableAirplanes = airplaneService.getAvailableAirplanes(departureDate, landingDate, airplaneType);
        List<AirplaneResponse> airplaneResponses = new ArrayList<>();
        for (Airplane airplane : availableAirplanes){
            byte[] photoBytes = airplaneService.getAirplanePhotoByAirplaneId(airplane.getId());
            if (photoBytes != null && photoBytes.length > 0){
                String photoBase64 = Base64.encodeBase64String(photoBytes);
                AirplaneResponse airplaneResponse = getAirplaneResponse(airplane);
                airplaneResponse.setPhoto(photoBase64);
                airplaneResponses.add(airplaneResponse);
            }
        }
        if(airplaneResponses.isEmpty()){
            return ResponseEntity.noContent().build();
        }else{
            return ResponseEntity.ok(airplaneResponses);
        }
    }
    private AirplaneResponse getAirplaneResponse(Airplane airplane) {
        List<Ticket> tickets = getAllTicketsByAirplaneId(airplane.getId());
        List<TicketResponse> ticketResponses = tickets.stream()
                .map(ticket -> new TicketResponse(
                        ticket.getId(),
                        ticket.getGuestFullName(),
                        ticket.getGuestEmail(),
                        ticket.getTicketConfirmationCode(),
                        null, // Assuming 'airplane' field in TicketResponse is nullable or should be set later
                        ticket.getDepartureDate(),
                        ticket.getLandingDate(),
                        ticket.getTicketPrice()
                ))
                .toList();

        byte[] photoBytes = null;
        Blob photoBlob = airplane.getPhoto();
        if (photoBlob != null) {
            try {
                photoBytes = photoBlob.getBytes(1, (int) photoBlob.length());
            } catch (SQLException e) {
                throw new PhotoRetrievalException("Error retrieving photo");
            }
        }

        return new AirplaneResponse(
                airplane.getId(),
                airplane.getAirplaneType(),
                airplane.getTicketPrice(),
                photoBytes,
                ticketResponses, // Assuming 'tickets' field is added to AirplaneResponse
                airplane.getCapacity(),
                airplane.getDepartureDate(),
                airplane.getLandingDate()
        );
    }

    private List<Ticket> getAllTicketsByAirplaneId(Long airplaneId) {
        return ticketService.getAllTicketsByAirplaneId(airplaneId);
    }

}
