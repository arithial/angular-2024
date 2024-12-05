package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.Comment;
import com.arithial.bookclub.server.CommentMutationResponse;
import com.arithial.bookclub.server.jpa.CommentEntity;
import com.arithial.bookclub.server.jpa.repository.CommentsRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateCommentMutationResponse;
import com.github.dozermapper.core.Mapper;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.dataloader.DataLoader;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
public class DataFetchersDelegateCommentMutationResponseImpl implements DataFetchersDelegateCommentMutationResponse {

    @Resource
    CommentsRepository commentsRepository;
    @Resource
    private Mapper mapper;


    @Override
    public CompletableFuture<Comment> comment(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, Comment> dataLoader, CommentMutationResponse origin) {
        CommentEntity comment = commentsRepository.findById(origin.getComment().getId()).orElse(null);
        if (comment == null) {
            return null;
        }
        return dataLoader.load(comment.getId());
    }

    @Override
    public Comment comment(DataFetchingEnvironment dataFetchingEnvironment, CommentMutationResponse origin) {
        CommentEntity comment = commentsRepository.findById(origin.getComment().getId()).orElse(null);
        if (comment == null) {
            return null;
        }
        return mapper.map(comment, Comment.class);
    }
}
