package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.Book;
import com.arithial.bookclub.server.User;
import com.arithial.bookclub.server.Vote;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import com.arithial.bookclub.server.jpa.repository.VoteRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateVote;
import com.github.dozermapper.core.Mapper;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.dataloader.DataLoader;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
public class DataFetchersDelegateVoteImpl implements DataFetchersDelegateVote {

    @Resource
    Mapper mapper;
    @Resource
    UserRepository userRepository;
    @Resource
    VoteRepository voteRepository;
    @Resource
    BookRepository bookRepository;

    @Override
    public CompletableFuture<User> user(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, User> dataLoader, Vote origin) {
        Optional<UserEntity> byId = userRepository.findById(origin.getUser().getId());
        if (byId.isPresent()) {
            return dataLoader.load(byId.get().getId());
        } else {
            return dataLoader.load(UUID.randomUUID());
        }
    }

    @Override
    public User user(DataFetchingEnvironment dataFetchingEnvironment, Vote origin) {
        return  userRepository.findById(origin.getUser().getId()).map(userEntity -> mapper.map(userEntity, User.class)).orElse(null);
    }


    @Override
    public CompletableFuture<Book> book(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, Book> dataLoader, Vote origin) {
        Optional<BookEntity> byId = bookRepository.findById(origin.getBook().getId());
        if (byId.isPresent()) {
            return dataLoader.load(byId.get().getId());
        }
        else {
            return dataLoader.load(UUID.randomUUID());
        }
    }

    @Override
    public Book book(DataFetchingEnvironment dataFetchingEnvironment, Vote origin) {
        return bookRepository.findById(origin.getBook().getId()).map(bookEntity -> mapper.map(bookEntity, Book.class)).orElse(null);
    }
}
