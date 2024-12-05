package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.User;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateUser;
import jakarta.annotation.Resource;
import org.dataloader.BatchLoaderEnvironment;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class DataFetchersDelegateUserImpl implements DataFetchersDelegateUser {

    @Resource
    Util util;
    @Resource
    UserRepository userRepository;



    @Override
    public List<User> unorderedReturnBatchLoader(List<UUID> keys, BatchLoaderEnvironment environment) {
        return util.mapList(userRepository.findAllById(keys), UserEntity.class, User.class);
    }
}
