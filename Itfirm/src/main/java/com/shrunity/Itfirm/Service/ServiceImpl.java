package com.shrunity.Itfirm.Service;

import com.shrunity.Itfirm.DTO.ProductDTO;
import com.shrunity.Itfirm.Repository.ProductRepository;
import com.shrunity.Itfirm.entity.Product;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Profile("dev")
@Slf4j
public class ServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    // ✅ Convert DTO → Entity
    private Product convertDTOToEntity(ProductDTO productDTO) { // converting api data to database object
        Product product = new Product();
        product.setId(productDTO.getId());
        product.setProductName(productDTO.getProductName());
        product.setExp(productDTO.getExp());
        product.setMfd(productDTO.getMfd());
        product.setPrice(productDTO.getPrice());
        return product;
    }

    // ✅ Convert Entity → DTO
    private ProductDTO convertEntityToDTO(Product product) {
        ProductDTO productDTO = new ProductDTO();
        productDTO.setId(product.getId());
        productDTO.setProductName(product.getProductName());
        productDTO.setExp(product.getExp());
        productDTO.setMfd(product.getMfd());
        productDTO.setPrice(product.getPrice());
        return productDTO;
    }

    @Override
    public String deleteAll() {
        productRepository.deleteAll();
        log.info("Deleted successfully ");
        return "Deleted all items successfully";
    }

    @Override
    public String deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("This Id is not present: " + id);
        }
        productRepository.deleteById(id);
        return "Successfully deleted product with ID: " + id;
    }

    @Override
    public ProductDTO updateById(Long id, ProductDTO productDTO) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));

        existing.setProductName(productDTO.getProductName());
        existing.setExp(productDTO.getExp());
        existing.setMfd(productDTO.getMfd());
        existing.setPrice(productDTO.getPrice());

        Product updated = productRepository.save(existing);
        return convertEntityToDTO(updated);
    }

    @Override
    public Page<ProductDTO> getAll(Pageable pageable) {
        log.warn("successfully ");
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(this::convertEntityToDTO);
    }

    @Override
    public ProductDTO get(Long id) {
        Product exist = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
        log.info("Getting by ID");
        return convertEntityToDTO(exist);
    }

    @Override
    public ProductDTO create(ProductDTO productDTO) {
        Product product = convertDTOToEntity(productDTO);
        Product saved = productRepository.save(product);
        return convertEntityToDTO(saved);
    }
}
