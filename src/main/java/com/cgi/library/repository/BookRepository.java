package com.cgi.library.repository;

import com.cgi.library.entity.Book;
import com.cgi.library.model.BookStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BookRepository extends JpaRepository<Book, UUID> {

    Page<Book> findAllByYearBetween(Pageable pageable, int fromYear, int toYear);

    Page<Book> findAllByYearBetweenAndTitleContainingAndAuthorContainingAndStatus(Pageable pageable, int fromYear, int toYear, String title, String author, BookStatus status);

    Page<Book> findAllByYearBetweenAndTitleContainingAndAuthorContaining(Pageable pageable, int fromYear, int toYear, String title, String author);

    Page<Book> findAllByYearBetweenAndTitleContainingAndStatus(Pageable pageable, int fromYear, int toYear, String title, BookStatus status);

    Page<Book> findAllByYearBetweenAndTitleContaining(Pageable pageable, int fromYear, int toYear, String title);

    Page<Book> findAllByYearBetweenAndAuthorContainingAndStatus(Pageable pageable, int fromYear, int toYear, String author, BookStatus status);

    Page<Book> findAllByYearBetweenAndAuthorContaining(Pageable pageable, int fromYear, int toYear, String author);

    Page<Book> findAllByYearBetweenAndStatus(Pageable pageable, int fromYear, int toYear, BookStatus status);

}
