package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.Vote;
import com.arithial.bookclub.server.VoteMutationResponse;
import com.arithial.bookclub.server.jpa.VoteEntity;
import com.arithial.bookclub.server.jpa.repository.VoteRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateVoteMutationResponse;
import com.github.dozermapper.core.Mapper;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.dataloader.DataLoader;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
public class DataFetchersDelegateVoteMutationResponseImpl implements DataFetchersDelegateVoteMutationResponse {

    @Resource
    Mapper mapper;
    @Resource
    VoteRepository voteRepository;

    @Override
    public CompletableFuture<Vote> vote(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, Vote> dataLoader, VoteMutationResponse origin) {
        Optional<VoteEntity> vote = voteRepository.findById(origin.getVote().getId());
        if (vote.isPresent()) {
            return dataLoader.load(vote.get().getId());
        }
        else {
            return dataLoader.load(UUID.randomUUID());
        }
    }

    @Override
    public Vote vote(DataFetchingEnvironment dataFetchingEnvironment, VoteMutationResponse origin) {

        return voteRepository.findById(origin.getVote().getId()).map(vote -> mapper.map(vote, Vote.class)).orElse(null);
    }
}
