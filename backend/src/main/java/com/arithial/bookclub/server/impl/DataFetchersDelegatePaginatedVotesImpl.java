package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.PaginatedVotes;
import com.arithial.bookclub.server.Vote;
import com.arithial.bookclub.server.util.DataFetchersDelegatePaginatedVotes;
import graphql.schema.DataFetchingEnvironment;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataFetchersDelegatePaginatedVotesImpl implements DataFetchersDelegatePaginatedVotes {
    @Override
    public List<Vote> votes(DataFetchingEnvironment dataFetchingEnvironment, PaginatedVotes origin) {
        return origin.getVotes();
    }
}
