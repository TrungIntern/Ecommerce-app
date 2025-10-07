<script lang="ts">
  import { onMount } from 'svelte';

  // định nghĩa kiểu Product tương ứng với schema
  interface Product {
    id: string;
    title: string;
    description?: string;
    price: number;
    imageUrl?: string;
    createdAt: string; // Prisma trả về DateTime dạng ISO string
    updatedAt: string;
  }

  let products: Product[] = [];

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:4000/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      products = await res.json();
    } catch (err) {
      console.error(err);
      products = [];
    }
  });
</script>

<h1>Products</h1>
{#if products.length === 0}
  <p>Chưa có sản phẩm</p>
{:else}
  <div class="grid grid-cols-3 gap-4">
    {#each products as p (p.id)}
      <div class="p-4 border rounded">
        <h2 class="text-lg font-bold">{p.title}</h2>
        <p>{p.description}</p>
        <p class="mt-2">
          Giá: {p.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        </p>
      </div>
    {/each}
  </div>
{/if}

