package com.arithial.bookclub.server.impl;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.logging.Logger;

import com.arithial.bookclub.server.*;
import com.arithial.bookclub.server.jpa.BookEntity;
import com.arithial.bookclub.server.jpa.CommentEntity;
import com.arithial.bookclub.server.jpa.UserEntity;
import com.arithial.bookclub.server.jpa.VoteEntity;
import com.arithial.bookclub.server.jpa.repository.BookRepository;
import com.arithial.bookclub.server.jpa.repository.CommentsRepository;
import com.arithial.bookclub.server.jpa.repository.UserRepository;
import com.arithial.bookclub.server.jpa.repository.VoteRepository;
import jakarta.annotation.PostConstruct;
import jakarta.annotation.Resource;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Component;


/**
 * A Spring bean that contains various utilities
 *
 * @author etienne-sf
 */
@Component
public class Util {

    public static final String AUTH_KEY = "auth";
    Logger logger = Logger.getLogger(Util.class.getName());

    @Resource
    UserRepository userRepository;
    @Resource
    private BookRepository bookRepository;
    @Resource
    private VoteRepository voteRepository;
    @Resource
    private CommentsRepository commentsRepository;


    @PostConstruct
    public void init() {
        System.out.println("Initializing");
        logger.info("Initializing");
        String adminUsername = "admin";
        boolean adminStatus = true;
        String password = "password";
        Optional<BookEntity> book = bookRepository.findByIsbn("0312850093");
        if (!book.isPresent()) {
            System.out.println("creating default book");
            logger.info("creating default book");
            BookEntity bookEntity = generateDuneBook();
            bookRepository.save(getBookEntity());
            bookRepository.save(bookEntity);
            System.out.println("created default book");
            logger.info("created default book");
        }

        generateTestUser(adminUsername, password, adminStatus, null);
        Optional<BookEntity> bookEntity = bookRepository.findByIsbn("9780425027066");
        for (int i = 0; i < 30; i++) {

            String testUsername = "testUser" + i;
            String testPassword = "password" + i;
            boolean testAdminStatus = false;
            generateTestUser(testUsername, testPassword, testAdminStatus, bookEntity.get());
        }

    }


    public CommentEntity createRandomComment(UserEntity user, BookEntity book) {
        if (user == null || book == null) {
            throw new IllegalArgumentException("User and Book must not be null.");
        }

        CommentEntity commentEntity = new CommentEntity();
        commentEntity.setUser(user);
        commentEntity.setBook(book);
        commentEntity.setMessage("Comment from " + user.getUsername() + ": " + RandomStringUtils.randomAlphabetic(50));
        commentEntity.setCreated(new Date());

        commentEntity = commentsRepository.save(commentEntity);
        logger.info("A random comment has been created and saved for user: " + user.getUsername() + " and book: " + book.getTitle());
        return commentEntity;
    }
    
    private BookEntity generateDuneBook() {
        BookEntity bookEntity = new BookEntity();
        bookEntity.setIsbn("9780425027066");
        bookEntity.setTitle("Dune");
        bookEntity.setAuthor("Frank Herbert");
        bookEntity.setComplete(false);
        bookEntity.setRead(false);
        bookEntity.setDescription("Dune is a science fiction novel by Frank Herbert, set in a distant future amidst a sprawling feudal interstellar empire.");
        return bookEntity;
    }

    private static BookEntity getBookEntity() {
        BookEntity bookEntity = new BookEntity();
        bookEntity.setIsbn("0312850093");
        bookEntity.setTitle("The Eye of The World");
        bookEntity.setAuthor("Robert Jordan");
        bookEntity.setComplete(true);
        bookEntity.setRead(false);
        bookEntity.setDescription("The Eye of The World is the first book in The Wheel of Time series by Robert Jordan. It follows the journey of Rand al'Thor and his friends as they discover their roles in a world of magic and prophecy.");
        return bookEntity;
    }

    private void generateTestUser(String username, String password, boolean adminStatus, BookEntity book) {
        Optional<UserEntity> admin = userRepository.findByUsername(username);
        if (!admin.isPresent()) {
            System.out.println("creating admin");
            logger.info("creating admin");
            UserEntity user = new UserEntity();
            user.setUsername(username);
            user.setPassword(Base64.getEncoder().encodeToString(password.getBytes(StandardCharsets.UTF_8)));
            user.setAdmin(adminStatus);
            user.setEmail(generateRandomEmail(20));
            user = userRepository.save(user);
            System.out.println("created " + username + ". Default password is: " + password);
            logger.info("created " + username + ". Default password is: " + password);
            if (book != null) {
                VoteEntity vote = new VoteEntity();
                vote.setApproved(Math.random() < 0.7);
                vote.setUser(user);
                vote.setBook(book);
                voteRepository.save(vote);
                System.out.println(username + " voted for WoT: " + vote.getApproved());
                logger.info(username + " voted for WoT: " + vote.getApproved());
                createRandomComment(user, book);
            }

        }
    }


    public static String generateRandomEmail(int length) {
        String allowedChars = "abcdefghijklmnopqrstuvwxyz" + "1234567890" + "_-.";
        String email = "";
        String temp = RandomStringUtils.random(length, allowedChars);
        email = temp.substring(0, temp.length() - 9) + "@testdata.com";
        return email;
    }

    public Book toBook(BookEntity book) {
        return toBook(book, null, 0);
    }
    public Book toBook(BookEntity book, UserEntity currentUser ) {
        return toBook(book, currentUser, 0);

    }


    public Book toBook(BookEntity book, UserEntity currentUser, int index) {
        Book.Builder builder = new Book.Builder();
        builder.withId(book.getId());
        builder.withIsbn(book.getIsbn());
        builder.withTitle(book.getTitle());
        builder.withAuthor(book.getAuthor());
        builder.withDescription(book.getDescription());
        builder.withRead(book.getRead());
        builder.withSelected(book.getComplete());
        builder.withIndex(index);
        List<VoteEntity> votes = voteRepository.findByBook(book);
        int total = votes.size();
        builder.withTotalVotes(total);
        if (total == 0) {
            builder.withRating(0d);
        } else {
            double rating = votes.stream().filter(VoteEntity::getApproved).count() / (double) total;
            builder.withRating(rating);
        }
        if (currentUser != null) {
            UserVote.Builder vote = new UserVote.Builder();
            vote.withApprove(votes.stream().filter(voteEntity -> voteEntity.getUser().getId().equals(currentUser.getId())).findFirst().map(VoteEntity::getApproved).orElse(false));
            builder.withUserVote(vote.build());
        }
        return builder.build();
    }

    public User toUser(UserEntity user) {
        User.Builder builder = new User.Builder();
        builder.withId(user.getId());
        builder.withUsername(user.getUsername());
        builder.withEmail(user.getEmail());
        builder.withIsAdmin(user.getAdmin() != null && user.getAdmin());
        return builder.build();
    }

    public Comment toComment(CommentEntity commentEntity) {
        return toComment(commentEntity, 0);
    }
    public Comment toComment(CommentEntity commentEntity, int index) {
        Comment.Builder builder = new Comment.Builder();
        builder.withId(commentEntity.getId());
        builder.withBook(toBook(commentEntity.getBook(), null, 0));
        builder.withUser(toUser(commentEntity.getUser()));
        builder.withText(commentEntity.getMessage());
        builder.withIndex(index);
        return builder.build();
    }

    public Vote toVote(VoteEntity voteEntity) {
        Vote.Builder builder = new Vote.Builder();
        builder.withId(voteEntity.getId());
        builder.withBook(toBook(voteEntity.getBook(), null, 0));
        builder.withApprove(voteEntity.getApproved());
        return builder.build();
    }
}