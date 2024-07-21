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

    private final SeatRepository SeatRepository;
    private final IAirplaneService airplaneService;

    @Override
    public List<Seat> getAllSeats() {
        return SeatRepository.findAll();
    }

    @Override
    public List<Seat> getSeatsByUserEmail(String email) {
        return SeatRepository.findByGuestEmail(email);
    }

    @Override
    public void cancelSeat(Long SeatId) {
        SeatRepository.deleteById(SeatId);
    }

    @Override
    public List<Seat> getAllSeatsByAirplaneId(Long airplaneId) {
        return SeatRepository.findByAirplaneId(airplaneId);
    }

    @Override
    public String saveSeat(Long airplaneId, Seat SeatRequest) {
        Airplane airplane = airplaneService.getAirplaneById(airplaneId).orElseThrow(() -> new ResourceNotFoundException("Airplane not found with id: " + airplaneId));
        SeatRequest.setAirplane(airplane);
        SeatRepository.save(SeatRequest);
        return SeatRequest.getSeatConfirmationCode();
    }

    @Override
    public Seat findBySeatConfirmationCode(String confirmationCode) {
        return SeatRepository.findBySeatConfirmationCode(confirmationCode).orElseThrow(() -> new ResourceNotFoundException("No Seat found with confirmation code: " + confirmationCode));
    }
}
