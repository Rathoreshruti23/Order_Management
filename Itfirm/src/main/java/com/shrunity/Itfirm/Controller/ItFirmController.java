package com.shrunity.Itfirm.Controller;

import com.shrunity.Itfirm.DTO.ProductDTO;
import com.shrunity.Itfirm.Service.ProductService;
import com.shrunity.Itfirm.exception.InvalidPriceException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product")
@Validated //automatic validation on incoming requests so that Spring can automatically
// check fields based on annotations like @NotNull, @Size, @Min
public class ItFirmController {
    @Autowired
    ProductService service;

    //read : get mapping : all product
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @PageableDefault(size=10,page=0)Pageable pageable){
        Page<ProductDTO> productDTO = service.getAll(pageable);
        return ResponseEntity.ok(productDTO);
    }

    //read: by id
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getById(@PathVariable Long id){
        ProductDTO productDTO=service.get(id);
        return ResponseEntity.ok(productDTO);
    }
//    @GetMapping("/hello")
//    public String sayHello() {
//        return "Hello, DevTools Test!";
//    }

    //create : post mapping
    @PostMapping("/create")
    public ResponseEntity<String> createProduct(@Validated @RequestBody ProductDTO productDTO) {
        ProductDTO savedProduct = service.create(productDTO);
        double price = productDTO.getPrice();

        // Validate price according to your condition
        if (price > 100000 || price <= 0) {
            throw new InvalidPriceException("Price must be greater than 0 and less than or equal to 100000");
        }

       // ProductDTO savedProduct = service.create(productDTO);
        return new ResponseEntity<>("Successfully Added the given product", HttpStatus.CREATED);
    }


    //update by id
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProductId(@PathVariable Long id , @RequestBody ProductDTO productDTO){
        ProductDTO productDTO1 = service.updateById(id , productDTO);
        return ResponseEntity.ok(productDTO1);
    }

    //delete by id
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProductById(@PathVariable Long id){
        service.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    //delete all product
    @DeleteMapping
    public ResponseEntity<String> deleteAllProduct(){
        service.deleteAll();
        return ResponseEntity.ok("Succesfully deleted all items");
    }
}