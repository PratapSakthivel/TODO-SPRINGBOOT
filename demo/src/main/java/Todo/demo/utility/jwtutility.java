package Todo.demo.utility;


import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtility {

    private final String SECRET_STRING = "Pratappratappratappratappratappratappratap";
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 hours
    private final Key secretKey = Keys.hmacShaKeyFor(
            SECRET_STRING.getBytes(StandardCharsets.UTF_8)
    );

    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String token) {
        try {
            extractEmail(token);
            return true;
        } catch (JwtException exception) {
            return false;
        }
    }
}
