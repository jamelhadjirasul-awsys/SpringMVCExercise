// package com.spring.spring_rest.security;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.authentication.AuthenticationManager;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import com.spring.spring_rest.service.CustomUserDetailsService;

// /**
//  * Configures HTTP security and authentication-related beans 
//  * for the application.
//  */
// @EnableWebSecurity 
// @Configuration 
// public class SecurityConfig {

//     /**
//      * Defines the HTTP security filter chain, allowing authentication 
//      * endpoints and requiring authentication for other requests.
//      *
//      * @param security the HTTP security configuration to customize
//      * @return the configured security filter chain
//      * @throws Exception if the security configuration cannot be built
//      */
//     @Bean 
//     SecurityFilterChain filterChain(HttpSecurity security)
//             throws Exception {
//         return security
//                 .csrf(AbstractHttpConfigurer::disable)
//                 .authorizeHttpRequests(auth -> auth
//                                             .requestMatchers("/api/auth/**")
//                                             .permitAll()
//                                             .anyRequest()
//                                             .authenticated())
//                 .httpBasic(Customizer.withDefaults())
//                 .build();
//     }

//     private CustomUserDetailsService userDetailsService;

//     /**
//      * Creates the security configuration with the application's
//      * user details service.
//      *
//      * @param userDetailsService the service used to load user details
//      */
//     public SecurityConfig(CustomUserDetailsService userDetailsService) {
//         this.setUserDetailsService(userDetailsService);
//     }

//     @Bean 
//     /**
//      * Creates the password encoder used for stored user passwords.
//      *
//      * @return a BCrypt password encoder
//      */
//     BCryptPasswordEncoder passwordEncoder() {

//         return new BCryptPasswordEncoder();
//     }

//     @Bean
//     /**
//      * Obtains the configured authentication manager.
//      *
//      * @param authentication Spring Security's authentication configuration
//      * @return the configured authentication manager
//      * @throws Exception if the authentication manager cannot be obtained
//      */
//     AuthenticationManager authenticationManager
//             (AuthenticationConfiguration authentication) throws Exception {

//         return authentication.getAuthenticationManager();
//     }

//     /**
//      * Returns the configured user details service.
//      *
//      * @return the user details service
//      */
//     public CustomUserDetailsService getUserDetailsService() {
        
//         return userDetailsService;
//     }

//     /**
//      * Sets the user details service used by this configuration.
//      *
//      * @param userDetailsService the user details service
//      */
//     public void setUserDetailsService(
//                         CustomUserDetailsService userDetailsService) {

//         this.userDetailsService = userDetailsService;
//     }
// }
