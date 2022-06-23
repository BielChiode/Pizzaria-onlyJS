let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);
//armazenar qual pizza esta no modal

//Listagem das pizzas
pizzaJson.map((item, index) => {
    let pizzaItem = c('.models .pizza-item').cloneNode(true);
    // preencher as informações em pizzaitem


    pizzaItem.setAttribute('data-key', index);
    //inserindo imagens 
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;

    //inserindo nome, preço, desc
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //função para abrir modal
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQt = 1; //seta o valor dentro do modal sempre como 1
        modalKey = key;

        //inserir os dados quando clica na pizza (imagem, desc, nome, etc)
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        c('.pizzaInfo--qt').innerHTML = modalQt;

        //para fazer animação quando clica na pizza
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });
    //fim função para abrir modal


    c('.pizza-area').append(pizzaItem);
});

//Eventos do modal
function closeModal() {
    c('.pizzaWindowArea').style.opacity = 0;
    setTimeout(() => {
        c('.pizzaWindowArea').style.display = 'none';
    }, 500);
}
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});
//botao de menos do modal
c('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        c('.pizzaInfo--qt').innerHTML = modalQt;
    }
});
//botao de mais do modal
c('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    c('.pizzaInfo--qt').innerHTML = modalQt;
});
//selecionar o tamanho da pizza (P,M,G)
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});
//adicionar ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {
    //Qual o tamanho selecionado
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    let identificador = pizzaJson[modalKey].id + '@' + size;

    let chave = cart.findIndex((item) => item.identificador == identificador);
    //mesma coisa que return item.identificador = identificador;
    if (chave > -1) {
        cart[chave].qt += modalQt;
    } else {
        cart.push({
            identificador,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    updateCart();
    closeModal();
});
//configs mobile
c('.menu-openner').addEventListener('click', () => {
    if (cart.length > 0) {
        c('aside').style.left = '0';
    }
});
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
});
//fim configs mobile

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0) {
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subTotal = 0;
        let desconto = 0;
        let total = 0;



        for (let i in cart) {
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            subTotal += pizzaItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //tirar pizzas dentro do carrinho
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if (cart[i].qt > 1)
                    cart[i].qt--;
                else
                    cart.splice(i, 1);

                updateCart();
            });
            //colocar mais pizzas dentro do carrinho
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });

            c('.cart').append(cartItem);

        }
        desconto = subTotal * 0.1;
        total = subTotal - desconto;

        c('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`


    } else {
        c('aside').classList.remove('show');
        c('aside').style.left = '100vw';
    }
}
