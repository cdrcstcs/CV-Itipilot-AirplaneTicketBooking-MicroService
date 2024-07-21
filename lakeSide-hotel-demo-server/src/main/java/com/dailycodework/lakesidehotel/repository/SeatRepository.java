package com.dailycodework.lakesidehotel.repository;

import com.dailycodework.lakesidehotel.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByAirplaneId(Long airplaneId);

    Optional<Seat> findBySeatConfirmationCode(String seatConfirmationCode);

    List<Seat> findByGuestEmail(String guestEmail);
}
