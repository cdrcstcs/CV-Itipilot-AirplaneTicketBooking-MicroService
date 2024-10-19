package org.backend.response;

import org.apache.tomcat.util.codec.binary.Base64;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class AirplaneResponse {
    private Long id;
    private String airplaneType;
    private BigDecimal ticketPrice;
    private String photo;
    private List<TicketResponse> tickets;
    private LocalDate departureDate;
    private LocalDate landingDate;
    private int capacity;

    // No-argument constructor
    public AirplaneResponse() {
    }

    // Constructor with parameters
    public AirplaneResponse(Long id, String airplaneType, BigDecimal ticketPrice, int capacity, LocalDate departureDate, LocalDate landingDate) {
        this.id = id;
        this.airplaneType = airplaneType;
        this.ticketPrice = ticketPrice;
        this.departureDate = departureDate;
        this.landingDate = landingDate;
        this.capacity = capacity;
    }

    public AirplaneResponse(Long id, String airplaneType, BigDecimal ticketPrice, byte[] photoBytes, List<TicketResponse> tickets, int capacity, LocalDate departureDate, LocalDate landingDate) {
        this.id = id;
        this.airplaneType = airplaneType;
        this.ticketPrice = ticketPrice;
        this.photo = photoBytes != null ? Base64.encodeBase64String(photoBytes) : null;
        this.tickets = tickets;
        this.departureDate = departureDate;
        this.landingDate = landingDate;
        this.capacity = capacity;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAirplaneType() {
        return airplaneType;
    }

    public void setAirplaneType(String airplaneType) {
        this.airplaneType = airplaneType;
    }

    public BigDecimal getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(BigDecimal ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public List<TicketResponse> getTickets() {
        return tickets;
    }

    public void setTickets(List<TicketResponse> tickets) {
        this.tickets = tickets;
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

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
}
