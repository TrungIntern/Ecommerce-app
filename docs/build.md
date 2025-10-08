A)	Cài đặt
Node.js 
Docker
 
B)	Tạo folder project 
mkdir edumart
cd edumart	

edumart/
•	frontend/   # Svelte + shadcn  + Tailwind
•	backend/    # Fastify + Prisma
( cd vào thư mục tương ứng trước khi làm việc )

C)	Frontend : SvelteKit + Tailwind + Shadcn svelte

1.	Cài đặt SvelteKit : npx sv create . và extension : Svelte for VScode để tránh lỗi 
2.	Cài đặt phụ thuộc và run dev : npm install và npm run dev
3.	Check Svelte trên trình duyệt : http://localhost:5173
4.	Cài đặt Tailwind : npm install -D tailwindcss postcss autoprefixer
5.	Tạo 2 file tailwind.config.cjs và postcss.config.cjs : npx tailwindcss init -p
6.	Tạo file global CSS src/app.css với các layer base, components, utilities
7.	Nếu sử dụng Shacn svelte để lấy components tạo sẵn thì cài đặt tailwind variants + dùng tài liệu từ Run CLI : https://shadcn-svelte.com/docs/installation/sveltekit

D)	+ E)  Backend : Postgre + Prisma + Fastify 
1.	Tạo project Node cho backend :
a.	npm init -y + sửa lại “type”: “module” trong file package.json  
b.	Cài đặt phụ thuộc : npm install fastify @fastify/cors @prisma/client + npm install -D prisma 


2.	Xây dựng CSDL Postgre từ docker compose 
Cài đặt WSL2 -> Docker Desktop 
Kiểm tra qua cmd : wsl –v, docker -v
Khởi tạo Docker Desktop lần đầu ( skip các distro khác của wsl ngoài distro Docker bằng cách kiểm tra qua cmd : wsl --list –verbose )
Tạo 1 file docker-compose.yml 
Chạy Database : docker compose up -d
Check docker image xem khớp với Docker Desktop chưa: docker ps -a 

3.	Lược đồ Prisma tạo model và migration

Khởi tạo prisma : npx prisma init
Tạo model trong file prisma/schema.prisma ( lưu ý phải có mối quan hệ 2 chiều– back relation giữa các model có liên quan) 
Tạo migration & generate client: npx prisma migrate dev --name init và npx prisma generate
Mở Prisma giao diện web : npx prisma studio + http://localhost:5555/

4.	Xây dựng Web Server backend Fastify 

Tạo file backend/server.js chứa các phương thức GET, POST, …
Chạy server : node server.js + http://127.0.0.1:4000/

F)	Kết nối Frontend và Backend
Ở frontend (Svelte), tạo component nhỏ để fetch danh sách products

Cây thư mục :

┣ 📂.vscode
┃ ┗ 📜settings.json
┣ 📂backend
┃ ┣ 📂prisma
┃ ┃ ┣ 📂migrations
┃ ┃ ┃ ┣ 📂20251004032415_init
┃ ┃ ┃ ┃ ┗ 📜migration.sql
┃ ┃ ┃ ┗ 📜migration_lock.toml
┃ ┃ ┗ 📜schema.prisma
┃ ┣ 📜.env
┃ ┣ 📜.gitignore
┃ ┣ 📜package.json
┃ ┗ 📜server.js
┣ 📂frontend
┃ ┣ 📂.svelte-kit
┃ ┃ ┣ 📂generated
┃ ┃ ┃ ┣ 📂client
┃ ┃ ┃ ┃ ┣ 📂nodes
┃ ┃ ┃ ┃ ┃ ┣ 📜0.js
┃ ┃ ┃ ┃ ┃ ┣ 📜1.js
┃ ┃ ┃ ┃ ┃ ┗ 📜2.js
┃ ┃ ┃ ┃ ┣ 📜app.js
┃ ┃ ┃ ┃ ┗ 📜matchers.js
┃ ┃ ┃ ┣ 📂server
┃ ┃ ┃ ┃ ┗ 📜internal.js
┃ ┃ ┃ ┣ 📜root.js
┃ ┃ ┃ ┗ 📜root.svelte
┃ ┃ ┣ 📂types
┃ ┃ ┃ ┣ 📂src
┃ ┃ ┃ ┃ ┗ 📂routes
┃ ┃ ┃ ┃   ┗ 📜$types.d.ts
┃ ┃ ┃ ┗ 📜route_meta_data.json
┃ ┃ ┣ 📜ambient.d.ts
┃ ┃ ┣ 📜non-ambient.d.ts
┃ ┃ ┗ 📜tsconfig.json
┃ ┣ 📂src
┃ ┃ ┣ 📂lib
┃ ┃ ┃ ┣ 📂assets
┃ ┃ ┃ ┃ ┗ 📜favicon.svg
┃ ┃ ┃ ┣ 📂components
┃ ┃ ┃ ┃ ┗ 📂ui
┃ ┃ ┃ ┃   ┗ 📂navigation-menu
┃ ┃ ┃ ┃     ┣ 📜index.ts
┃ ┃ ┃ ┃     ┣ 📜navigation-menu-content.svelte
┃ ┃ ┃ ┃     ┣ 📜navigation-menu-indicator.svelte
┃ ┃ ┃ ┃     ┣ 📜navigation-menu-item.svelte
┃ ┃ ┃ ┃     ┣ 📜navigation-menu-link.svelte
┃ ┃ ┃ ┃     ┣ 📜navigation-menu-list.svelte
┃ ┃ ┃ ┃     ┣ 📜navigation-menu-trigger.svelte
┃ ┃ ┃ ┃     ┣ 📜navigation-menu-viewport.svelte
┃ ┃ ┃ ┃     ┗ 📜navigation-menu.svelte
┃ ┃ ┃ ┣ 📂hooks
┃ ┃ ┃ ┣ 📜index.js
┃ ┃ ┃ ┗ 📜utils.js
┃ ┃ ┣ 📂routes
┃ ┃ ┃ ┣ 📜+layout.svelte
┃ ┃ ┃ ┗ 📜+page.svelte
┃ ┃ ┣ 📜app.css
┃ ┃ ┣ 📜app.d.ts
┃ ┃ ┗ 📜app.html
┃ ┣ 📂static
┃ ┃ ┗ 📜robots.txt
┃ ┣ 📜.gitignore
┃ ┣ 📜.npmrc
┃ ┣ 📜components.json
┃ ┣ 📜jsconfig.json
┃ ┣ 📜package.json
┃ ┣ 📜postcss.config.cjs
┃ ┣ 📜README.md
┃ ┣ 📜svelte.config.js
┃ ┣ 📜tailwind.config.js
┃ ┗ 📜vite.config.js
┗ 📜docker-compose.yml

GIAI ĐOẠN TẠO ROLE CHO USER VÀ ADMIN
•	Chỉnh sửa model User bằng cách thêm :    role     String  @default("USER")  // USER hoặc ADMIN
•	npx prisma migrate dev --name add_role_user
•	Chỉnh sửa chức năng sinh JWT bằng cách thêm:   role: user.role  vào biến và kết quả trả về
•	Chỉnh sửa Middleware riêng User và Admin
•	Tạo riêng 1 file seed.js cùng cấp server.js để tạo Admin mặc định
•	npx prisma db seed

GIAI ĐOẠN VIẾT MIDDLEWARE CHO NHÓM ADMIN ROUTES 
•	// hết ADMIN CRUD và chức năng xem danh sách đơn hàng Admin cũ
•	fastify.register tạo một “nhóm route” (plugin cục bộ).
•	{ prefix: '/admin' } đảm bảo mọi route bên trong có tiền tố /admin.
•	instance.addHook("preHandler", ...) gắn middleware chạy trước khi handler được gọi.
•	Vì hook này gắn ở cấp nhóm (instance), nên tất cả route con đều hưởng chung middleware.

GIAI ĐOẠN TẠO LUỒNG HIỂN THỊ TỪ BACKEND RA FRONTEND TRONG 1 FILE +page.svelte
Tạo form đăng kí, đăng nhập trong file page.svelte
Hiển thị danh sách sản phẩm : ….
Từ giai đoạn này bắt đầu phức tạp vì không thể để 2 phần này chung 1 trang được, chuyển sang tách routes cho các chức năng 
•	Tạo các thư mục login, signup lần lượt chứa các file +page.svelte 
•	Tạo file .env ở root của frontend để dễ đổi backend URL
# .env
VITE_API_URL=http://localhost:4000


Tại giao diện /products
 
Những lưu ý : 
•	Tạo nút Xem giỏ hàng để người dùng có thể check bất cứ lúc nào kể cả khi giỏ hàng trống
•	Số nhỏ hiển thị tại nút Xem giỏ hàng biểu thị số loại sản phẩm, còn chi tiết số lượng thì xem trong trang /cart sau
•	Phải thêm được sản phẩm nhiều lần mà không điều hướng đến trang /cart để không cần phải back lại

Tại giao diện  /cart
 
Sau khi nhấn nút đặt hàng phải điều hướng đến trang /cart, thông báo đã đặt hàng thành công và backend phải tự xoá giỏ hàng , đồng thời trang web chuyển hướng về lại /products
Tại giao diện /orders
Những lưu ý :
•	Mã đơn rõ ràng
•	Ngày và giờ đặt tách bạch
•	Số lượng và tiền tách bạch
Sau đó tạo nút Xem đơn hàng bên cạnh nút Xem giỏ hàng tại /products

Cây thư mục folder frontend được update lại

┣ 📂.svelte-kit
┃ ┣ 📂generated
┃ ┃ ┣ 📂client
┃ ┃ ┃ ┣ 📂nodes
┃ ┃ ┃ ┃ ┣ 📜0.js
┃ ┃ ┃ ┃ ┣ 📜1.js
┃ ┃ ┃ ┃ ┣ 📜2.js
┃ ┃ ┃ ┃ ┣ 📜3.js
┃ ┃ ┃ ┃ ┣ 📜4.js
┃ ┃ ┃ ┃ ┣ 📜5.js
┃ ┃ ┃ ┃ ┣ 📜6.js
┃ ┃ ┃ ┃ ┗ 📜7.js
┃ ┃ ┃ ┣ 📜app.js
┃ ┃ ┃ ┗ 📜matchers.js
┃ ┃ ┣ 📂server
┃ ┃ ┃ ┗ 📜internal.js
┃ ┃ ┣ 📜root.js
┃ ┃ ┗ 📜root.svelte
┃ ┣ 📂types
┃ ┃ ┣ 📂src
┃ ┃ ┃ ┗ 📂routes
┃ ┃ ┃   ┣ 📂cart
┃ ┃ ┃   ┃ ┗ 📜$types.d.ts
┃ ┃ ┃   ┣ 📂login
┃ ┃ ┃   ┃ ┗ 📜$types.d.ts
┃ ┃ ┃   ┣ 📂orders
┃ ┃ ┃   ┃ ┗ 📜$types.d.ts
┃ ┃ ┃   ┣ 📂products
┃ ┃ ┃   ┃ ┗ 📜$types.d.ts
┃ ┃ ┃   ┣ 📂signup
┃ ┃ ┃   ┃ ┗ 📜$types.d.ts
┃ ┃ ┃   ┗ 📜$types.d.ts
┃ ┃ ┗ 📜route_meta_data.json
┃ ┣ 📜ambient.d.ts
┃ ┣ 📜non-ambient.d.ts
┃ ┗ 📜tsconfig.json
┣ 📂src
┃ ┣ 📂lib
┃ ┃ ┣ 📂assets
┃ ┃ ┃ ┗ 📜favicon.svg
┃ ┃ ┣ 📂components
┃ ┃ ┃ ┗ 📂ui
┃ ┃ ┃   ┗ 📂navigation-menu
┃ ┃ ┃     ┣ 📜index.ts
┃ ┃ ┃     ┣ 📜navigation-menu-content.svelte
┃ ┃ ┃     ┣ 📜navigation-menu-indicator.svelte
┃ ┃ ┃     ┣ 📜navigation-menu-item.svelte
┃ ┃ ┃     ┣ 📜navigation-menu-link.svelte
┃ ┃ ┃     ┣ 📜navigation-menu-list.svelte
┃ ┃ ┃     ┣ 📜navigation-menu-trigger.svelte
┃ ┃ ┃     ┣ 📜navigation-menu-viewport.svelte
┃ ┃ ┃     ┗ 📜navigation-menu.svelte
┃ ┃ ┣ 📂hooks
┃ ┃ ┣ 📜index.js
┃ ┃ ┗ 📜utils.js
┃ ┣ 📂routes
┃ ┃ ┣ 📂cart
┃ ┃ ┃ ┗ 📜+page.svelte
┃ ┃ ┣ 📂login
┃ ┃ ┃ ┗ 📜+page.svelte
┃ ┃ ┣ 📂orders
┃ ┃ ┃ ┗ 📜+page.svelte
┃ ┃ ┣ 📂products
┃ ┃ ┃ ┗ 📜+page.svelte
┃ ┃ ┣ 📂signup
┃ ┃ ┃ ┗ 📜+page.svelte
┃ ┃ ┣ 📜+layout.svelte
┃ ┃ ┗ 📜+page.svelte
┃ ┣ 📜app.css
┃ ┣ 📜app.d.ts
┃ ┗ 📜app.html
┣ 📂static
┃ ┗ 📜robots.txt
┣ 📜.env
┣ 📜.gitignore
┣ 📜.npmrc
┣ 📜components.json
┣ 📜jsconfig.json
┣ 📜package.json
┣ 📜postcss.config.cjs
┣ 📜README.md
┣ 📜svelte.config.js
┣ 📜tailwind.config.js
┗ 📜vite.config.js

