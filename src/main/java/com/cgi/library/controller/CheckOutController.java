package com.cgi.library.controller;

import com.cgi.library.model.BookDTO;
import com.cgi.library.model.BookStatus;
import com.cgi.library.model.CheckOutDTO;
import com.cgi.library.service.BookService;
import com.cgi.library.service.CheckOutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/checkout")
public class CheckOutController {

    @Autowired
    private CheckOutService checkOutService;
    @Autowired
    private BookService bookService;

    @GetMapping(value = "getCheckouts")
    public ResponseEntity<Page<CheckOutDTO>> getCheckOuts(Pageable pageable,
                                                          @RequestParam(name = "title", required = false) String title,
                                                          @RequestParam(name = "name", required = false) String name,
                                                          @RequestParam(name = "status", required = false) String status) {
        return ResponseEntity.ok(checkOutService.getCheckOuts(pageable, title, name, status));
    }

    @GetMapping(value = "getCheckout")
    public ResponseEntity<CheckOutDTO> getCheckOut(@RequestParam(value = "checkOutId") UUID checkOutId) {
        CheckOutDTO checkOutDTO = checkOutService.getCheckOut(checkOutId);
        if(checkOutDTO == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(checkOutDTO);
    }

    @GetMapping(value = "getCheckoutByBookId")
    public ResponseEntity<CheckOutDTO> getCheckOutByBookId(@RequestParam(value = "bookId") UUID bookId) {
        CheckOutDTO checkOutDTO = checkOutService.findCheckOutByBookId(bookId);
        if(checkOutDTO == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(checkOutDTO);
    }

    // I use GetMapping here, so I have the backend create the checkout.
    @GetMapping(value = "createCheckout")
    public ResponseEntity<CheckOutDTO> createCheckOut(@RequestParam(value = "bookId") String bookId, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName, @RequestParam("dueDate") String dueDate) {
        return ResponseEntity.ok(checkOutService.createCheckOut(bookId, firstName, lastName, dueDate));
    }

    @PostMapping(value = "checkout")
    public ResponseEntity<String> saveCheckOut(@RequestBody CheckOutDTO checkOutDTO) {
        // Check if book status needs to be changed.
        BookDTO book = this.bookService.getBook(checkOutDTO.getBorrowedBook().getId());
        if(checkOutDTO.getReturnedDate() == null) book.setStatus(BookStatus.BORROWED);
        else book.setStatus(BookStatus.RETURNED);
        this.bookService.saveBook(book);
        checkOutService.saveCheckOut(checkOutDTO);
        return ResponseEntity.ok("");
    }

    @DeleteMapping(value = "checkout")
    public ResponseEntity<String> deleteCheckOut(@RequestParam(value = "checkOutId") UUID checkOutId) {
        checkOutService.deleteCheckOut(checkOutId);
        return ResponseEntity.ok("");
    }
}
