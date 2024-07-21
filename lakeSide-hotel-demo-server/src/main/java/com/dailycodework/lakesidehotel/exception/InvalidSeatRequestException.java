package com.dailycodework.lakesidehotel.exception;

/**
 * @author Simpson Alfred
 */

public class InvalidSeatRequestException extends RuntimeException {
    public InvalidSeatRequestException(String message) {
        super(message);
    }
}
