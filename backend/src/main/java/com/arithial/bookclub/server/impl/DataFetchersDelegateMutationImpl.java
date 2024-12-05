package com.arithial.bookclub.server.impl;

import com.arithial.bookclub.server.*;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.CommentEntity;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.VoteEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.jpa.repository.CommentsRepository;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import com.arithial.bookclub.server.jpa.repository.VoteRepository;
import com.arithial.bookclub.server.util.DataFetchersDelegateMutation;
import com.github.dozermapper.core.Mapper;
import graphql.schema.DataFetchingEnvironment;
import jakarta.annotation.Resource;
import org.apache.commons.lang3.StringUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.util.Base64;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Component
public class DataFetchersDelegateMutationImpl implements DataFetchersDelegateMutation {
    @Resource
    private UserRepository userRepository;
    @Resource
    CommentsRepository commentsRepository;
    @Resource
    VoteRepository voteRepository;
    @Resource
    BookRepository bookRepository;
    @Resource
    private Mapper mapper;


    @Override
    public UserMutationResponse register(DataFetchingEnvironment dataFetchingEnvironment, UserInput user) {
        UserMutationResponse.Builder responseBuilder = new UserMutationResponse.Builder();
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            responseBuilder.withCode(HttpStatus.CONFLICT.value());
            responseBuilder.withMessage("Username in use");
        } else if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            responseBuilder.withCode(HttpStatus.CONFLICT.value());
            responseBuilder.withMessage("Email in use");
        } else {
            UserEntity userEntity = new UserEntity();
            userEntity.setUsername(user.getUsername());
            userEntity.setEmail(user.getEmail());
            userEntity.setPassword(Base64.getEncoder().encodeToString(user.getPassword().getBytes()));
            UserEntity returnedEntity = userRepository.save(userEntity);
            responseBuilder.withUser(mapper.map(returnedEntity, User.class)).withMessage("User registered successfully").withCode(HttpStatus.OK.value()).withSuccess(true);
        }
        return responseBuilder.build();
    }

    @Override
    public BookMutationResponse addBook(DataFetchingEnvironment dataFetchingEnvironment, String title, String author, String description, String isbn) {
        BookMutationResponse.Builder responseBuilder = new BookMutationResponse.Builder();
        if (bookRepository.findByTitle(title).isPresent()) {
            responseBuilder.withCode(HttpStatus.CONFLICT.value());
            responseBuilder.withMessage("Book with this title already exists");
        } else if (bookRepository.findByIsbn(isbn).isPresent()) {
            responseBuilder.withCode(HttpStatus.CONFLICT.value());
            responseBuilder.withMessage("Book with this isbn already exists");
        } else {
            BookEntity bookEntity = new BookEntity();
            bookEntity.setTitle(title);
            bookEntity.setAuthor(author);
            bookEntity.setDescription(description);
            bookEntity.setIsbn(isbn);
            bookEntity.setCreated(new Date());
            BookEntity returnedEntity = bookRepository.save(bookEntity);
            responseBuilder.withBook(mapper.map(returnedEntity, Book.class)).withMessage("Book added successfully").withCode(HttpStatus.OK.value()).withSuccess(true);
        }
        return responseBuilder.build();
    }

    @Override
    public DeleteMutationResponse removeBook(DataFetchingEnvironment dataFetchingEnvironment, UUID bookId) {
        DeleteMutationResponse.Builder responseBuilder = new DeleteMutationResponse.Builder();
        Optional<BookEntity> byId = bookRepository.findById(bookId);
        if (!byId.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("Book not found").withSuccess(false);

        } else {
            try {
                bookRepository.deleteById(bookId);
                responseBuilder.withCode(HttpStatus.OK.value()).withMessage("Book deleted successfully").withSuccess(true);
            } catch (Exception e) {
                responseBuilder.withCode(HttpStatus.INTERNAL_SERVER_ERROR.value()).withMessage(e.getMessage()).withSuccess(false);
            }
        }
        return responseBuilder.build();
    }


    @Override
    public UserMutationResponse updateUserPassword(DataFetchingEnvironment dataFetchingEnvironment, UUID userId, String password) {
        UserMutationResponse.Builder responseBuilder = new UserMutationResponse.Builder();
        String currentUser = dataFetchingEnvironment.getGraphQlContext().get("Auth");
        Optional<UserEntity> authUser = userRepository.findById(UUID.fromString(currentUser));
        Optional<UserEntity> byId = userRepository.findById(userId);

        if (!authUser.isPresent() || !(authUser.get().getAdmin() && !StringUtils.equals(userId.toString(), currentUser))) {
            responseBuilder.withCode(HttpStatus.UNAUTHORIZED.value()).withMessage("User not authorized").withSuccess(false);
        } else if (!byId.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("User not found").withSuccess(false);
        } else {
            UserEntity userEntity = byId.get();
            if (userEntity.getUsername().equals(authUser.get().getUsername())) {
                userEntity.setPassword(Base64.getEncoder().encodeToString(password.getBytes()));
                userRepository.save(userEntity);
                responseBuilder.withCode(HttpStatus.OK.value()).withMessage("Password updated successfully").withSuccess(true);
            }
        }

        return responseBuilder.build();
    }

    @Override
    public UserMutationResponse updateUserEmail(DataFetchingEnvironment dataFetchingEnvironment, UUID userId, String email) {
        UserMutationResponse.Builder responseBuilder = new UserMutationResponse.Builder();
        String currentUser = dataFetchingEnvironment.getGraphQlContext().get("Auth");
        Optional<UserEntity> authUser = userRepository.findById(UUID.fromString(currentUser));
        Optional<UserEntity> byId = userRepository.findById(userId);

        if (!authUser.isPresent() || !(authUser.get().getAdmin() && !StringUtils.equals(userId.toString(), currentUser))) {
            responseBuilder.withCode(HttpStatus.UNAUTHORIZED.value()).withMessage("User not authorized").withSuccess(false);
        } else if (!byId.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("User not found").withSuccess(false);
        } else {
            UserEntity userEntity = byId.get();
            if (userEntity.getUsername().equals(authUser.get().getUsername())) {
                userEntity.setEmail(email);
                userRepository.save(userEntity);
                responseBuilder.withCode(HttpStatus.OK.value()).withMessage("Email updated successfully").withSuccess(true);
            }
        }
        return responseBuilder.build();
    }

    @Override
    public CommentMutationResponse addComment(DataFetchingEnvironment dataFetchingEnvironment, UUID userId, UUID bookId, String text) {
        CommentMutationResponse.Builder responseBuilder = new CommentMutationResponse.Builder();
        CommentEntity commentEntity = new CommentEntity();
        Optional<UserEntity> byId = userRepository.findById(userId);
        Optional<BookEntity> bookEntity = bookRepository.findById(bookId);
        if (!bookEntity.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("Book not found").withSuccess(false);
        } else if (!byId.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("User not found").withSuccess(false);
        } else {
            commentEntity.setUser(byId.get());
            commentEntity.setBook(bookEntity.get());
            commentEntity.setMessage(text);
            commentEntity.setCreated(new Date());
            CommentEntity returnedEntity = commentsRepository.save(commentEntity);
            responseBuilder.withComment(mapper.map(returnedEntity, Comment.class)).withMessage("Comment added successfully").withCode(HttpStatus.OK.value()).withSuccess(true);
        }
        return responseBuilder.build();
    }

    @Override
    public CommentMutationResponse updateComment(DataFetchingEnvironment dataFetchingEnvironment, UUID commentId, String newText) {
        CommentMutationResponse.Builder responseBuilder = new CommentMutationResponse.Builder();
        String currentUser = dataFetchingEnvironment.getGraphQlContext().get("Auth");
        Optional<UserEntity> authUser = userRepository.findById(UUID.fromString(currentUser));
        Optional<CommentEntity> byId = commentsRepository.findById(commentId);
        if (!byId.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("Comment not found").withSuccess(false);
        } else if (!authUser.isPresent() || !(authUser.get().getAdmin() && !StringUtils.equals(byId.get().getUser().getId().toString(), currentUser))) {
            responseBuilder.withCode(HttpStatus.UNAUTHORIZED.value()).withMessage("User not authorized").withSuccess(false);
        } else {
            CommentEntity commentEntity = byId.get();
            commentEntity.setMessage(newText);
            CommentEntity returnedEntity = commentsRepository.save(commentEntity);
            responseBuilder.withComment(mapper.map(returnedEntity, Comment.class)).withMessage("Comment updated successfully").withCode(HttpStatus.OK.value()).withSuccess(true);
        }
        return responseBuilder.build();
    }

    @Override
    public DeleteMutationResponse removeComment(DataFetchingEnvironment dataFetchingEnvironment, UUID commentId) {
        DeleteMutationResponse.Builder responseBuilder = new DeleteMutationResponse.Builder();
        String currentUser = dataFetchingEnvironment.getGraphQlContext().get("Auth");
        Optional<UserEntity> authUser = userRepository.findById(UUID.fromString(currentUser));
        Optional<CommentEntity> byId = commentsRepository.findById(commentId);
        if (!byId.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("Comment not found").withSuccess(false);
        } else if (!authUser.isPresent() || !(authUser.get().getAdmin() && !StringUtils.equals(byId.get().getUser().getId().toString(), currentUser))) {
            responseBuilder.withCode(HttpStatus.UNAUTHORIZED.value()).withMessage("User not authorized").withSuccess(false);
        } else {
            commentsRepository.deleteById(commentId);
            responseBuilder.withCode(HttpStatus.OK.value()).withMessage("Comment deleted successfully").withSuccess(true);
        }
        return responseBuilder.build();

    }

    @Override
    public VoteMutationResponse voteOnBook(DataFetchingEnvironment dataFetchingEnvironment, UUID userId, UUID bookId, Boolean approve) {
        VoteMutationResponse.Builder responseBuilder = new VoteMutationResponse.Builder();
        Optional<UserEntity> byId = userRepository.findById(userId);
        Optional<BookEntity> bookEntity = bookRepository.findById(bookId);
        if (!bookEntity.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("Book not found").withSuccess(false);
        } else if (!byId.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("User not found").withSuccess(false);
        } else {
            Optional<VoteEntity> existingVote = voteRepository.findByBookAndUser(bookEntity.get(), byId.get());
            if (existingVote.isPresent()) {
                responseBuilder.withCode(HttpStatus.CONFLICT.value()).withMessage("User already voted").withSuccess(false);
            } else {
                VoteEntity voteEntity = new VoteEntity();
                voteEntity.setBook(bookEntity.get());
                voteEntity.setUser(byId.get());
                voteEntity.setApproved(approve);
                VoteEntity returnedEntity = voteRepository.save(voteEntity);
                responseBuilder.withVote(mapper.map(returnedEntity, Vote.class)).withMessage("Vote added successfully").withCode(HttpStatus.OK.value()).withSuccess(true);
            }

        }
        return responseBuilder.build();
    }

    @Override
    public BookMutationResponse completeBookClubVote(DataFetchingEnvironment dataFetchingEnvironment, UUID bookId) {
        BookMutationResponse.Builder responseBuilder = new BookMutationResponse.Builder();
        Optional<BookEntity> byId = bookRepository.findById(bookId);
        if (!byId.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("Book not found").withSuccess(false);
        } else if (byId.get().getComplete() || byId.get().getRead()) {
            responseBuilder.withCode(HttpStatus.CONFLICT.value()).withMessage("Book voting already completed").withSuccess(false);
        } else {
            BookEntity bookEntity = byId.get();
            bookEntity.setComplete(true);
            BookEntity returnedEntity = bookRepository.save(bookEntity);
            responseBuilder.withBook(mapper.map(returnedEntity, Book.class)).withMessage("Book completed successfully").withCode(HttpStatus.OK.value()).withSuccess(true);
        }

        return responseBuilder.build();
    }

    @Override
    public BookMutationResponse finishMonthlyChoice(DataFetchingEnvironment dataFetchingEnvironment, UUID bookId) {
        BookMutationResponse.Builder responseBuilder = new BookMutationResponse.Builder();
        Optional<BookEntity> byId = bookRepository.findById(bookId);
        if (!byId.isPresent()) {
            responseBuilder.withCode(HttpStatus.NOT_FOUND.value()).withMessage("Book not found").withSuccess(false);
        } else if (!byId.get().getComplete()) {
            responseBuilder.withCode(HttpStatus.CONFLICT.value()).withMessage("Book voting not completed").withSuccess(false);
        } else if (byId.get().getRead()) {
            responseBuilder.withCode(HttpStatus.CONFLICT.value()).withMessage("Book already finished").withSuccess(false);
        } else {
            BookEntity bookEntity = byId.get();
            bookEntity.setComplete(true);
            BookEntity returnedEntity = bookRepository.save(bookEntity);
            responseBuilder.withBook(mapper.map(returnedEntity, Book.class)).withMessage("Book completed successfully").withCode(HttpStatus.OK.value()).withSuccess(true);
        }

        return responseBuilder.build();
    }
}
