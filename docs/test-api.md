**TEST API GIAI ĐOẠN XÂY DỰNG CÁC CHỨC NĂNG CƠ BẢN**
Flow : Signup → Login → Add to Cart → Create Order → Check Cart (trống) → Check Order (có đơn mới).

Test chức năng đăng kí 
POST http://127.0.0.1:4000/auth/signup
{
  "email": "trung@example.com",
  "password": "123456789"
}

Test chức năng đăng nhập
POST http://127.0.0.1:4000/auth/login
{
  "email": "trung@example.com",
  "password": "123456789"
}

Test lấy danh sách sản phẩm
GET http://127.0.0.1:4000/products

Test lấy chi tiết sản phẩm
GET http://127.0.0.1:4000/products/id

(Cart chỉ mang tính tạm thời, sẽ bị xoá ngay sau khi lấy dữ liệu từ Cart để hình thành Order )
Test lấy giỏ hàng ( yêu cầu phải có Token lấy từ kết quả của test chức năng đăng nhập )
GET http://127.0.0.1:4000/cart

Test thêm vào giỏ hàng ( yêu cầu phải có Token lấy từ kết quả của test chức năng đăng nhập và productId lấy từ các chức năng sản phẩm)
POST http://127.0.0.1:4000/cart
{
    "productId": "0b0bd801-9609-4dfd-b153-ceefd7fa0c75",
    "quantity": 2
}
( Tại đây báo lỗi chưa có unique-constraint cần thêm vào model của Cart và migration lại )

Test xoá khỏi giỏ hàng ( yêu cầu phải có có Token lấy từ kết quả của test chức năng đăng nhập và id giỏ hàng lấy từ test chức năng thêm vào giỏ hàng )
DELETE  http://127.0.0.1:4000/cart/570ddd27-6898-40fe-80bb-ef71f691d3f0

Test tạo đơn hàng ( yêu cầu phải có có Token lấy từ kết quả của test chức năng đăng nhập )
POST http://127.0.0.1:4000/orders

Test xem danh sách đơn hàng ( yêu cầu phải có có Token lấy từ kết quả của test chức năng đăng nhập )
GET http://127.0.0.1:4000/orders

Test lấy danh sách yêu thích ( yêu cầu phải có có Token lấy từ kết quả của test chức năng đăng nhập )
GET http://127.0.0.1:4000/favorites

Test thêm vào danh sách yêu thích ( yêu cầu phải có có Token lấy từ kết quả của test chức năng đăng nhập và productId lấy từ các chức năng sản phẩm ) 
POST http://127.0.0.1:4000/favorites
{
    "productId": "0b0bd801-9609-4dfd-b153-ceefd7fa0c75"
}

Test xoá khỏi yêu thích ( yêu cầu phải có Token lấy từ kết quả của test chức năng đăng nhập và id kết quả lấy từ test chức năng thêm vào danh sách yêu thích )
DELETE http://127.0.0.1:4000/favorites/369e5ba1-3a99-4a5d-a764-dd4744da8aa4

Test thêm sản phẩm bằng admin 
POST http://127.0.0.1:4000/admin/products
{
    "title": "Tivi",
    "description": "Sony",
    "price": 50000000,
    "imageUrl":"https://www.sony.com.vn/bravia/products/bravia-3?locale=vi_VN&sku=k-43s30-vn3"
}

Test sửa sản phẩm bằng admin ( yêu cầu phải có id của sản phẩm từ các test chức năng có liên quan tới sản phẩm )
PUT http://127.0.0.1:4000/admin/products/1
{
    "title": "Mobile",
    "description": "Pixel 9",
    "price": 18000000,
    "imageUrl":"https://store.google.com/gb/product/pixel_9?hl=en-GB"
}

Test xoá sản phẩm bằng admin ( yêu cầu phải có id của sản phẩm từ các test chức năng có liên quan tới sản phẩm )
DELETE http://127.0.0.1:4000/admin/products/0b0bd801-9609-4dfd-b153-ceefd7fa0c75

**SAU GIAI ĐOẠN TẠO ROLE CHO USER VÀ ADMIN**
Test đăng nhập Admin 
POST http://127.0.0.1:4000/auth/login
{
  "email": "admin@example.com",
  "password": "Bí mật”
}
Test xem danh sách đơn hàng bằng Admin ( yêu cầu phải có Token lấy từ kết quả của test chức năng đăng nhập Admin)
GET http://127.0.0.1:4000/admin/orders
Test case : Không có token -> báo No token; token của USER -> báo Forbidden-Admin only; token của ADMIN trả về kết quả

**CHUYỂN SANG GIAI ĐOẠN TEST API CHO CÁC ROUTES ADMIN SAU KHI GOM NHÓM** 
Test lại ADMIN CRUD và xem danh sách đơn hàng bằng Admin với các trường hợp No Token, Token USER, token ADMIN









