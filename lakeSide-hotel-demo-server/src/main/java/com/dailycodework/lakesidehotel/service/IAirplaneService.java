package com.dailycodework.lakesidehotel.service;

import com.dailycodework.lakesidehotel.model.Airplane;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

public interface IAirplaneService {

    Airplane addNewAirplane(MultipartFile photo, String airplaneType, BigDecimal ticketPrice) throws SQLException, IOException;

    List<String> getAllAirplaneTypes();

    List<Airplane> getAllAirplanes();

    byte[] getAirplanePhotoByAirplaneId(Long airplaneId) throws SQLException;

    void deleteAirplane(Long airplaneId);

    Airplane updateAirplane(Long airplaneId, String airplaneType, BigDecimal ticketPrice, byte[] photoBytes);

    Optional<Airplane> getAirplaneById(Long airplaneId);

    List<Airplane> getAvailableAirplanesByType(String airplaneType);
}
