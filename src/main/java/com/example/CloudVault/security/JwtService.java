package com.example.CloudVault.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    // cuz JWT can't sign using plain String, so convert it into bytes.
    private SecretKey getSigningKey(){
        return Keys.hmacShaKeyFor(
                secretKey.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String generateToken(String email) {
        return Jwts.builder()
                .subject(email)
                .issuedAt(new Date())
                .expiration(new Date(
                        System.currentTimeMillis()+expiration)
                )
                .signWith(getSigningKey())
                .compact();     // converts the token into string format.
    }


    //  Multiple Steps of Extracting username form token:

    // To get claims out of token
    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)   // distributes all the components
                .getPayload();          // payload returns all the claims
    }

    // It is a Generic to extract anything from claims.
    // Function: f that accepts claims and returns something.
    public <T> T extractClaim(
            String token, Function<Claims, T> resolver) {

        Claims claims = extractAllClaims(token);

        return resolver.apply(claims);
    }

    public String extractUsername(String token) {
        return extractClaim(
                token,
                Claims::getSubject      // cuz while writing JWT, we set Jwts.builder().subject(email)
        );
    }

    public Date extractExpiration(String token) {
        return extractClaim(
                token,
                Claims::getExpiration
        );
    }

    //    Many people think isTokenValid() verifies the signature, but in most JJWT implementations, the signature is verified when you parse the token.
    public boolean isTokenValid(String jwt, UserDetails userDetails) {

        final String username = extractUsername(jwt);

        return userDetails.getUsername().equals(username)
                && !isTokenExpired(jwt);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());         // is expiration time before the current time.
    }

}