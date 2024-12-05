package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.Book;
import com.arithial.bookclub.server.Comment;
import com.arithial.bookclub.server.User;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.CommentEntity;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.jpa.repository.CommentsRepository;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateComment;
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
public class DataFetchersDelegateCommentImpl implements DataFetchersDelegateComment {

    @Resource
    Util util;
    @Resource
    BookRepository bookRepository;
    @Resource
    CommentsRepository commentsRepository;
    @Resource
    UserRepository userRepository;
    @Resource
    private Mapper mapper;

    @Override
    public CompletableFuture<User> user(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, User> dataLoader, Comment origin) {
        CommentEntity comment = commentsRepository.findById(origin.getId()).get();

        return dataLoader.load(comment.getUser().getId());
    }

    @Override
    public User user(DataFetchingEnvironment dataFetchingEnvironment, Comment origin) {
        CommentEntity comment = commentsRepository.findById(origin.getId()).orElse(null);
        if (comment == null) {
            return null;
        }
        Optional<UserEntity> byId = userRepository.findById(comment.getUser().getId());
        if (byId.isPresent()) {
            return mapper.map(byId.orElse(null), User.class);
        }
        return null;
    }

    @Override
    public CompletableFuture<Book> book(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, Book> dataLoader, Comment origin) {
        CommentEntity comment = commentsRepository.findById(origin.getId()).orElse(null);
        if (comment == null) {
            return dataLoader.load(UUID.randomUUID());
        }
        return dataLoader.load(comment.getBook().getId());
    }

    @Override
    public Book book(DataFetchingEnvironment dataFetchingEnvironment, Comment origin) {
        CommentEntity comment = commentsRepository.findById(origin.getId()).orElse(null);
        if (comment == null) {
            return null;
        }
        Optional<BookEntity> byId = bookRepository.findById(comment.getBook().getId());
        if (byId.isPresent()) {
            return mapper.map(byId.orElse(null), Book.class);
        }
        return null;
    }

    @Override
    public List<Comment> unorderedReturnBatchLoader(List<UUID> keys, BatchLoaderEnvironment environment) {
        Iterable<CommentEntity> comments = commentsRepository.findAllById(keys);
        return util.mapList(comments, CommentEntity.class, Comment.class);
    }
}
