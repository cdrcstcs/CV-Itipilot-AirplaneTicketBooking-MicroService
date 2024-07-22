package com.dailycodework.lakesidehotel.service;
import com.dailycodework.lakesidehotel.exception.ResourceNotFoundException;
import com.dailycodework.lakesidehotel.model.Seat;
import com.dailycodework.lakesidehotel.model.Airplane;
import com.dailycodework.lakesidehotel.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
@Service
@RequiredArgsConstructor
public class SeatService implements ISeatService {

    private final SeatRepository seatRepository;
    private final IAirplaneService airplaneService;

    @Override
    public List<Seat> getAllSeats() {
        return seatRepository.findAll();
    }

    @Override
    public List<Seat> getSeatsByUserEmail(String email) {
        return seatRepository.findByGuestEmail(email);
    }

    @Override
    public void cancelSeat(Long seatId) {
        seatRepository.deleteById(seatId);
    }

    @Override
    public List<Seat> getAllSeatsByAirplaneId(Long airplaneId) {
        return seatRepository.findByAirplaneId(airplaneId);
    }

    @Override
    public String saveSeat(Long airplaneId, Seat seatRequest) {
        Airplane airplane = airplaneService.getAirplaneById(airplaneId).orElseThrow(() -> new ResourceNotFoundException("Airplane not found with id: " + airplaneId));
        seatRequest.setAirplane(airplane);
        seatRepository.save(seatRequest);
        seatRequest.setDepartureDate(airplane.getDepartureDate());
        seatRequest.setLandingDate(airplane.getLandingDate());
        airplane.addSeat(seatRequest);
        return seatRequest.getSeatConfirmationCode();
    }

    @Override
    public Seat findBySeatConfirmationCode(String confirmationCode) {
        return seatRepository.findBySeatConfirmationCode(confirmationCode).orElseThrow(() -> new ResourceNotFoundException("No Seat found with confirmation code: " + confirmationCode));
    }
}
