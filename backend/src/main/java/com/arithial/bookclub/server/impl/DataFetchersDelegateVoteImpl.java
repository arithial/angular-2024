package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.Book;
import com.arithial.bookclub.server.Vote;
import com.arithial.bookclub.server.jpa.VoteEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import com.arithial.bookclub.server.jpa.repository.VoteRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateVote;
import com.github.dozermapper.core.Mapper;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.dataloader.BatchLoaderEnvironment;
import org.dataloader.DataLoader;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
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
    @Resource
    Util util;


    @Override
    public CompletableFuture<Book> book(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, Book> dataLoader, Vote origin) {
        Optional<VoteEntity> byId = voteRepository.findById(origin.getId());
        if (byId.isPresent()) {
            return dataLoader.load(byId.get().getBook().getId());
        }
        else {
            return dataLoader.load(UUID.randomUUID());
        }
    }

    @Override
    public Book book(DataFetchingEnvironment dataFetchingEnvironment, Vote origin) {
        return bookRepository.findById(origin.getBook().getId()).map(bookEntity -> mapper.map(bookEntity, Book.class)).orElse(null);
    }

    @Override
    public List<Vote> unorderedReturnBatchLoader(List<UUID> keys, BatchLoaderEnvironment environment) {
        Iterable<VoteEntity> allById = voteRepository.findAllById(keys);
        List<VoteEntity> votes = new ArrayList<>();
        allById.forEach(votes::add);
        return votes.stream().map(util::toVote).toList();
    }
}
