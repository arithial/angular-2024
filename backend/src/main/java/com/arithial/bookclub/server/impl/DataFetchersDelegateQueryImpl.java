package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.*;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.CommentEntity;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.VoteEntity;
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

import java.util.*;
import java.util.stream.Collectors;

@Component
public class DataFetchersDelegateQueryImpl implements DataFetchersDelegateQuery {

    @Resource
    BookRepository bookRepository;
    @Resource
    UserRepository userRepository;
    @Resource
    private CommentsRepository commentsRepository;
    @Resource
    VoteRepository voteRepository;
    @Resource
    private Util util;

    @Override
    public LoginResponse loginToken(DataFetchingEnvironment dataFetchingEnvironment, String username, String password) {
        LoginResponse.Builder builder = LoginResponse.builder();
        Optional<UserEntity> user = userRepository.findByUsernameAndPassword(username, Base64.getEncoder().encodeToString(password.getBytes()));
        if (user.isPresent()) {
            builder.withCode(HttpStatus.OK.value()).withMessage("Login Successful").withSuccess(true).withToken(user.get().getId().toString());
        } else {
            builder.withCode(HttpStatus.UNAUTHORIZED.value()).withMessage("Login Failed").withSuccess(false);
        }
        return builder.build();
    }

    @Override
    public Book book(DataFetchingEnvironment dataFetchingEnvironment, UUID id) {
        Optional<UserEntity> loggedUser = getCurrentlyLoggedUser(dataFetchingEnvironment);
        return bookRepository.findById(id).map(book -> util.toBook(book, loggedUser.orElse(null))).orElse(null);
    }



    @Override
    public List<Book> books(DataFetchingEnvironment dataFetchingEnvironment) {
        List<BookEntity> books = new ArrayList<>();
        bookRepository.findAll().forEach(books::add);
        Optional<UserEntity> loggedUser = getCurrentlyLoggedUser(dataFetchingEnvironment);

        return books.stream().map(book -> util.toBook(book, loggedUser.orElse(null))).collect(Collectors.toList());
    }

    @Override
    public User currentUser(DataFetchingEnvironment dataFetchingEnvironment) {
        Optional<UserEntity> authUser = getCurrentlyLoggedUser(dataFetchingEnvironment);
        return authUser.map(util::toUser).orElse(null);
    }

    @Override
    public PaginatedComments paginatedCommentsByBook(DataFetchingEnvironment dataFetchingEnvironment, UUID bookId, Integer limit, Integer offset) {
        PaginatedComments.Builder builder = PaginatedComments.builder();
        Optional<BookEntity> book = bookRepository.findById(bookId);
        if (!book.isPresent()) {
            return builder.build();
        }
        Optional<UserEntity> loggedUser = getCurrentlyLoggedUser(dataFetchingEnvironment);

        Pageable pageable = Pageable.ofSize(limit).withPage(offset);
        BookEntity bookEntity = book.get();
        Page<CommentEntity> comments = commentsRepository.findCommentEntitiesByBook(bookEntity, pageable);
        builder.withBook(util.toBook(bookEntity, loggedUser.orElse(null)));
        builder.withStartPage(offset);
        builder.withCount(limit);
        builder.withTotal(commentsRepository.countByBook(bookEntity));
        builder.withComments(comments.getContent().stream().map(util::toComment).collect(Collectors.toList()));
        return builder.build();
    }

    @Override
    public List<Book> searchBooksByAuthor(DataFetchingEnvironment dataFetchingEnvironment, String name) {
        Optional<UserEntity> loggedUser = getCurrentlyLoggedUser(dataFetchingEnvironment);

        return bookRepository.findByAuthor(name).stream().map(util::toBook).collect(Collectors.toList());
    }


    @Override
    public PaginatedBooks paginatedBooks(DataFetchingEnvironment dataFetchingEnvironment, Integer limit, Integer offset) {
        PaginatedBooks.Builder builder = PaginatedBooks.builder();
        Pageable pageable = Pageable.ofSize(limit).withPage(offset);
        Page<BookEntity> books = bookRepository.findAll(pageable);
        builder.withStartPage(offset);
        builder.withCount(limit);
        builder.withTotal(bookRepository.getCount());
        builder.withBooks(books.getContent().stream().map(util::toBook).collect(Collectors.toList()));
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
        builder.withUsers(users.getContent().stream().map(util::toUser).collect(Collectors.toList()));
        return builder.build();
    }

    @Override
    public PaginatedVotes paginatedUserVotes(DataFetchingEnvironment dataFetchingEnvironment, Integer limit, Integer page) {

        Optional<UserEntity> authUser = getCurrentlyLoggedUser(dataFetchingEnvironment);
        if(!authUser.isPresent())
        {
            throw new UnauthorizedException("Unauthorized");
        }
        Pageable pageable = Pageable.ofSize(limit).withPage(page);
        List<VoteEntity> votes =  voteRepository.findByUser(authUser.get(), pageable);
        int totalCount = voteRepository.countByUser(authUser.get());
        PaginatedVotes.Builder builder = PaginatedVotes.builder();
        builder.withStartPage(page);
        builder.withCount(limit);
        builder.withTotal(totalCount);
        builder.withVotes(votes.stream().map(util::toVote).collect(Collectors.toList()));
        return builder.build();
    }

    @Override
    public PaginatedBooks unfinishedBooks(DataFetchingEnvironment dataFetchingEnvironment, Integer limit, Integer page) {
        Pageable pageable = Pageable.ofSize(limit).withPage(page);
        List<BookEntity> unfinished = bookRepository.findUnfinishedBookEntitiesByVoteCount(pageable);
        int totalCount = bookRepository.countUnfinished();
        PaginatedBooks.Builder builder = PaginatedBooks.builder();
        builder.withStartPage(page);
        builder.withCount(limit);
        builder.withTotal(totalCount);
        UserEntity loggedUser = getCurrentlyLoggedUser(dataFetchingEnvironment).orElse(null);
        builder.withBooks(unfinished.stream().map(book -> util.toBook(book, loggedUser)).collect(Collectors.toList()));
        return builder.build();
    }

    @Override
    public PaginatedBooks finishedBooks(DataFetchingEnvironment dataFetchingEnvironment, Integer limit, Integer page) {

        Pageable pageable = Pageable.ofSize(limit).withPage(page);
        List<BookEntity> finished = bookRepository.findFinished(pageable);
        int totalCount = bookRepository.countFinished();
        PaginatedBooks.Builder builder = PaginatedBooks.builder();
        builder.withStartPage(page);
        builder.withCount(limit);
        builder.withTotal(totalCount);
        builder.withBooks(finished.stream().map(util::toBook).collect(Collectors.toList()));
        return builder.build();
    }


    @Override
    public Book monthlyBook(DataFetchingEnvironment dataFetchingEnvironment) {
        return bookRepository.findMonthly().map(util::toBook).orElse(null);
    }

    private Optional<UserEntity> getCurrentlyLoggedUser(DataFetchingEnvironment dataFetchingEnvironment) {
        String currentUser = dataFetchingEnvironment.getGraphQlContext().get(Util.AUTH_KEY);
        if (currentUser == null) {
            return Optional.empty();
        }
        return userRepository.findById(UUID.fromString(currentUser));
    }
}
