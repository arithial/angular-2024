package com.arithial.bookclub.server.impl;

import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.graphql.server.WebGraphQlRequest;
import org.springframework.graphql.server.WebGraphQlResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.Map;

@Component
public class GraphQLRequestInterceptor implements WebGraphQlInterceptor {
    @Override
    public Mono<WebGraphQlResponse> intercept(WebGraphQlRequest request, Chain chain) {
        Map headers= request.getHeaders().toSingleValueMap();
        request.configureExecutionInput((input, builder) ->
        {
            return builder.graphQLContext(headers).build();
        });
        return chain.next(request);
    }
}
