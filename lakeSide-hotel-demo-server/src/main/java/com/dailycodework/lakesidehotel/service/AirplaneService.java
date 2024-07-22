package com.dailycodework.lakesidehotel.service;
import com.dailycodework.lakesidehotel.exception.InternalServerException;
import com.dailycodework.lakesidehotel.exception.ResourceNotFoundException;
import com.dailycodework.lakesidehotel.model.Airplane;
import com.dailycodework.lakesidehotel.repository.AirplaneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Blob;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
@Service
@RequiredArgsConstructor
public class AirplaneService implements IAirplaneService {

    private final AirplaneRepository airplaneRepository;

    @Override
    public Airplane addNewAirplane(MultipartFile photo, String airplaneType, BigDecimal ticketPrice) throws SQLException, IOException {
        Airplane airplane = new Airplane();
        airplane.setAirplaneType(airplaneType);
        airplane.setTicketPrice(ticketPrice);
        
        if (!photo.isEmpty()) {
            byte[] photoBytes = photo.getBytes();
            Blob photoBlob = new SerialBlob(photoBytes);
            airplane.setPhoto(photoBlob);
        }
        
        return airplaneRepository.save(airplane);
    }

    @Override
    public List<String> getAllAirplaneTypes() {
        return airplaneRepository.findDistinctAirplaneTypes();
    }

    @Override
    public List<Airplane> getAllAirplanes() {
        return airplaneRepository.findAll();
    }

    @Override
    public byte[] getAirplanePhotoByAirplaneId(Long airplaneId) throws SQLException {
        Optional<Airplane> optionalAirplane = airplaneRepository.findById(airplaneId);
        
        if (optionalAirplane.isEmpty()) {
            throw new ResourceNotFoundException("Airplane not found with id: " + airplaneId);
        }
        
        Blob photoBlob = optionalAirplane.get().getPhoto();
        
        if (photoBlob != null) {
            return photoBlob.getBytes(1, (int) photoBlob.length());
        }
        
        return null;
    }

    @Override
    public void deleteAirplane(Long airplaneId) {
        Optional<Airplane> optionalAirplane = airplaneRepository.findById(airplaneId);
        
        if (optionalAirplane.isPresent()) {
            airplaneRepository.deleteById(airplaneId);
        }
    }

    @Override
    public Airplane updateAirplane(Long airplaneId, String airplaneType, BigDecimal ticketPrice, byte[] photoBytes) {
        Airplane airplane = airplaneRepository.findById(airplaneId)
                .orElseThrow(() -> new ResourceNotFoundException("Airplane not found with id: " + airplaneId));
        
        if (airplaneType != null) {
            airplane.setAirplaneType(airplaneType);
        }
        
        if (ticketPrice != null) {
            airplane.setTicketPrice(ticketPrice);
        }
        
        if (photoBytes != null && photoBytes.length > 0) {
            try {
                airplane.setPhoto(new SerialBlob(photoBytes));
            } catch (SQLException ex) {
                throw new InternalServerException("Failed to update airplane");
            }
        }
        
        return airplaneRepository.save(airplane);
    }

    @Override
    public Optional<Airplane> getAirplaneById(Long airplaneId) {
        return airplaneRepository.findById(airplaneId);
    }

    @Override
    public List<Airplane> getAvailableAirplanes(LocalDate departureDate, LocalDate landingDate, String airplaneType) {
        return airplaneRepository.findAvailableAirplanes(departureDate, landingDate, airplaneType);
    }
}
