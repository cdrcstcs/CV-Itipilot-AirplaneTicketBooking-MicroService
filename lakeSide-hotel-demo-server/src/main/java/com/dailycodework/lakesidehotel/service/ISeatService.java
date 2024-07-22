package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Seat;

import java.util.List;

public interface ISeatService {

    void cancelSeat(Long seatId);

    List<Seat> getAllSeatsByAirplaneId(Long airplaneId);

    String saveSeat(Long airplaneId, Seat seatRequest);

    Seat findBySeatConfirmationCode(String confirmationCode);

    List<Seat> getAllSeats();

    List<Seat> getSeatsByUserEmail(String email);
}
