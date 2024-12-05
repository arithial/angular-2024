package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.Book;
import com.arithial.bookclub.server.BookMutationResponse;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateBookMutationResponse;
import com.github.dozermapper.core.Mapper;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.dataloader.DataLoader;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
public class DataFetchersDelegateBookMutationResponseImpl implements DataFetchersDelegateBookMutationResponse {

    @Resource
    private Mapper mapper;
    @Resource
    private BookRepository bookRepository;

    @Override
    public CompletableFuture<Book> book(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, Book> dataLoader, BookMutationResponse origin) {
        Optional<BookEntity> byId = findFromOrigin(origin);
        if (byId.isPresent()) {
            return dataLoader.load(byId.get().getId());
        } else {
            return dataLoader.load(UUID.randomUUID());
        }
    }

    private Optional<BookEntity> findFromOrigin(BookMutationResponse origin) {
        return bookRepository.findById(origin.getBook().getId());
    }

    @Override
    public Book book(DataFetchingEnvironment dataFetchingEnvironment, BookMutationResponse origin) {
        return findFromOrigin(origin).map(bookEntity -> mapper.map(bookEntity, Book.class)).orElse(null);
    }
}
