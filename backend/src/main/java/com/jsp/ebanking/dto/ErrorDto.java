package com.jsp.ebanking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ErrorDto {
	private Object error;
	private String message;

	public ErrorDto(Object error) {
		this.error = error;
		this.message = String.valueOf(error);
	}
}
