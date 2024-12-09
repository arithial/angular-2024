package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.Book;
import com.arithial.bookclub.server.FinaliseVoteMutationResponse;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateFinaliseVoteMutationResponse;
import com.github.dozermapper.core.Mapper;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.dataloader.BatchLoaderEnvironment;
import org.dataloader.DataLoader;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
public class DataFetchersDelegateFinaliseVoteMutationResponseImpl implements DataFetchersDelegateFinaliseVoteMutationResponse {
    @Resource
    BookRepository bookRepository;
    @Resource
    Mapper mapper;

    @Override
    public CompletableFuture<Book> monthlySelection(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, Book> dataLoader, FinaliseVoteMutationResponse origin) {
        Optional<BookEntity> monthlyBook = bookRepository.findById(origin.getSelectedBookId());
        if (monthlyBook.isPresent()) {
            return dataLoader.load(monthlyBook.get().getId());
        } else {
            return dataLoader.load(UUID.randomUUID());
        }
    }

    @Override
    public Book monthlySelection(DataFetchingEnvironment dataFetchingEnvironment, FinaliseVoteMutationResponse origin) {
        return bookRepository.findById(origin.getSelectedBookId()).map(bookEntity -> mapper.map(bookEntity, Book.class)).orElse(null);
    }

    @Override
    public List<FinaliseVoteMutationResponse> unorderedReturnBatchLoader(List<UUID> keys, BatchLoaderEnvironment environment) {
        return DataFetchersDelegateFinaliseVoteMutationResponse.super.unorderedReturnBatchLoader(keys, environment);
    }
}
