package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Seat;

import java.util.List;

public interface ISeatService {

    void cancelSeat(Long SeatId);

    List<Seat> getAllSeatsByAirplaneId(Long airplaneId);

    String saveSeat(Long airplaneId, Seat SeatRequest);

    Seat findBySeatConfirmationCode(String confirmationCode);

    List<Seat> getAllSeats();

    List<Seat> getSeatsByUserEmail(String email);
}
