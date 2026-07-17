package com.example.CloudVault.security;

import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter
{
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;


    // This is the code that runs for every incoming HTTP request.
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // Read the "Authorization" header from the incoming HTTP request.
        // Example: Authorization: Bearer eyJhbGc...
        final String authHeader = request.getHeader("Authorization");

        // Variables to store the extracted JWT and the user's email.
        final String jwt;
        final String userEmail;

        // If there is no Authorization header OR
        // the header does not start with "Bearer ",
        // then this request does not contain a JWT.
        // Skip authentication and continue to the next filter.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Remove the "Bearer " prefix (7 characters)
        // to get only the JWT.
        jwt = authHeader.substring(7);

        try {
            // Extract the user's email (subject) from the JWT.
            userEmail = jwtService.extractUsername(jwt);

            // Continue only if:
            // 1. Email was successfully extracted.
            // 2. No authentication has already been done for this request.
            if (userEmail != null &&
                    SecurityContextHolder.getContext().getAuthentication() == null) {

                // Load the user's security details from the database
                // using the extracted email.
                UserDetails userDetails =
                        userDetailsService.loadUserByUsername(userEmail);

                // Validate the JWT by checking:
                // - Signature
                // - Expiration
                // - Username matches the loaded user
                if (jwtService.isTokenValid(jwt, userDetails)) {

                    // Create an Authentication object that represents
                    // the authenticated user.
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,                  // Authenticated user
                                    null,                         // Password not needed (already authenticated via JWT)
                                    userDetails.getAuthorities()  // User's roles/permissions
                            );

                    // Attach additional request details
                    // (e.g., client IP address, session ID).
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );

                    // Store the Authentication object in the SecurityContext.
                    // From this point onward, Spring Security considers
                    // the current request authenticated.
                    SecurityContextHolder.getContext()
                            .setAuthentication(authToken);
                }
            }
        } catch (JwtException | IllegalArgumentException ex) {
            // Token was malformed, expired, tampered with, or otherwise
            // invalid. Don't let the exception bubble up into a 500 —
            // just leave the request unauthenticated and let downstream
            // authorization rules (e.g. anyRequest().authenticated()) reject it.
            log.debug("Invalid JWT token: {}", ex.getMessage());
        }

        // Continue the request to the next filter.
        // Eventually, the request reaches the controller.
        filterChain.doFilter(request, response);
    }
}