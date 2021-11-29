package com.cgi.library.service;

import com.cgi.library.entity.Book;
import com.cgi.library.model.BookDTO;
import com.cgi.library.model.BookStatus;
import com.cgi.library.repository.BookRepository;
import com.cgi.library.util.ModelMapperFactory;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.UUID;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;

    /**
     * Get all books.
     *
     * @param pageable
     * @return
     */
    public Page<BookDTO> getBooks(Pageable pageable) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return bookRepository.findAll(pageable).map(book -> modelMapper.map(book, BookDTO.class));
    }

    /**
     * Get a single book by ID.
     *
     * @param bookId
     * @return
     */
    public BookDTO getBook(UUID bookId) {
        Book book = bookRepository.getById(bookId);
        return ModelMapperFactory.getMapper().map(book, BookDTO.class);
    }

    /**
     * Create new Book with basic variables.
     *
     * @return
     */
    public BookDTO createBook() {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        Book book = new Book();
        book.setId(UUID.randomUUID());
        book.setTitle("Book's title");
        book.setAuthor("Author's name");
        book.setGenre("Genre");
        book.setYear(1999);
        book.setAdded(LocalDate.now());
        book.setCheckOutCount(0);
        book.setStatus(BookStatus.PROCESSING);
        return modelMapper.map(book, BookDTO.class);
    }

    public UUID saveBook(BookDTO bookDTO) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        return bookRepository.save(modelMapper.map(bookDTO, Book.class)).getId();
    }

    public void deleteBook(UUID bookId) {
        bookRepository.deleteById(bookId);
    }
}
