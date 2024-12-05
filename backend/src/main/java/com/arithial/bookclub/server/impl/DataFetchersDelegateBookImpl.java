package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.Book;
import com.arithial.bookclub.server.BookDetails;
import com.arithial.bookclub.server.Comment;
import com.arithial.bookclub.server.Vote;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.CommentEntity;
import com.arithial.bookclub.server.jpa.VoteEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.jpa.repository.CommentsRepository;
import com.arithial.bookclub.server.jpa.repository.VoteRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateBook;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.dataloader.BatchLoaderEnvironment;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Component
public class DataFetchersDelegateBookImpl implements DataFetchersDelegateBook {

    @Resource
    Util util;

    @Resource
    BookRepository bookRepository;
    @Resource
    CommentsRepository commentsRepository;
    @Resource
    VoteRepository voteRepository;

    @Override
    public List<Comment> comments(DataFetchingEnvironment dataFetchingEnvironment, Book origin) {
        BookEntity bookEntity = bookRepository.findById(origin.getId()).orElse(null);
        if(bookEntity == null)
        {
            return Collections.emptyList();
        }
        return util.mapList(commentsRepository.findAllByBook(bookEntity), CommentEntity.class, Comment.class);
    }

    @Override
    public List<Vote> votes(DataFetchingEnvironment dataFetchingEnvironment, Book origin) {

        BookEntity bookEntity = bookRepository.findById(origin.getId()).orElse(null);
        if(bookEntity == null)
        {
            return Collections.emptyList();
        }
        return util.mapList(voteRepository.findByBook(bookEntity), VoteEntity.class, Vote.class);
    }

    @Override
    public BookDetails details(DataFetchingEnvironment dataFetchingEnvironment, Book origin) {
        BookEntity bookEntity = bookRepository.findById(origin.getId()).orElse(null);
        if(bookEntity == null)
        {
            return null;
        }
        return new BookDetails.Builder().withDescription(bookEntity.getDescription()).withRead(bookEntity.getRead()).build();
    }

    @Override
    public List<Book> unorderedReturnBatchLoader(List<UUID> keys, BatchLoaderEnvironment environment) {
        Iterable<BookEntity> books = bookRepository.findAllById(keys);
        return util.mapList(books, BookEntity.class, Book.class);
    }
}
