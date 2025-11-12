package com.jsp.ebanking.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DataNotFoundException extends RuntimeException{

	private String message = "Data Not Found";
}
