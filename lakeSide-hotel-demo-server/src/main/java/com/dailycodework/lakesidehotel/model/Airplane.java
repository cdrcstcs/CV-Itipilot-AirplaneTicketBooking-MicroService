package com.dailycodework.lakesidehotel.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.RandomStringUtils;

import java.math.BigDecimal;
import java.sql.Blob;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
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
    private List<Seat> seats = new ArrayList<>();

    public void addSeat(Seat seat) {
        seats.add(seat);
        capacity = capacity + 1;
        seat.setAirplane(this);
        String seatCode = RandomStringUtils.randomNumeric(10);
        seat.setSeatConfirmationCode(seatCode);
    }
}
