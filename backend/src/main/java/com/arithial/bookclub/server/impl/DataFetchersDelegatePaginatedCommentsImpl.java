package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.Book;
import com.arithial.bookclub.server.Comment;
import com.arithial.bookclub.server.PaginatedComments;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.CommentEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.jpa.repository.CommentsRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegatePaginatedComments;
import com.github.dozermapper.core.Mapper;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.dataloader.DataLoader;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
public class DataFetchersDelegatePaginatedCommentsImpl implements DataFetchersDelegatePaginatedComments {

    @Resource
    BookRepository bookRepository;
    @Resource
    Util util;
    @Resource
    private CommentsRepository commentsRepository;

    @Override
    public CompletableFuture<Book> book(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, Book> dataLoader, PaginatedComments origin) {
        Book book = origin.getBook();
        Optional<BookEntity> bookEntity = bookRepository.findById(book.getId());
        if (!bookEntity.isPresent()) {
            return dataLoader.load(UUID.randomUUID());
        }
        return dataLoader.load(bookEntity.get().getId());
    }

    @Override
    public Book book(DataFetchingEnvironment dataFetchingEnvironment, PaginatedComments origin) {
        Book book = origin.getBook();
        Optional<BookEntity> bookEntity = bookRepository.findById(book.getId());
        if (!bookEntity.isPresent()) {
            return null;
        }
        return bookEntity.map(util::toBook).orElse(null);
    }

    @Override
    public List<Comment> comments(DataFetchingEnvironment dataFetchingEnvironment, PaginatedComments origin) {
        List<UUID> commentIds = origin.getComments().stream().map(Comment::getId).collect(java.util.stream.Collectors.toList());
        Iterable<CommentEntity> allById = commentsRepository.findAllById(commentIds);
        List<CommentEntity> comments = new ArrayList<>();
        allById.forEach(comments::add);
        return comments.stream().map(util::toComment).collect(java.util.stream.Collectors.toList());
    }
}
