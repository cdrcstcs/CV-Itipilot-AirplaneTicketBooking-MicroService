package org.backend.service;
import org.backend.exception.InternalServerException;
import org.backend.exception.ResourceNotFoundException;
import org.backend.model.Airplane;
import org.backend.repository.AirplaneRepository;
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
public class AirplaneService implements IAirplaneService{
    private final AirplaneRepository airplaneRepository;

    public AirplaneService(AirplaneRepository airplaneRepository) {
        this.airplaneRepository = airplaneRepository;
    }

    @Override
    public Airplane addNewAirplane(MultipartFile photo, String airplaneType,
                                   BigDecimal ticketPrice, int capacity,
                                   LocalDate departureDate, LocalDate landingDate)
                                    throws SQLException, IOException {
        Airplane airplane = new Airplane();
        airplane.setAirplaneType(airplaneType);
        airplane.setTicketPrice(ticketPrice);
        airplane.setCapacity(capacity);
        airplane.setDepartureDate(departureDate);
        airplane.setLandingDate(landingDate);
        if(!photo.isEmpty()){
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

        if(!optionalAirplane.isPresent()) {
            throw new ResourceNotFoundException("Airplane not found width id: "+ airplaneId);
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
    public Airplane updateAirplane(Long airplaneId, String airplaneType, BigDecimal ticketPrice,
                                   byte[] photoBytes, int capacity,
                                   LocalDate departureDate, LocalDate landingDate) {
        Airplane airplane = airplaneRepository.findById(airplaneId).orElseThrow(() -> new ResourceNotFoundException("Airplane not found with id: " + airplaneId));
        if(airplaneType != null) {
            airplane.setAirplaneType(airplaneType);
        }
        if(ticketPrice != null ){
            airplane.setTicketPrice(ticketPrice);
        }
        if(capacity>0){
            airplane.setCapacity(capacity);
        }
        if(departureDate != null && landingDate != null){
            airplane.setDepartureDate(departureDate);
            airplane.setLandingDate(landingDate);
        }
        if(photoBytes != null && photoBytes.length > 0) {
            try {
                airplane.setPhoto(new SerialBlob(photoBytes));
            } catch (SQLException ex){
                throw new InternalServerException("Failed to update airplane"+ ex.getMessage());
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
