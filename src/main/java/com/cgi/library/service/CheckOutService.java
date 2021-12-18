package com.cgi.library.service;

import com.cgi.library.entity.CheckOut;
import com.cgi.library.model.BookDTO;
import com.cgi.library.model.BookStatus;
import com.cgi.library.model.CheckOutDTO;
import com.cgi.library.repository.CheckOutRepository;
import com.cgi.library.util.ModelMapperFactory;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDate;
import java.util.Date;
import java.util.UUID;

@Service
public class CheckOutService {

    @Autowired
    private CheckOutRepository checkOutRepository;
    @Autowired
    private BookService bookService;

    /**
     * Get all checkouts that match filters.
     *
     * @param pageable
     * @param title
     * @param name
     * @param status
     * @return
     */
    public Page<CheckOutDTO> getCheckOuts(Pageable pageable, String title, String name, String status) {
        ModelMapper modelMapper = ModelMapperFactory.getMapper();
        // boolean variables
        boolean bTitle = title != null;
        boolean bName = name != null;
        boolean bStatus = status != null;

        // Title and Name
        if(bTitle && bName && bStatus) {
            if(status.equalsIgnoreCase("Borrowed"))
                return checkOutRepository.findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowedBook_TitleContainingAndBorrowerLastNameContainingAndReturnedDateIsNull(pageable, title, name, title, name)
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
            if(status.equalsIgnoreCase("Late"))
                return checkOutRepository.findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowedBook_TitleContainingAndBorrowerLastNameContainingAndDueDateIsBeforeAndReturnedDateIsNull(pageable, title, name, title, name, LocalDate.now())
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
            if(status.equalsIgnoreCase("Returned"))
                return checkOutRepository.findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowedBook_TitleContainingAndBorrowerLastNameContainingAndReturnedDateNotNull(pageable, title, name, title, name)
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
        }

        if(bTitle && bName && !bStatus)
            return checkOutRepository.findAllByBorrowedBook_TitleContainingAndBorrowerFirstNameContainingOrBorrowedBook_TitleContainingAndBorrowerLastNameContaining(pageable, title, name, title, name)
                .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));


        // only by Title
        if(bTitle && !bName && bStatus) {
            if(status.equalsIgnoreCase("Borrowed"))
                return checkOutRepository.findAllByBorrowedBook_TitleContainingAndReturnedDateIsNull(pageable, title)
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
            if(status.equalsIgnoreCase("Late"))
                return checkOutRepository.findAllByBorrowedBook_TitleContainingAndDueDateIsBeforeAndReturnedDateIsNull(pageable, title, LocalDate.now())
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
            if(status.equalsIgnoreCase("Returned"))
                return checkOutRepository.findAllByBorrowedBook_TitleContainingAndReturnedDateNotNull(pageable, title)
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
        }

        if(bTitle && !bName && !bStatus)
            return checkOutRepository.findAllByBorrowedBook_TitleContaining(pageable, title)
                    .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));

        // only by Name
        if(!bTitle && bName && bStatus) {
            if(status.equalsIgnoreCase("Borrowed"))
                return checkOutRepository.findALlByBorrowerFirstNameContainingOrBorrowerLastNameContainingAndReturnedDateIsNull(pageable, name, name)
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
            if(status.equalsIgnoreCase("Late"))
                return checkOutRepository.findALlByBorrowerFirstNameContainingOrBorrowerLastNameContainingAndDueDateIsBeforeAndReturnedDateIsNull(pageable, name, name, LocalDate.now())
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
            if(status.equalsIgnoreCase("Returned"))
                return checkOutRepository.findALlByBorrowerFirstNameContainingOrBorrowerLastNameContainingAndReturnedDateNotNull(pageable, name, name)
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
        }

        if(!bTitle && bName && !bStatus)
            return checkOutRepository.findALlByBorrowerFirstNameContainingOrBorrowerLastNameContaining(pageable, name, name)
                    .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));

        // only by Status
        if(!bTitle && !bName && bStatus) {
            if(status.equalsIgnoreCase("Borrowed"))
                return checkOutRepository.findAllByReturnedDateIsNull(pageable)
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
            if(status.equalsIgnoreCase("Late"))
                return checkOutRepository.findAllByDueDateBeforeAndReturnedDateIsNull(pageable, LocalDate.now())
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
            if(status.equalsIgnoreCase("returned"))
                return checkOutRepository.findAllByReturnedDateNotNull(pageable)
                        .map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
        }

        return checkOutRepository.findAll(pageable).map(checkOut -> modelMapper.map(checkOut, CheckOutDTO.class));
    }

    /**
     * Get a single checkout by ID.
     *
     * @param checkOutId
     * @return
     */
    public CheckOutDTO getCheckOut(UUID checkOutId) {
        try {
            CheckOut checkOut = checkOutRepository.getById(checkOutId);
            return ModelMapperFactory.getMapper().map(checkOut, CheckOutDTO.class);
        } catch (EntityNotFoundException e) {
            return null;
        }
    }

    public CheckOutDTO createCheckOut(String bookId, String firstName, String lastName, String dueDate) {
        CheckOutDTO checkOut = new CheckOutDTO();
        checkOut.setId(UUID.randomUUID());
        checkOut.setBorrowerFirstName(firstName);
        checkOut.setBorrowerLastName(lastName);
        checkOut.setBorrowedBook(bookService.getBook(UUID.fromString(bookId)));
        checkOut.setCheckedOutDate(LocalDate.now());
        checkOut.setDueDate(LocalDate.parse(dueDate));
        this.saveCheckOut(checkOut);
        BookDTO book = bookService.getBook(UUID.fromString(bookId));
        book.setStatus(BookStatus.BORROWED);
        book.setCheckOutCount(book.getCheckOutCount() + 1);
        bookService.saveBook(book);
        return ModelMapperFactory.getMapper().map(checkOut, CheckOutDTO.class);
    }

    public void saveCheckOut(CheckOutDTO checkOutDTO) {
        checkOutRepository.save(ModelMapperFactory.getMapper().map(checkOutDTO, CheckOut.class));
    }

    public void deleteCheckOut(UUID checkOutId) {
        checkOutRepository.deleteById(checkOutId);
    }

    public CheckOutDTO findCheckOutByBookId(UUID bookId) {
        CheckOut checkOut = checkOutRepository.findByBorrowedBook_IdAndReturnedDateIsNull(bookId);
        return ModelMapperFactory.getMapper().map(checkOut, CheckOutDTO.class);
    }
}
