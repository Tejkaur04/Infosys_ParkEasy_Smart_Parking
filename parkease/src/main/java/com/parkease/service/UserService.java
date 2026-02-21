package com.parkease.service;

import org.springframework.stereotype.Service;

import com.parkease.model.User;
import com.parkease.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;

    public String register(User user){

        if(repo.findByEmail(user.getEmail()).isPresent()){
            return "User already exists";
        }

        repo.save(user);
        return "Signup successful";
    }

    public String login(String email,String password){

        var user = repo.findByEmail(email);

        if(user.isEmpty())
            return "User not found";

        if(!user.get().getPassword().equals(password))
            return "Wrong password";

        return "Login successful";
    }
}