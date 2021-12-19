package com.cgi.library.repository;

import com.cgi.library.entity.CheckOut;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.UUID;

@Repository
public interface CheckOutRepository extends JpaRepository<CheckOut, UUID> {

    // find checkouts by book title
    Page<CheckOut> findAllByBorrowedBook_TitleContaining(Pageable pageable, String title);

    // find checkouts by book title and borrower's name
    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowedBook_TitleContainingAndBorrowerLastNameContaining(Pageable pageable, String title1, String name1, String title2, String name2);

    // find checkouts by borrower's name
    Page<CheckOut> findALlByBorrowerFirstNameContainingOrBorrowerLastNameContaining(Pageable pageable, String name1, String name2);

    // Borrowed example
    // Page<CheckOut> findAllByReturnedDateNull();

    // find not returned checkouts by book title
    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndReturnedDateIsNull(Pageable pageable, String title);

    // find not returned checkouts by book title and borrower's name
    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowedBook_TitleContainingAndBorrowerLastNameContainingAndReturnedDateIsNull(Pageable pageable, String title1, String name1, String title2, String name2);

    // find not returned checkouts by borrower's name
    Page<CheckOut> findALlByBorrowerFirstNameContainingOrBorrowerLastNameContainingAndReturnedDateIsNull(Pageable pageable, String name1, String name2);

    // Late example
    //Page<CheckOut> findAllByDueDateIsBeforeAndReturnedDateIsNull(LocalDate currentDate);

    // find late, not returned checkouts by book title
    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndDueDateIsBeforeAndReturnedDateIsNull(Pageable pageable, String title, LocalDate currentDate);

    // find late, not returned checkouts by book title and borrower's name
    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowedBook_TitleContainingAndBorrowerLastNameContainingAndDueDateIsBeforeAndReturnedDateIsNull(Pageable pageable, String title1, String name1, String title2, String name2, LocalDate currentDate);

    // find late, not returned checkouts by borrower's name
    Page<CheckOut> findALlByBorrowerFirstNameContainingOrBorrowerLastNameContainingAndDueDateIsBeforeAndReturnedDateIsNull(Pageable pageable, String name1, String name2, LocalDate currentDate);

    // Returned example
    // Page<CheckOut> findAllByReturnedDateNotNull();

    // find returned checkouts by book title
    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndReturnedDateNotNull(Pageable pageable, String title);

    // find returned checkouts by book title and borrower's name
    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowedBook_TitleContainingAndBorrowerLastNameContainingAndReturnedDateNotNull(Pageable pageable, String title1, String name1, String title2, String name2);

    // find returned checkouts by borrower's name
    Page<CheckOut> findALlByBorrowerFirstNameContainingOrBorrowerLastNameContainingAndReturnedDateNotNull(Pageable pageable, String name1, String name2);

    // Only by status
    Page<CheckOut> findAllByReturnedDateIsNull(Pageable pageable);                                          // borrowed
    Page<CheckOut> findAllByDueDateBeforeAndReturnedDateIsNull(Pageable pageable, LocalDate currentDate);   // late
    Page<CheckOut> findAllByReturnedDateNotNull(Pageable pageable);                                         // returned

    // Find not returned checkout by book id
    CheckOut findByBorrowedBook_IdAndReturnedDateIsNull(UUID uuid);

}
