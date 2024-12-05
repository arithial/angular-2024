package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.User;
import com.arithial.bookclub.server.UserMutationResponse;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateUserMutationResponse;
import com.github.dozermapper.core.Mapper;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.dataloader.DataLoader;
import org.springframework.stereotype.Component;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

@Component
public class DataFetchersDelegateUserMutationResponseImpl implements DataFetchersDelegateUserMutationResponse {

    @Resource
    UserRepository userRepository;
    @Resource
    Mapper mapper;

    @Override
    public CompletableFuture<User> user(DataFetchingEnvironment dataFetchingEnvironment, DataLoader<UUID, User> dataLoader, UserMutationResponse origin) {
        Optional<UserEntity> user = userRepository.findById(origin.getUser().getId());
        if (user.isPresent()) {
            return dataLoader.load(user.get().getId());
        } else {
            return dataLoader.load(UUID.randomUUID());
        }
    }

    @Override
    public User user(DataFetchingEnvironment dataFetchingEnvironment, UserMutationResponse origin) {

        return userRepository.findById(origin.getUser().getId()).map(userEntity -> mapper.map(userEntity, User.class)).orElse(null);

    }
}
