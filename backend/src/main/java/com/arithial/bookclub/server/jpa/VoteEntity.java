package com.arithial.bookclub.server.jpa;

import jakarta.persistence.*;

import java.util.UUID;

@Entity(name = "VoteEntity")
@Table(name = "tVote")
public class VoteEntity {

    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.AUTO)
    UUID id;
    @ManyToOne
    UserEntity user;
    @ManyToOne
    BookEntity book;
    Boolean approved;


    public VoteEntity() {
    }

    public UUID getId() {
        return id;
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

    public Boolean getApproved() {
        return approved;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    @Override
    public String toString() {
        return "VoteEntity{" +
                "id=" + id +
                ", user=" + user +
                ", book=" + book +
                ", approved=" + approved +
                '}';
    }

}
