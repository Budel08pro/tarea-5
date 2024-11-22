// Cargar los datos de los productos desde el archivo JSON
fetch('data.json')
    .then(response => {
        // Comprobamos si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error en la carga de los productos');
        }
        return response.json();
    })
    .then(products => {
        // Obtener el contenedor de productos
        const container = document.getElementById('productos');
        
        // Limpiar el contenedor antes de agregar nuevos productos
        container.innerHTML = '';

        // Función para cargar los productos (filtrados o todos)
        function loadProducts(filteredProducts = products) {
            // Limpiar el contenedor antes de agregar nuevos productos
            container.innerHTML = '';
            
            // Iterar sobre los productos y crear las tarjetas
            filteredProducts.forEach(product => {
                // Crear el contenedor de cada tarjeta
                const productCard = document.createElement('div');
                productCard.classList.add('col-md-4', 'my-3');

                // Crear el contenido HTML de la tarjeta del producto
                productCard.innerHTML = `
                    <div class="card shadow-sm h-100">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}" aria-describedby="product-${product.id}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description}</p>
                            <p class="card-text"><strong>Precio: $${product.price}</strong></p>
                            <button class="btn btn-primary mt-auto" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#purchaseModal" 
                                    data-title="${product.name}" 
                                    data-price="${product.price}" 
                                    data-id="${product.id}">
                                Comprar
                            </button>
                        </div>
                    </div>
                `;
                // Añadir la tarjeta del producto al contenedor
                container.appendChild(productCard);
            });

            // Agregar evento a los botones de "Comprar"
            document.querySelectorAll('.btn-primary').forEach(button => {
                button.addEventListener('click', (e) => {
                    const title = e.target.getAttribute('data-title');
                    const price = e.target.getAttribute('data-price');
                    const id = e.target.getAttribute('data-id');

                    // Llenar el modal con la información del producto
                    document.getElementById('modalProductTitle').textContent = title;
                    document.getElementById('modalProductPrice').textContent = `Precio: $${price}`;
                    document.getElementById('productId').value = id;
                });
            });
        }

        // Función para buscar productos
        function searchProducts(event) {
            event.preventDefault(); // Evitar el comportamiento por defecto del formulario
            const searchQuery = document.getElementById('searchInput').value.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchQuery) || 
                product.description.toLowerCase().includes(searchQuery)
            );
            loadProducts(filteredProducts); // Cargar los productos filtrados
        }

        // Inicializar los productos al cargar la página
        loadProducts(); // Cargar todos los productos inicialmente

        // Agregar el evento de búsqueda
        const searchForm = document.getElementById('searchForm');
        searchForm.addEventListener('submit', searchProducts);

        // Agregar el evento de envío del formulario para la compra
        const purchaseForm = document.getElementById('purchaseForm');
        purchaseForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

            // Capturamos la información del formulario
            const buyerName = document.getElementById('buyerName').value;
            const buyerAddress = document.getElementById('buyerAddress').value;
            const buyerEmail = document.getElementById('buyerEmail').value;
            const productId = document.getElementById('productId').value;
            const productQuantity = document.getElementById('productQuantity').value;

            // Aquí podrías realizar una llamada a un servidor o API para procesar el pedido, si lo deseas

            // Mostrar un mensaje de confirmación
            alert(`¡Gracias por tu compra, ${buyerName}!\n\nDetalles del pedido:\nProducto ID: ${productId}\nCantidad: ${productQuantity}\nDirección: ${buyerAddress}\nCorreo: ${buyerEmail}`);

            // Limpiar el formulario
            purchaseForm.reset();

            // Cerrar el modal después de enviar el formulario
            const modal = new bootstrap.Modal(document.getElementById('purchaseModal'));
            modal.hide();
        });
    })
    .catch(error => {
        console.error('Error cargando los productos:', error);
        const container = document.getElementById('productos');
        container.innerHTML = '<p class="text-danger">Hubo un problema al cargar los productos. Por favor, intente más tarde.</p>';
    });
