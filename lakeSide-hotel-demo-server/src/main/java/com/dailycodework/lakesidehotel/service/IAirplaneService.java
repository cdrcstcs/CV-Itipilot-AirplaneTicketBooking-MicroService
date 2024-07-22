package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Airplane;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface IAirplaneService {

    Airplane addNewAirplane(MultipartFile photo, String airplaneType, BigDecimal ticketPrice, int capacity, LocalDate departureDate, LocalDate landingDate) throws SQLException, IOException;

    List<String> getAllAirplaneTypes();

    List<Airplane> getAllAirplanes();

    byte[] getAirplanePhotoByAirplaneId(Long airplaneId) throws SQLException;

    void deleteAirplane(Long airplaneId);

    Airplane updateAirplane(Long airplaneId, String airplaneType, BigDecimal ticketPrice, byte[] photoBytes, int capacity,LocalDate departureDate, LocalDate landingDate);

    Optional<Airplane> getAirplaneById(Long airplaneId);

    List<Airplane> getAvailableAirplanes(LocalDate departureDate, LocalDate landingDate, String airplaneType);
}
