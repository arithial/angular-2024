package com.arithial.bookclub.server.jpa;

import jakarta.persistence.*;

import java.util.Date;
import java.util.UUID;

@Entity(name = "CommentEntity")
@Table(name = "tComment")
public class CommentEntity {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
    UUID id;

    @Column(length = 500)
    String message;
    @ManyToOne
    UserEntity user;
    @ManyToOne
    BookEntity book;
    Date created;

    public CommentEntity() {
    }

    @PrePersist
    protected void onCreate() {
        if(created == null) {
            created = new Date();
        }
    }

    public UUID getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public BookEntity getBook() {
        return book;
    }

    public void setBook(BookEntity book) {
        this.book = book;
    }

    public Date getCreated() {
        return created;
    }

    public void setCreated(Date created) {
        this.created = created;
    }

    @Override
    public String toString() {
        return "CommentEntity{" +
                "id=" + id +
                ", message='" + message + '\'' +
                ", user=" + user +
                ", book=" + book +
                '}';
    }
}
