package com.dailycodework.lakesidehotel.controller;
import com.dailycodework.lakesidehotel.exception.PhotoRetrievalException;
import com.dailycodework.lakesidehotel.exception.ResourceNotFoundException;
import com.dailycodework.lakesidehotel.model.Airplane;
import com.dailycodework.lakesidehotel.model.Seat;
import com.dailycodework.lakesidehotel.response.AirplaneResponse;
import com.dailycodework.lakesidehotel.response.SeatResponse;
import com.dailycodework.lakesidehotel.service.ISeatService;
import com.dailycodework.lakesidehotel.service.IAirplaneService;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@RequestMapping("/airplanes")
public class AirplaneController {
    private final IAirplaneService AirplaneService;
    private final ISeatService SeatService;
    @PostMapping("/add/new-airplane")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AirplaneResponse> addNewAirplane(
            @RequestParam("photo") MultipartFile photo,
            @RequestParam("airplaneType") String airplaneType,
            @RequestParam("ticketPrice") BigDecimal ticketPrice,
            @RequestParam("capacity") int capacity,
            @RequestParam("departureDate") LocalDate departurDate,
            @RequestParam("landingDate") LocalDate landingDate) throws SQLException, IOException {
        Airplane savedAirplane = AirplaneService.addNewAirplane(photo, airplaneType, ticketPrice, capacity, departurDate, landingDate);
        AirplaneResponse response = new AirplaneResponse(savedAirplane.getId(), savedAirplane.getAirplaneType(),savedAirplane.getTicketPrice(),savedAirplane.getPhoto().getBytes(0,64),null, savedAirplane.getCapacity(),savedAirplane.getDepartureDate(),savedAirplane.getLandingDate());
        return ResponseEntity.ok(response);
    }
    @GetMapping("/airplane/types")
    public List<String> getAirplaneTypes() {
        return AirplaneService.getAllAirplaneTypes();
    }
    @GetMapping("/all-airplanes")
    public ResponseEntity<List<AirplaneResponse>> getAllAirplanes() throws SQLException {
        List<Airplane> airplanes = AirplaneService.getAllAirplanes();
        List<AirplaneResponse> airplaneResponses = new ArrayList<>();
        for (Airplane airplane : airplanes) {
            byte[] photoBytes = AirplaneService.getAirplanePhotoByAirplaneId(airplane.getId());
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
        AirplaneService.deleteAirplane(airplaneId);
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
                photo.getBytes() : AirplaneService.getAirplanePhotoByAirplaneId(airplaneId);
        Blob photoBlob = photoBytes != null && photoBytes.length >0 ? new SerialBlob(photoBytes): null;
        Airplane theAirplane = AirplaneService.updateAirplane(airplaneId, airplaneType, ticketPrice, photoBytes, capacity, departurDate, landingDate);
        theAirplane.setPhoto(photoBlob);
        AirplaneResponse airplaneResponse = getAirplaneResponse(theAirplane);
        return ResponseEntity.ok(airplaneResponse);
    }
    @GetMapping("/airplane/{airplaneId}")
    public ResponseEntity<Optional<AirplaneResponse>> getAirplaneById(@PathVariable Long airplaneId){
        Optional<Airplane> theAirplane = AirplaneService.getAirplaneById(airplaneId);
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
        List<Airplane> availableAirplanes = AirplaneService.getAvailableAirplanes(departureDate, landingDate, airplaneType);
        List<AirplaneResponse> airplaneResponses = new ArrayList<>();
        for (Airplane airplane : availableAirplanes){
            byte[] photoBytes = AirplaneService.getAirplanePhotoByAirplaneId(airplane.getId());
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
        List<Seat> seats = getAllSeatsByAirplaneId(airplane.getId());
        List<SeatResponse> seatResponses = seats.stream()
                .map(seat -> new SeatResponse(
                        seat.getId(),
                        seat.getGuestFullName(),
                        seat.getGuestEmail(),
                        seat.getSeatConfirmationCode(),
                        null, // Assuming 'airplane' field in SeatResponse is nullable or should be set later
                        seat.getDepartureDate(),
                        seat.getLandingDate(),
                        seat.getTicketPrice()
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
                seatResponses, // Assuming 'seats' field is added to AirplaneResponse
                airplane.getCapacity(),
                airplane.getDepartureDate(),
                airplane.getLandingDate()
        );
    }
    
    private List<Seat> getAllSeatsByAirplaneId(Long AirplaneId) {
        return SeatService.getAllSeatsByAirplaneId(AirplaneId);
    }

}
