package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.PaginatedUsers;
import com.arithial.bookclub.server.User;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegatePaginatedUsers;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class DataFetchersDelegatePaginatedUsersImpl implements DataFetchersDelegatePaginatedUsers {
    @Resource
    UserRepository userRepository;
    @Resource
    Util util;

    @Override
    public List<User> users(DataFetchingEnvironment dataFetchingEnvironment, PaginatedUsers origin) {
        List<UUID> userUUIDs = origin.getUsers().stream().map(User::getId).collect(Collectors.toList());
        Iterable<UserEntity> allById = userRepository.findAllById(userUUIDs);
        List<UserEntity> users = new ArrayList<>();
        allById.forEach(users::add);
        return users.stream().map(util::toUser).toList();
    }
}
