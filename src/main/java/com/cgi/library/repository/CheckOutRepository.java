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

    Page<CheckOut> findAllByBorrowedBook_TitleContaining(Pageable pageable, String title);

    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowerLastNameContaining(Pageable pageable, String title, String name1, String name2);

    Page<CheckOut> findALlByBorrowerFirstNameContainingOrBorrowerLastNameContaining(Pageable pageable, String name1, String name2);

    // Borrowed example
    // Page<CheckOut> findAllByReturnedDateNull();

    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndReturnedDateIsNull(Pageable pageable, String title);

    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowerLastNameContainingAndReturnedDateIsNull(Pageable pageable, String title, String name1, String name2);

    Page<CheckOut> findALlByBorrowerFirstNameContainingOrBorrowerLastNameContainingAndReturnedDateIsNull(Pageable pageable, String name1, String name2);

    // Late example
    //Page<CheckOut> findAllByDueDateIsBeforeAndReturnedDateIsNull(LocalDate currentDate);

    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndDueDateIsBeforeAndReturnedDateIsNull(Pageable pageable, String title, LocalDate currentDate);

    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowerLastNameContainingAndDueDateIsBeforeAndReturnedDateIsNull(Pageable pageable, String title, String name1, String name2, LocalDate currentDate);

    Page<CheckOut> findALlByBorrowerFirstNameContainingOrBorrowerLastNameContainingAndDueDateIsBeforeAndReturnedDateIsNull(Pageable pageable, String name1, String name2, LocalDate currentDate);

    // Returned example
    // Page<CheckOut> findAllByReturnedDateNotNull();

    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndReturnedDateNotNull(Pageable pageable, String title);

    Page<CheckOut> findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowerLastNameContainingAndReturnedDateNotNull(Pageable pageable, String title, String name1, String name2);

    Page<CheckOut> findALlByBorrowerFirstNameContainingOrBorrowerLastNameContainingAndReturnedDateNotNull(Pageable pageable, String name1, String name2);

    // Only by status
    Page<CheckOut> findAllByReturnedDateIsNull(Pageable pageable);                                            // borrowed
    Page<CheckOut> findAllByDueDateBeforeAndReturnedDateIsNull(Pageable pageable, LocalDate currentDate);   // late
    Page<CheckOut> findAllByReturnedDateNotNull(Pageable pageable);                                         // returned

    // Find not returned checkout by book id
    CheckOut findByBorrowedBook_IdAndReturnedDateIsNull(UUID uuid);

}
