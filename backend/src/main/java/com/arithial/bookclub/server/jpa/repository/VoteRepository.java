package com.arithial.bookclub.server.jpa.repository;

import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.VoteEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VoteRepository extends CrudRepository<VoteEntity, UUID> {

    @Query(value = "SELECT v FROM VoteEntity v where v.book = ?1 and v.user = ?2")
    Optional<VoteEntity> findByBookAndUser(BookEntity book, UserEntity user);

    @Query(value = "SELECT v FROM VoteEntity v where v.book = ?1")
    List<VoteEntity> findByBook(BookEntity book);

    @Query(value = "SELECT COUNT(v) FROM VoteEntity v where v.book = ?1")
    int countByBook(BookEntity book);

    @Query(value = "SELECT COUNT(v) FROM VoteEntity v where v.approved = true and v.book = ?1")
    int countApprovedByBook(BookEntity book);
}
