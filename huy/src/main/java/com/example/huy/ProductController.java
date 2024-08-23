package com.example.huy;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")//test
public class ProductController {

    @Autowired
    private ProductService productService;

    // Hiển thị danh sách sản phẩm
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        Pageable paging = PageRequest.of(page, size);
        return new ResponseEntity<>(productService.getAllProducts(paging), HttpStatus.OK);
    }

    // Xem chi tiết sản phẩm
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        return new ResponseEntity<>(productService.getProductById(id), HttpStatus.OK);
    }

    // Thêm mới sản phẩm
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return new ResponseEntity<>(productService.createProduct(product), HttpStatus.CREATED);
    }

    // Cập nhật sản phẩm
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        return new ResponseEntity<>(productService.updateProduct(id, productDetails), HttpStatus.OK);
    }

    // Xóa sản phẩm
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Tìm kiếm sản phẩm theo tên và khoảng giá
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String name,
                                                        @RequestParam Double minPrice,
                                                        @RequestParam Double maxPrice) {
        return new ResponseEntity<>(productService.searchProducts(name, minPrice, maxPrice), HttpStatus.OK);
    }
}

