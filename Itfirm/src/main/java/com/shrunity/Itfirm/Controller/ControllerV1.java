package com.shrunity.Itfirm.Controller;


import com.shrunity.Itfirm.DTO.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/v1/product")
public class ControllerV1 extends ItFirmController{
    @Override
    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(@PageableDefault(size=10, page=0)Pageable pageable) {
        Page<ProductDTO> products = service.getAll(pageable);
        products.forEach(p -> p.setProductName("Enhanced field available in V2"));
        return ResponseEntity.ok(products);
    }
}
