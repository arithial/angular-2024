package com.arithial.bookclub.server.jpa.repository;

import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.CommentEntity;
import com.arithial.bookclub.server.jpa.UserEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.UUID;

public interface CommentsRepository extends PagingAndSortingRepository<CommentEntity, UUID>, CrudRepository<CommentEntity, UUID> {


    @Query("SELECT c FROM CommentEntity c WHERE c.book = ?1 order by c.created ASC ")
    Page<CommentEntity> findCommentEntitiesByBook(BookEntity book, Pageable pageable);

    @Query("SELECT c FROM CommentEntity c WHERE c.book = ?1 order by c.created ASC ")
    List<CommentEntity> findAllByBook(BookEntity book);

    @Query("DELETE FROM CommentEntity c WHERE c.book = ?1")
    boolean deleteAllByBook(BookEntity book);

    @Query("DELETE FROM CommentEntity c WHERE c.user = ?1")
    boolean deleteAllByUser(UserEntity user);

    @Query("SELECT COUNT(c) FROM CommentEntity c WHERE c.book = ?1")
    int countByBook(BookEntity book);

    @Query("SELECT COUNT(c) FROM CommentEntity c")
    int totalCount();
}
