package com.dailycodework.lakesidehotel.response;

import java.math.BigDecimal;
import java.time.LocalDate;

import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@NoArgsConstructor
public class SeatResponse {

    private Long id;
    private String guestName;
    private String guestEmail;
    private String seatConfirmationCode;
    private AirplaneResponse airplane; // Changed from 'room' to 'airplane'
    private LocalDate departurDate;
    private LocalDate landingDate;
    private BigDecimal ticketPrice;
    public SeatResponse(Long id, String guestName,
                        String guestEmail, String seatConfirmationCode, AirplaneResponse airplane, LocalDate departurDate, LocalDate landingDate, BigDecimal ticketPrice) {
        this.id = id;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.seatConfirmationCode = seatConfirmationCode;
        this.airplane = airplane;
        this.departurDate = departurDate;
        this.landingDate = landingDate;
        this.ticketPrice = ticketPrice;
    }
}
