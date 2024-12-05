package com.arithial.bookclub.server.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;

import org.springframework.stereotype.Component;

import com.github.dozermapper.core.Mapper;

/**
 * A Spring bean that contains various utilities
 *
 * @author etienne-sf
 */
@Component
public class Util {

    /**
     * The <A HREF="http://dozer.sourceforge.net/">Dozer mapper</A> will allow the mapping between the JPA Entities
     * (that are mapped to the database) and the GraphQL objects (that are mapped to the GraphQL schema)
     */
    @Resource
    private Mapper mapper;

    @Resource
    UserRepository userRepository;

    /**
     * Maps an {@link Iterable} of a given source class a list of target class.
     *
     * @param <S>
     *            The source class
     * @param <T>
     *            The target class
     * @param sources
     *            The {@link Iterable} of source instances.
     * @param sourceClass
     *            The source class
     * @param targetClass
     *            The target class
     * @return The list of target classes, where each instance is mapped from the source class found in <I>sources</I>.
     *         It returns null if <I>sources</I> is null.
     */
    <S, T> List<T> mapList(Iterable<S> sources, Class<S> sourceClass, Class<T> targetClass) {
        if (sources == null)
            return null;

        List<T> ret = new ArrayList<>();
        for (S s : sources) {
            ret.add(mapper.map(s, targetClass));
        } // for

        return ret;
    }

    @PostConstruct
    public void init() {
        Optional<UserEntity> admin = userRepository.findByUsername("admin");
        if(!admin.isPresent())
        {
            UserEntity user = new UserEntity();
            user.setUsername("admin");
            user.setPassword("password");
            user.setAdmin(true);
            user.setEmail("test@test.test");
            userRepository.save(user);
        }
    }

}