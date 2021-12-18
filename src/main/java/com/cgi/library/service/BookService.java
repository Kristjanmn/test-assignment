package com.cgi.library.service;

import com.cgi.library.entity.Book;
import com.cgi.library.model.BookDTO;
import com.cgi.library.model.BookStatus;
import com.cgi.library.model.CheckOutDTO;
import com.cgi.library.repository.BookRepository;
import com.cgi.library.util.ModelMapperFactory;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;
    @Autowired
    private CheckOutService checkOutService;

    /**
     * Get all books according to filter.
     *
     * @param pageable
     * @param title
     * @param author
     * @param fromYear
     * @param toYear
     * @param status
     * @return
     */
    public Page<BookDTO> getBooks(Pageable pageable, String title, String author, int fromYear, int toYear, BookStatus status) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        // boolean variables
        boolean bTitle = title != null;
        boolean bAuthor = author != null;
        boolean bStatus = status != null;

        // A ton of filtering
        if(bTitle && bAuthor && bStatus)
            return bookRepository.findAllByYearBetweenAndTitleContainingAndAuthorContainingAndStatus(pageable, fromYear, toYear, title, author, status)
                    .map(book -> modelMapper.map(book, BookDTO.class));

        if(bTitle && bAuthor && !bStatus)
            return bookRepository.findAllByYearBetweenAndTitleContainingAndAuthorContaining(pageable, fromYear, toYear, title, author)
                    .map(book -> modelMapper.map(book, BookDTO.class));

        if(bTitle && !bAuthor && bStatus)
            return bookRepository.findAllByYearBetweenAndTitleContainingAndStatus(pageable, fromYear, toYear, title, status)
                    .map(book -> modelMapper.map(book, BookDTO.class));

        if(bTitle && !bAuthor && !bStatus)
            return bookRepository.findAllByYearBetweenAndTitleContaining(pageable, fromYear, toYear, title)
                    .map(book -> modelMapper.map(book, BookDTO.class));

        if(!bTitle && bAuthor && bStatus)
            return bookRepository.findAllByYearBetweenAndAuthorContainingAndStatus(pageable, fromYear, toYear, author, status)
                    .map(book -> modelMapper.map(book, BookDTO.class));

        if(!bTitle && bAuthor && !bStatus)
            return bookRepository.findAllByYearBetweenAndAuthorContaining(pageable, fromYear, toYear, author)
                    .map(book -> modelMapper.map(book, BookDTO.class));

        if(!bTitle && !bAuthor && bStatus)
            return bookRepository.findAllByYearBetweenAndStatus(pageable, fromYear, toYear, status)
                    .map(book -> modelMapper.map(book, BookDTO.class));

        // In case fromYear and toYear were not provided.
        if(fromYear == 0 && toYear == 0) return bookRepository.findAll(pageable)
                .map(book -> modelMapper.map(book, BookDTO.class));

        return bookRepository.findAllByYearBetween(pageable, fromYear, toYear)
                .map(book -> modelMapper.map(book, BookDTO.class));
    }

    /**
     * Get a single book by ID.
     *
     * @param bookId
     * @return
     */
    public BookDTO getBook(UUID bookId) {
        Book book;
        try {
            book = bookRepository.getById(bookId);
            return ModelMapperFactory.getMapper().map(book, BookDTO.class);
        } catch (EntityNotFoundException e) {
            return null;
        }
    }

    /**
     * Create new Book with basic variables.
     *
     * @return
     */
    public BookDTO createBook(BookDTO bookDTO) {
        bookDTO.setId(UUID.randomUUID());
        bookDTO.setAdded(LocalDate.now());
        this.saveBook(bookDTO);
        return bookDTO;
    }

    public void returnBook(BookDTO bookDTO) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        // Book
        bookDTO.setStatus(BookStatus.RETURNED);
        bookDTO.setDueDate(null);
        saveBook(bookDTO);
        // Checkout
        CheckOutDTO checkOut = checkOutService.findCheckOutByBookId(bookDTO.getId());
        checkOut.setReturnedDate(LocalDate.now());
        checkOutService.saveCheckOut(checkOut);
        bookRepository.save(modelMapper.map(bookDTO, Book.class));
    }

    public void saveBook(BookDTO bookDTO) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        bookRepository.save(modelMapper.map(bookDTO, Book.class));
    }

    public void deleteBook(UUID bookId) {
        bookRepository.deleteById(bookId);
    }
}
