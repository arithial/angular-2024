package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.*;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.VoteEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import com.arithial.bookclub.server.jpa.repository.VoteRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateBook;
import graphql.schema.DataFetchingEnvironment;
import io.micrometer.common.util.StringUtils;
import jakarta.annotation.Resource;
import org.dataloader.BatchLoaderEnvironment;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class DataFetchersDelegateBookImpl implements DataFetchersDelegateBook {

    @Resource
    Util util;

    @Resource
    BookRepository bookRepository;

    @Resource
    VoteRepository voteRepository;
    @Resource
    UserRepository userRepository;


    @Override
    public UserVote userVote(DataFetchingEnvironment dataFetchingEnvironment, Book origin) {

        String currentUser = dataFetchingEnvironment.getGraphQlContext().get(Util.AUTH_KEY);
        Optional<UserEntity> authUser;
        if(StringUtils.isNotEmpty(currentUser)) {
            authUser = userRepository.findById(UUID.fromString(currentUser));
        }
        else
        {
            authUser = Optional.empty();
        }
        Optional<BookEntity> bookEntity = bookRepository.findById(origin.getId());
        if(!bookEntity.isPresent())
        {
            throw new ResourceNotFoundException("Book not found.");
        }
        if(authUser.isPresent())
        {
            UserEntity user = authUser.get();
            Optional<VoteEntity> userVote = voteRepository.findByBookAndUser(bookEntity.get(), user);
            if(userVote.isPresent())
            {
                return new UserVote.Builder().withApprove(userVote.get().getApproved()).build();
            }
        }
        return null;
    }

    @Override
    public List<Book> unorderedReturnBatchLoader(List<UUID> keys, BatchLoaderEnvironment environment) {
        Iterable<BookEntity> books = bookRepository.findAllById(keys);
        List<BookEntity> bookEntities = new ArrayList<>();
        books.forEach(bookEntities::add);
        return bookEntities.stream().map(util::toBook).toList();

    }
}
