package com.dailycodework.lakesidehotel.repository;
import com.dailycodework.lakesidehotel.model.Airplane;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
public interface AirplaneRepository extends JpaRepository<Airplane, Long> {
    @Query("SELECT DISTINCT a.airplaneType FROM Airplane a")
    List<String> findDistinctAirplaneTypes();
    @Query("SELECT a " +
           "FROM Airplane a " +
           "WHERE (:airplaneType IS NULL OR a.airplaneType LIKE %:airplaneType%) " +
           "  AND a.departureDate >= :departureDate " +
           "  AND a.landingDate <= :landingDate " +
           "  AND a.departureDate < a.landingDate " +
           "  AND a.capacity >= 1")
    List<Airplane> findAvailableAirplanes(@Param("departureDate") LocalDate departureDate,
                                          @Param("landingDate") LocalDate landingDate,
                                          @Param("airplaneType") String airplaneType);
}
