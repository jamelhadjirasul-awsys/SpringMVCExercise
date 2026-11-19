// package com.spring.spring_rest.service;

// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.User;
// import org.springframework.security.core.userdetails.UsernameNotFoundException;
// import org.springframework.security.core.GrantedAuthority;
// import org.springframework.security.core.authority.SimpleGrantedAuthority;
// import org.springframework.stereotype.Service;
// import java.util.Collection;
// import java.util.List;
// import java.util.stream.Collectors;
// import com.spring.spring_rest.entity.Auth_User;
// import com.spring.spring_rest.entity.Auth_Role;
// import com.spring.spring_rest.repository.AuthUserRepository;

// /**
//  * Loads authentication users and converts their roles to 
//  * Spring Security authorities.
//  */
// @Service 
// public class CustomUserDetailsService implements UserDetailsService {

//     private final AuthUserRepository authUserRepo;

//     /**
//      * Creates the service with the repository used to look up users.
//      *
//      * @param authUserRepo the authentication user repository
//      */
//     public CustomUserDetailsService(AuthUserRepository authUserRepo) {
//         this.authUserRepo = authUserRepo;
//     }

//     /**
//      * Loads a user and their authorities by username.
//      *
//      * @param theUsername the username to look up
//      * @return Spring Security details for the matching user
//      * @throws UsernameNotFoundException if no user has the supplied username
//      */
//     public UserDetails loadUserByUsername(String theUsername) {
//         Auth_User user = authUserRepo.findByUsername(theUsername)
//                 .orElseThrow(() -> new UsernameNotFoundException(
//                             "Username " + theUsername + " does not exist"));

//         return new User(user.getUsername(),
//                         user.getPassword(),
//                         mapRolesToAuthorities(user.getRoles()));
//     }

//     private Collection<GrantedAuthority> 
//                 mapRolesToAuthorities(List<Auth_Role> roles) {

//         return roles.stream().map(role -> new SimpleGrantedAuthority(
//                                 role.getName())).collect(Collectors.toList());
//     }
// }
