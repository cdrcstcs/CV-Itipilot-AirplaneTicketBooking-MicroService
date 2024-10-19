package org.backend.model;

import jakarta.persistence.*;
import org.apache.commons.lang3.RandomStringUtils;
import java.math.BigDecimal;
import java.sql.Blob;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Airplane {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String airplaneType;
    private BigDecimal ticketPrice;

    @Column(name = "departureDate")
    private LocalDate departureDate;
    @Column(name = "landingDate")
    private LocalDate landingDate;

    @Column(name = "capacity")
    private int capacity;

    @Lob
    private Blob photo;

    @OneToMany(mappedBy = "airplane", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Ticket> tickets = new ArrayList<>();

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

    public Blob getPhoto() {
        return photo;
    }

    public void setPhoto(Blob photo) {
        this.photo = photo;
    }

    public List<Ticket> getTickets() {
        return tickets;
    }

    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }

    public void addTicket(Ticket ticket) {
        tickets.add(ticket);
        capacity++;
        ticket.setAirplane(this);
        ticket.setDepartureDate(this.departureDate);
        ticket.setLandingDate(this.landingDate);
        ticket.setTicketPrice(this.ticketPrice);
        String ticketCode = RandomStringUtils.randomNumeric(10);
        ticket.setTicketConfirmationCode(ticketCode);
    }
}
