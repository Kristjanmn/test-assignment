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

    // find all books released withing specified years
    Page<Book> findAllByYearBetween(Pageable pageable, int fromYear, int toYear);

    // find all books by title, author and status released withing specified years
    Page<Book> findAllByYearBetweenAndTitleContainingAndAuthorContainingAndStatus(Pageable pageable, int fromYear, int toYear, String title, String author, BookStatus status);

    // find all books by title and author released withing specified years
    Page<Book> findAllByYearBetweenAndTitleContainingAndAuthorContaining(Pageable pageable, int fromYear, int toYear, String title, String author);

    // find all books by title and status released withing specified years
    Page<Book> findAllByYearBetweenAndTitleContainingAndStatus(Pageable pageable, int fromYear, int toYear, String title, BookStatus status);

    // find all books by title released withing specified years
    Page<Book> findAllByYearBetweenAndTitleContaining(Pageable pageable, int fromYear, int toYear, String title);

    // find all books by status released withing specified years
    Page<Book> findAllByYearBetweenAndAuthorContainingAndStatus(Pageable pageable, int fromYear, int toYear, String author, BookStatus status);

    // find all books by author released withing specified years
    Page<Book> findAllByYearBetweenAndAuthorContaining(Pageable pageable, int fromYear, int toYear, String author);

    // find all books by status released withing specified years
    Page<Book> findAllByYearBetweenAndStatus(Pageable pageable, int fromYear, int toYear, BookStatus status);

}
