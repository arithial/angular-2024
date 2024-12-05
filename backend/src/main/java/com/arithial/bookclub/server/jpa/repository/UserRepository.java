package com.arithial.bookclub.server.jpa.repository;

import com.arithial.bookclub.server.jpa.UserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends PagingAndSortingRepository<UserEntity, UUID>, CrudRepository<UserEntity, UUID> {

    @Query("SELECT u FROM UserEntity u WHERE u.username = ?1 and u.password = ?2")
    Optional<UserEntity> findByUsernameAndPassword(String username, String password);

    @Query("SELECT u FROM UserEntity u WHERE u.username = ?1")
    Optional<UserEntity> findByUsername(String username);

    @Query("SELECT u FROM UserEntity u WHERE u.email = ?1")
    Optional<UserEntity> findByEmail(String email);

    @Query("SELECT COUNT(u) FROM UserEntity u")
    int getCount();
}
