package com.dailycodework.lakesidehotel.repository;

import com.dailycodework.lakesidehotel.model.Airplane;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AirplaneRepository extends JpaRepository<Airplane, Long> {

    @Query("SELECT DISTINCT a.airplaneType FROM Airplane a")
    List<String> findDistinctAirplaneTypes();

    @Query("SELECT a FROM Airplane a " +
           "WHERE a.airplaneType LIKE %:airplaneType%")
    List<Airplane> findAvailableAirplanesByType(@Param("airplaneType") String airplaneType);
}
