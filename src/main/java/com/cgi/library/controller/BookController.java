package com.cgi.library.controller;

import com.cgi.library.model.BookDTO;
import com.cgi.library.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/book")
public class BookController {

    @Autowired
    private BookService bookService;

    @GetMapping(value = "getBooks")
    public ResponseEntity<Page<BookDTO>> getBooks(Pageable pageable) {
        return ResponseEntity.ok(bookService.getBooks(pageable));
    }

    @GetMapping(value = "getBook")
    public ResponseEntity<BookDTO> getBook(@RequestParam(value = "bookId") UUID bookId) {
        BookDTO bookDTO;
        try {
            bookDTO = bookService.getBook(bookId);
        } catch (NullPointerException e) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(bookDTO);
    }

    @PostMapping(value = "createBook")
    public ResponseEntity<BookDTO> createBook(@RequestBody BookDTO book) {
        return ResponseEntity.ok(bookService.createBook(book));
    }

    @PostMapping(value = "returnBook")
    public ResponseEntity<String> returnBook(@RequestBody BookDTO book) {
        return ResponseEntity.ok(String.valueOf(bookService.returnBook(book)));
    }

    @PostMapping(value = "saveBook")
    public ResponseEntity<String> saveBook(@RequestBody BookDTO book) {
        bookService.saveBook(book);
        return ResponseEntity.ok("");
    }

    @DeleteMapping(value = "deleteBook")
    public ResponseEntity<String> deleteBook(@RequestParam(value = "bookId") UUID bookId) {
        bookService.deleteBook(bookId);
        return ResponseEntity.ok("");
    }
}
