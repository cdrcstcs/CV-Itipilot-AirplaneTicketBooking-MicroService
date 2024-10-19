package org.backend.response;

import java.math.BigDecimal;
import java.time.LocalDate;

public class TicketResponse {

    private Long id;
    private String guestName;
    private String guestEmail;
    private String ticketConfirmationCode;
    private AirplaneResponse airplane; // Changed from 'room' to 'airplane'
    private LocalDate departureDate; // Corrected the variable name
    private LocalDate landingDate;
    private BigDecimal ticketPrice;

    // No-argument constructor
    public TicketResponse() {
    }

    // Constructor with parameters
    public TicketResponse(Long id, String guestName, String guestEmail, String ticketConfirmationCode, AirplaneResponse airplane, LocalDate departureDate, LocalDate landingDate, BigDecimal ticketPrice) {
        this.id = id;
        this.guestName = guestName;
        this.guestEmail = guestEmail;
        this.ticketConfirmationCode = ticketConfirmationCode;
        this.airplane = airplane;
        this.departureDate = departureDate; // Corrected the variable name
        this.landingDate = landingDate;
        this.ticketPrice = ticketPrice;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getGuestEmail() {
        return guestEmail;
    }

    public void setGuestEmail(String guestEmail) {
        this.guestEmail = guestEmail;
    }

    public String getTicketConfirmationCode() {
        return ticketConfirmationCode;
    }

    public void setTicketConfirmationCode(String ticketConfirmationCode) {
        this.ticketConfirmationCode = ticketConfirmationCode;
    }

    public AirplaneResponse getAirplane() {
        return airplane;
    }

    public void setAirplane(AirplaneResponse airplane) {
        this.airplane = airplane;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }

    public LocalDate getLandingDate() {
        return landingDate;
    }

    public void setLandingDate(LocalDate landingDate) {
        this.landingDate = landingDate;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(BigDecimal ticketPrice) {
        this.ticketPrice = ticketPrice;
    }
}
