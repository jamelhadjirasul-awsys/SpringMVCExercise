package com.spring.spring_rest.security;

import java.util.Arrays;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import com.spring.spring_rest.service.CustomUserDetailsService;

/**
 * Configures HTTP security and authentication-related beans 
 * for the application.
 */
@EnableWebSecurity 
@Configuration 
public class SecurityConfig {

    /**
     * Defines the HTTP security filter chain, allowing authentication 
     * endpoints and requiring authentication for other requests.
     *
     * @param security the HTTP security configuration to customize
     * @return the configured security filter chain
     * @throws Exception if the security configuration cannot be built
     */
    @Bean 
    SecurityFilterChain filterChain(HttpSecurity security)
            throws Exception {
        return security
                .cors(cors -> cors.configure(security))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session 
                                    .sessionCreationPolicy(
                                        SessionCreationPolicy.IF_REQUIRED))           
                .authorizeHttpRequests(auth -> auth
                                    .requestMatchers("/api/auth/**")
                                    .permitAll()
                                    .requestMatchers(HttpMethod.OPTIONS, "/**")
                                    .permitAll()
                                    .requestMatchers("/api/students/**")
                                    .hasAnyAuthority("USER", "ADMIN")
                                    .anyRequest().authenticated())
                .httpBasic(Customizer.withDefaults())
                .build();
    }

    private CustomUserDetailsService userDetailsService;

    /**
     * Creates the security configuration with the application's
     * user details service.
     *
     * @param userDetailsService the service used to load user details
     */
    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.setUserDetailsService(userDetailsService);
    }

    /**
     * Configures CORS for the frontend origins allowed to use this API.
     *
     * @return the CORS configuration source, including credential support
     */
    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000",
                                                    "http://127.0.0.1:3000")); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", 
                                                "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", 
                                            "Cache-Control", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = 
                    new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean 
    /**
     * Creates the password encoder used for stored user passwords.
     *
     * @return a BCrypt password encoder
     */
    BCryptPasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    /**
     * Obtains the configured authentication manager.
     *
     * @param authentication Spring Security's authentication configuration
     * @return the configured authentication manager
     * @throws Exception if the authentication manager cannot be obtained
     */
    AuthenticationManager authenticationManager
            (AuthenticationConfiguration authentication) throws Exception {

        return authentication.getAuthenticationManager();
    }

    /**
     * Returns the configured user details service.
     *
     * @return the user details service
     */
    public CustomUserDetailsService getUserDetailsService() {
        
        return userDetailsService;
    }

    /**
     * Sets the user details service used by this configuration.
     *
     * @param userDetailsService the user details service
     */
    public void setUserDetailsService(
                        CustomUserDetailsService userDetailsService) {

        this.userDetailsService = userDetailsService;
    }
}
