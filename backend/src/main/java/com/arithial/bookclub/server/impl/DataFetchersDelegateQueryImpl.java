package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.*;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.CommentEntity;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.jpa.repository.CommentsRepository;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import com.arithial.bookclub.server.jpa.repository.VoteRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateQuery;
import com.github.dozermapper.core.Mapper;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class DataFetchersDelegateQueryImpl implements DataFetchersDelegateQuery {

    @Resource
    Util util;
    @Resource
    BookRepository bookRepository;
    @Resource
    UserRepository userRepository;
    @Resource
    private CommentsRepository commentsRepository;
    @Resource
    VoteRepository voteRepository;
    @Resource
    Mapper mapper;
    @Override
    public LoginResponse loginToken(DataFetchingEnvironment dataFetchingEnvironment, String username, String password) {
        LoginResponse.Builder builder = LoginResponse.builder();
        Optional< UserEntity> user = userRepository.findByUsernameAndPassword(username, Base64.getEncoder().encodeToString(password.getBytes()));
        if(user.isPresent()){
            builder.withCode(HttpStatus.OK.value()).withMessage("Login Successful").withSuccess(true).withToken(user.get().getId().toString());
        }
        else
        {
            builder.withCode(HttpStatus.UNAUTHORIZED.value()).withMessage("Login Failed").withSuccess(false);
        }
        return builder.build();
    }

    @Override
    public Book book(DataFetchingEnvironment dataFetchingEnvironment, UUID id) {
        return bookRepository.findById(id).map(bookEntity -> mapper.map(bookEntity, Book.class)).orElse(null);
    }

    @Override
    public User currentUser(DataFetchingEnvironment dataFetchingEnvironment) {
        String currentUser = dataFetchingEnvironment.getGraphQlContext().get("Auth");
        Optional<UserEntity> authUser = userRepository.findById(UUID.fromString(currentUser));
        return authUser.map(userEntity -> mapper.map(userEntity, User.class)).orElse(null);
    }

    @Override
    public List<Comment> comments(DataFetchingEnvironment dataFetchingEnvironment) {
        return util.mapList(commentsRepository.findAll(), CommentEntity.class, Comment.class);
    }

    @Override
    public PaginatedComments paginatedCommentsByBook(DataFetchingEnvironment dataFetchingEnvironment, UUID bookId, Integer limit, Integer offset) {
        PaginatedComments.Builder builder = PaginatedComments.builder();
        Optional<BookEntity> book = bookRepository.findById(bookId);
        if(!book.isPresent())
        {
            return builder.build();
        }
        Pageable pageable = Pageable.ofSize(limit).withPage(offset);
        BookEntity bookEntity = book.get();
        Page<CommentEntity> comments = commentsRepository.findCommentEntitiesByBook(bookEntity,pageable);
        builder.withBook(mapper.map(bookEntity, Book.class));
        builder.withStartPage(offset);
        builder.withCount(limit);
        builder.withTotal(commentsRepository.countByBook(bookEntity));
        builder.withComments(util.mapList(comments.getContent(), CommentEntity.class, Comment.class));
        return builder.build();
    }

    @Override
    public List<Book> searchBooksByAuthor(DataFetchingEnvironment dataFetchingEnvironment, String name) {
        return bookRepository.findByAuthor(name).stream().map(bookEntity -> mapper.map(bookEntity, Book.class)).collect(Collectors.toList());
    }

    @Override
    public PaginatedBooks paginatedBooks(DataFetchingEnvironment dataFetchingEnvironment, Integer limit, Integer offset) {
        PaginatedBooks.Builder builder = PaginatedBooks.builder();
        Pageable pageable = Pageable.ofSize(limit).withPage(offset);
        Page<BookEntity> books = bookRepository.findAll(pageable);
        builder.withStartPage(offset);
        builder.withCount(limit);
        builder.withTotal(bookRepository.getCount());
        builder.withBooks(util.mapList(books.getContent(), BookEntity.class, Book.class));
        return builder.build();
    }

    @Override
    public PaginatedUsers paginatedUsers(DataFetchingEnvironment dataFetchingEnvironment, Integer limit, Integer offset) {
        PaginatedUsers.Builder builder = PaginatedUsers.builder();
        Pageable pageable = Pageable.ofSize(limit).withPage(offset);
        Page<UserEntity> users = userRepository.findAll(pageable);
        builder.withStartPage(offset);
        builder.withCount(limit);
        builder.withTotal(userRepository.getCount());
        builder.withUsers(util.mapList(users.getContent(), UserEntity.class, User.class));
        return builder.build();
    }

    @Override
    public List<Book> unfinishedBooks(DataFetchingEnvironment dataFetchingEnvironment) {

        return bookRepository.findUnfinishedBookEntitiesByVoteCount().stream().map(bookEntity -> mapper.map(bookEntity, Book.class)).collect(Collectors.toList());
    }
}
