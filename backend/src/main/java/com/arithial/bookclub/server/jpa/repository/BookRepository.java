package com.arithial.bookclub.server.jpa.repository;

import com.arithial.bookclub.server.jpa.BookEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BookRepository extends PagingAndSortingRepository<BookEntity, UUID>, CrudRepository<BookEntity, UUID> {

    @Query(value = "SELECT COUNT(b) FROM BookEntity b")
    int getCount();

    @Query(value = "SELECT b FROM BookEntity b where b.title = ?1")
    Optional<BookEntity> findByTitle(String title);

    @Query(value = "SELECT b FROM BookEntity b where b.author = ?1")
    List<BookEntity> findByAuthor(String author);

    @Query(value = "SELECT b FROM BookEntity b where b.isbn = ?1")
    Optional<BookEntity> findByIsbn(String isbn);

    @Query(value = "SELECT b FROM BookEntity b JOIN b.votes v WHERE v.approved = true AND b.complete = false AND b.read = false GROUP BY b ORDER BY COUNT(v) DESC")
    List<BookEntity> findUnfinishedBookEntitiesByVoteCount();

    @Query(value = "SELECT b FROM BookEntity b ORDER BY b.created ASC ")
    List<BookEntity> findAllOrderByCreated();

}
