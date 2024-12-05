package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.Book;
import com.arithial.bookclub.server.PaginatedBooks;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegatePaginatedBooks;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class DataFetchersDelegatePaginatedBooksImpl implements DataFetchersDelegatePaginatedBooks {

    @Resource
    Util util;

    @Resource
    BookRepository bookRepository;

    @Override
    public List<Book> books(DataFetchingEnvironment dataFetchingEnvironment, PaginatedBooks origin) {

        Iterable<BookEntity> allById = bookRepository.findAllById(getBookIds(origin));
        return util.mapList(allById, BookEntity.class, Book.class);
    }

    private static List<UUID> getBookIds(PaginatedBooks origin) {
        return origin.getBooks().stream().map(Book::getId).collect(Collectors.toList());
    }

}