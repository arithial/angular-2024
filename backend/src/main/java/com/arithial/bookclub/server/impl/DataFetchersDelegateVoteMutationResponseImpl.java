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
    @Resource
    Util util;

    @Override
    public CompletableFuture<Vote> vote(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, Vote> dataLoader, VoteMutationResponse origin) {
        if(origin.getVoteId() == null) {
            return dataLoader.load(UUID.randomUUID());
        }
        Optional<VoteEntity> vote = voteRepository.findById(origin.getVoteId());
        if (vote.isPresent()) {
            return dataLoader.load(vote.get().getId());
        }
        else {
            return dataLoader.load(UUID.randomUUID());
        }
    }

    @Override
    public Vote vote(DataFetchingEnvironment dataFetchingEnvironment, VoteMutationResponse origin) {

        return voteRepository.findById(origin.getVoteId()).map(util::toVote).orElse(null);
    }
}
