package com.dailycodework.lakesidehotel.response;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.tomcat.util.codec.binary.Base64;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
public class AirplaneResponse {
    private Long id;
    private String airplaneType;
    private BigDecimal ticketPrice;
    private String photo;
    private List<SeatResponse> seats;
    public AirplaneResponse(Long id, String airplaneType, BigDecimal ticketPrice) {
        this.id = id;
        this.airplaneType = airplaneType;
        this.ticketPrice = ticketPrice;
    }
    public AirplaneResponse(Long id, String airplaneType, BigDecimal ticketPrice,
                            byte[] photoBytes, List<SeatResponse> seats) {
        this.id = id;
        this.airplaneType = airplaneType;
        this.ticketPrice = ticketPrice;
        this.photo = photoBytes != null ? Base64.encodeBase64String(photoBytes) : null;
        this.seats = seats;
    }
}
