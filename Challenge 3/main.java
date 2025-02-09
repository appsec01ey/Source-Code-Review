package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import javax.xml.bind.DatatypeConverter;
import java.util.HashMap;
import java.util.Map;

@SpringBootApplication
@RestController
public class DemoApplication {

    private Map<String, String> userDatabase = new HashMap<>();

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @PostMapping("/register")
    public String registerUser(@RequestParam String username, @RequestParam String password) {
        String hashedPassword = hashPassword(password);
        userDatabase.put(username, hashedPassword);
        return "User registered successfully";
    }

    @PostMapping("/login")
    public String loginUser(@RequestParam String username, @RequestParam String password) {
        String hashedPassword = userDatabase.get(username);
        if (hashedPassword != null && hashedPassword.equals(hashPassword(password))) {
            return "Login successful";
        }
        return "Invalid username or password";
    }

    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            md.update(password.getBytes());
            byte[] digest = md.digest();
            return DatatypeConverter.printHexBinary(digest).toUpperCase();
        } catch (NoSuchAlgorithmException e) {
            return "Error: Hashing algorithm not found";
        }
    }

    // retrieving all usernames (simulated admin functionality)
    @GetMapping("/admin/usernames")
    public Map<String, String> getAllUsernames() {
        return userDatabase;
    }
}

/* 
Solution : 
 1. Well multiple issues exist in the code but the expected ans was regarding weak cryptography i.e MD5 being used to hash passwords 
 2. MD5 is vulnerable to hash collision attacks and is not secure enough to store sensitive data like passwords 
 3. Instead bcrypt , pbkdf2 should be used.
 4. Few people recommend SHA256 to hash and store the passwords but problem with SHA256 is its comparitively high work factor 
   Work Factor : The work factor (also known as computational cost or security factor) in hashing refers to the amount of computational effort required to compute a hash function.
                 It is designed to slow down brute-force and dictionary attacks against hashed passwords.
  Soln snippet : String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt(12)); Here 12 means 2^12 = 4096 rounds , making bruteforce attacks slower

*/
