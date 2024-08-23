let products = [];
const API_URL = 'http://localhost:8080/api/products'; // Đảm bảo URL này đúng

// Cập nhật bảng sản phẩm
function updateProductTable() {
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = ''; // Xóa dữ liệu hiện tại

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.discountPrice}</td>
            <td><img src="${product.image}" alt="${product.name}" style="width: 100px;"></td>
            <td>${product.description}</td>
            <td>${product.category}</td>
            <td>${product.status}</td>
            <td>
                <button onclick="viewProduct(${product.id})">Xem</button>
                <button onclick="editProduct(${product.id})">Sửa</button>
                <button onclick="deleteProduct(${product.id})">Xóa</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Lấy tất cả sản phẩm
async function getAllProducts() {
    try {
        const response = await fetch(`${API_URL}?page=0&size=10`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        products = await response.json();
        updateProductTable();
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Không thể lấy danh sách sản phẩm. Vui lòng thử lại sau.');
    }
}

// Thêm sản phẩm
async function addProduct() {
    const name = document.getElementById('productName').value.trim();
    const price = parseFloat(document.getElementById('productPrice').value);
    const discountPrice = parseFloat(document.getElementById('productDiscountPrice').value);
    const image = document.getElementById('productImage').value.trim();
    const description = document.getElementById('productDescription').value.trim();
    const category = document.getElementById('productCategory').value;
    const status = document.getElementById('productStatus').value;

    if (name && !isNaN(price) && !isNaN(discountPrice)) {
        try {
            const response = await fetch(`${API_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name, 
                    price, 
                    discountPrice, 
                    image, 
                    description, 
                    category, 
                    status
                }),
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }
            
            const newProduct = await response.json();
            products.push(newProduct);
            updateProductTable();
            document.getElementById('productName').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productDiscountPrice').value = '';
            document.getElementById('productImage').value = '';
            document.getElementById('productDescription').value = '';
            document.getElementById('productCategory').value = '';
            document.getElementById('productStatus').value = '';
            alert('Sản phẩm đã được thêm thành công!');
        } catch (error) {
            console.error('Error adding product:', error);
            alert(`Không thể thêm sản phẩm. Lỗi: ${error.message}`);
        }
    } else {
        alert('Vui lòng nhập đầy đủ thông tin sản phẩm.');
    }
}

// Cập nhật sản phẩm
async function editProduct(id) {
    const product = products.find(p => p.id === id);
    const newName = prompt('Nhập tên sản phẩm mới:', product.name);
    const newPrice = parseFloat(prompt('Nhập giá sản phẩm mới:', product.price));
    const newDiscountPrice = parseFloat(prompt('Nhập giá khuyến mại mới:', product.discountPrice));
    const newImage = prompt('Nhập URL hình ảnh mới:', product.image);
    const newDescription = prompt('Nhập mô tả mới:', product.description);
    const newCategory = prompt('Nhập danh mục mới:', product.category);
    const newStatus = prompt('Nhập trạng thái mới:', product.status);

    if (newName && !isNaN(newPrice) && !isNaN(newDiscountPrice)) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newName,
                    price: newPrice,
                    discountPrice: newDiscountPrice,
                    image: newImage,
                    description: newDescription,
                    category: newCategory,
                    status: newStatus
                }),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const updatedProduct = await response.json();
            const index = products.findIndex(p => p.id === id);
            products[index] = updatedProduct;
            updateProductTable();
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Không thể cập nhật sản phẩm. Vui lòng thử lại.');
        }
    } else {
        alert('Vui lòng nhập đầy đủ thông tin sản phẩm.');
    }
}


// Xem chi tiết sản phẩm
async function viewProduct(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const product = await response.json();
        alert(`Tên sản phẩm: ${product.name}\nGiá: ${product.price}\nGiá khuyến mại: ${product.discountPrice}\nHình ảnh: ${product.image}\nMô tả: ${product.description}\nDanh mục: ${product.category}\nTrạng thái: ${product.status}`);
    } catch (error) {
        console.error('Error viewing product:', error);
        alert('Không thể xem chi tiết sản phẩm. Vui lòng thử lại.');
    }
}


// Xóa sản phẩm
async function deleteProduct(id) {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            products = products.filter(p => p.id !== id);
            updateProductTable();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Không thể xóa sản phẩm. Vui lòng thử lại.');
        }
    }
}

// Tìm kiếm sản phẩm
async function searchProducts() {
    const name = document.getElementById('searchName').value.trim();
    const priceMin = document.getElementById('searchPriceMin').value || 0;
    const priceMax = document.getElementById('searchPriceMax').value || Number.MAX_SAFE_INTEGER;

    try {
        const response = await fetch(`${API_URL}/search?name=${encodeURIComponent(name)}&minPrice=${priceMin}&maxPrice=${priceMax}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        products = await response.json();
        updateProductTable();
    } catch (error) {
        console.error('Error searching products:', error);
        alert('Không thể tìm kiếm sản phẩm. Vui lòng thử lại.');
    }
}


// Gọi hàm này khi trang được tải
document.addEventListener('DOMContentLoaded', getAllProducts);
