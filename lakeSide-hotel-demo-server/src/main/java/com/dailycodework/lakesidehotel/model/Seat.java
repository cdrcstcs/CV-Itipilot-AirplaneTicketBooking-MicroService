package com.dailycodework.lakesidehotel.model;

import java.time.LocalDate;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "guest_full_name")
    private String guestFullName;

    @Column(name = "guest_email")
    private String guestEmail;

    @Column(name = "confirmation_code")
    private String seatConfirmationCode;

    @Column(name = "departureDate")
    private LocalDate departureDate;

    @Column(name = "landingDate")
    private LocalDate landingDate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "airplane_id")
    private Airplane airplane; 

    public void setSeatConfirmationCode(String seatConfirmationCode) {
        this.seatConfirmationCode = seatConfirmationCode;
    }
}
