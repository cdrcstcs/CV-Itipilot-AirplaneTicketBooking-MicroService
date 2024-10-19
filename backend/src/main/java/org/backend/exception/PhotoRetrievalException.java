package org.backend.exception;

public class PhotoRetrievalException extends RuntimeException{
    public PhotoRetrievalException(String message){
        super(message);
    }
}
