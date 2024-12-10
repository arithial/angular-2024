package com.arithial.bookclub.server.jpa.repository;

import com.arithial.bookclub.server.jpa.BookEntity;
import org.springframework.data.domain.Pageable;
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

    @Query(value = "SELECT b FROM BookEntity b where b.author like %?1%")
    List<BookEntity> findByAuthor(String author);

    @Query(value = "SELECT b FROM BookEntity b where b.isbn = ?1")
    Optional<BookEntity> findByIsbn(String isbn);

    @Query(value = "SELECT b FROM BookEntity b LEFT JOIN b.votes v WHERE b.complete = false AND b.read = false GROUP BY b ORDER BY SUM( case when v.approved=true then 1 else 0 end) DESC")
    List<BookEntity> findUnfinishedBookEntitiesByVoteCount();

    @Query(value = "SELECT b FROM BookEntity b ORDER BY b.created ASC ")
    List<BookEntity> findAllOrderByCreated();

    @Query(value = "SELECT b FROM BookEntity b WHERE b.complete = true and b.read = false")
    Optional<BookEntity> findMonthly();

    @Query(value = "SELECT b FROM BookEntity b LEFT JOIN b.votes v WHERE b.complete = false AND b.read = false GROUP BY b ORDER BY SUM( case when v.approved=true then 1 else 0 end) DESC")
    List<BookEntity> findUnfinishedBookEntitiesByVoteCount(Pageable pageable);

    @Query(value = "SELECT COUNT(b) FROM BookEntity b WHERE b.complete = false AND b.read = false")
    int countUnfinished();

    @Query(value = "SELECT b FROM BookEntity b WHERE b.complete = true AND b.read = true order by b.created DESC")
    List<BookEntity> findFinished(Pageable pageable);

    @Query(value = "SELECT COUNT(b) FROM BookEntity b WHERE b.complete = true AND b.read = true")
    int countFinished();
}
