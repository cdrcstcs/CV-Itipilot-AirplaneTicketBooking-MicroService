package com.dailycodework.lakesidehotel.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;

import java.math.BigDecimal;
import java.util.List;
import java.time.LocalDate;

@Data
@NoArgsConstructor
public class AirplaneResponse {
    private Long id;
    private String airplaneType;
    private BigDecimal ticketPrice;
    private String photo;
    private List<SeatResponse> seats;
    private LocalDate departurDate;
    private LocalDate landingDate; 
    private int capacity;
    public AirplaneResponse(Long id, String airplaneType, BigDecimal ticketPrice, int capacity, LocalDate departureDate, LocalDate landingDate) {
        this.id = id;
        this.airplaneType = airplaneType;
        this.ticketPrice = ticketPrice;
        this.departurDate = departureDate;
        this.landingDate = landingDate;
        this.capacity = capacity;
    }
    public AirplaneResponse(Long id, String airplaneType, BigDecimal ticketPrice,
                            byte[] photoBytes, List<SeatResponse> seats, int capacity, LocalDate departureDate, LocalDate landingDate) {
        this.id = id;
        this.airplaneType = airplaneType;
        this.ticketPrice = ticketPrice;
        this.photo = photoBytes != null ? Base64.encodeBase64String(photoBytes) : null;
        this.seats = seats;
        this.departurDate = departureDate;
        this.landingDate = landingDate;
        this.capacity = capacity;
    }
}
