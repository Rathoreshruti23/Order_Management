package com.shrunity.Itfirm.util;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

    @Component
    public class JwtUtil {

        @Value("${jwt.secret}")
        private String secret;

        @Value("${jwt.expiration.ms}")
        private long expirationMs;

        private SecretKey getSigningKey() {
            return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        }

        public String generateToken(UserDetails userDetails) {
            Map<String, Object> claims = new HashMap<>();
            claims.put("roles", userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority).toList());

            return Jwts.builder()
                    .claims(claims)
                    .subject(userDetails.getUsername())
                    .issuedAt(new Date())
                    .expiration(new Date(System.currentTimeMillis() + expirationMs))
                    .signWith(getSigningKey(), Jwts.SIG.HS256)
                    .compact();
        }

        public String extractUsername(String token) {
            return extractClaims(token).getSubject();
        }

        public boolean isTokenValid(String token, UserDetails userDetails) {
            final String username = extractUsername(token);
            return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        }

        private boolean isTokenExpired(String token) {
            return extractClaims(token).getExpiration().before(new Date());
        }

        private Claims extractClaims(String token) {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        }
}
