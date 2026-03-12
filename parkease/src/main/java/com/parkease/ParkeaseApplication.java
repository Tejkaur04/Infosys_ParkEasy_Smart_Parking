package com.parkease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ParkeaseApplication {

	public static void main(String[] args) {
		SpringApplication.run(ParkeaseApplication.class, args);
	}

}
