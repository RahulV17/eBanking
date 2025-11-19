package com.jsp.ebanking.mapper;


import com.jsp.ebanking.dto.UserDto;
import com.jsp.ebanking.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

@Mapper(componentModel = "spring")
public abstract class UserMapper {

	@Autowired
	protected PasswordEncoder passwordEncoder;

	@Mapping(target = "password", expression = "java(passwordEncoder.encode(dto.getPassword()))")
	public abstract User toEntity(UserDto dto);

	@Mapping(target = "password",expression = "java(\"***************\")")
	public abstract UserDto toDto(User user);

}