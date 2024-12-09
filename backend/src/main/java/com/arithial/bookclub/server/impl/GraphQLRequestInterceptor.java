package com.arithial.bookclub.server.impl;

import org.springframework.graphql.server.WebGraphQlInterceptor;
import org.springframework.graphql.server.WebGraphQlRequest;
import org.springframework.graphql.server.WebGraphQlResponse;
import org.springframework.stereotype.Component;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@Component
public class GraphQLRequestInterceptor implements WebGraphQlInterceptor {

    @Override
    public Mono<WebGraphQlResponse> intercept(WebGraphQlRequest request, Chain chain) {
        Map<String, String> headers= request.getHeaders().toSingleValueMap();
        headers.entrySet().forEach(set-> System.out.println(set.getKey() + " " + set.getValue()));
        request.configureExecutionInput((input, builder) ->
        {
            Map<String, Object> headerMap = new HashMap<>();
            headerMap.putAll(headers);
            return builder.graphQLContext(headerMap).build();
        });
        return chain.next(request);
    }
}
