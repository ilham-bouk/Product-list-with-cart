let contnt = document.querySelector(".content");
let sideEmpty = document.querySelector(".side .empty");
let sideOrder = document.querySelector(".side .order");

function getcarts() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let dataObject = JSON.parse(this.responseText);
      let cartsCount = dataObject.length;

      createCarts(dataObject, cartsCount);

      let btnContainers = document.querySelectorAll(".cart .image");
      addToOrder(btnContainers, dataObject);
    }
  };

  myRequest.open("GET", "data.json", true);
  myRequest.send();
}

getcarts();

function createCarts(obj, count) {
  for (let i = 0; i < count; i++) {
    // Create cart : .image .info
    let cart = document.createElement("div");
    cart.classList.add(`cart`);
    cart.id = i;

    // Creat image div : img + button.notAdd + button.added
    let imgContainer = document.createElement("div");
    imgContainer.classList.add("image");

    let image = document.createElement("img");
    image.src = obj[i].image.desktop;
    image.alt = "dessert-image";
    imgContainer.appendChild(image);

    let notAddBtn = document.createElement("button");
    notAddBtn.classList.add("notAdd");

    let notAddImg = document.createElement("img");
    notAddImg.src = "./images/icon-add-to-cart.svg";
    notAddImg.alt = "add-to-cart";
    notAddBtn.appendChild(notAddImg);
    let notAddText = document.createTextNode("Add to Cart");
    notAddBtn.appendChild(notAddText);

    imgContainer.appendChild(notAddBtn);

    let addedBtn = document.createElement("button");
    addedBtn.classList.add("added");

    let plusIcon = document.createElement("i");
    plusIcon.classList.add("fa-solid");
    plusIcon.classList.add("fa-plus");
    addedBtn.appendChild(plusIcon);

    let span = document.createElement("span");
    span.innerHTML = "1";
    addedBtn.appendChild(span);
    
    let minusIcon = document.createElement("i");
    minusIcon.classList.add("fa-solid");
    minusIcon.classList.add("fa-minus");
    addedBtn.appendChild(minusIcon);
    
    imgContainer.appendChild(addedBtn);

    // Create info div : .category + .name + .price
    let info = document.createElement("div");
    info.classList.add("info");
    
    let category = document.createElement("div");
    category.classList.add("category");
    category.innerHTML = obj[i].category;
    info.appendChild(category);

    let name = document.createElement("div");
    name.classList.add("name");
    name.innerHTML = obj[i].name;
    info.appendChild(name);

    let price = document.createElement("div");
    price.classList.add("price");
    price.innerHTML = `$${obj[i].price.toFixed(2)}`;
    info.appendChild(price);
    
    // Appand in cart & content
    cart.appendChild(imgContainer);
    cart.appendChild(info);
    contnt.appendChild(cart);
  }
}

function addToOrder(btnContainers, obj) {
  let orderTotalSpan = document.querySelector(".order-total span");
  let orderTotalVal = 0;
  orderTotalSpan.innerHTML = `$${orderTotalVal.toFixed(2)}`;
  let confirmBtn = document.querySelector(".order button");

  btnContainers.forEach((imgContainer) => {
    imgContainer.children[1].onclick = function () {
      // Add order
      imgContainer.children[1].style.display = "none";
      imgContainer.children[2].style.display = "flex";
      imgContainer.classList.add("add");
      sideEmpty.style.display = "none";
      sideOrder.style.display = "block";

      // Create Order Side : box 
      let orderBox = document.querySelector(".order-box");
      // console.log(orderBox);
      let box = document.createElement("div");
      box.classList.add("box");
      box.id = imgContainer.parentElement.id;
      let info = document.createElement("div");
      info.classList.add("info");
      let name = document.createElement("div");
      name.classList.add("name");
      name.innerHTML = obj[imgContainer.parentElement.id].name;

      info.appendChild(name);

      let price = document.createElement("div");
      price.classList.add("price");
      let quantity = document.createElement("span");
      quantity.classList.add("quantity");
      quantity.innerHTML = 1;
      let single = document.createElement("span");
      single.classList.add("single");
      single.innerHTML = "@" + obj[imgContainer.parentElement.id].price;
      let total = document.createElement("span");
      let totalVal = obj[imgContainer.parentElement.id].price;
      total.classList.add("total");
      total.innerHTML = `$${totalVal.toFixed(2)}`;

      price.appendChild(quantity);
      price.appendChild(single);
      price.appendChild(total);

      info.appendChild(price);
      box.appendChild(info);

      let image = document.createElement("img");
      image.src = "./images/icon-remove-item.svg";
      image.alt = "remove-item";
      box.appendChild(image);

      orderBox.appendChild(box);

      orderTotalVal += totalVal;
      orderTotalSpan.innerHTML = `$${orderTotalVal.toFixed(2)}`;
      
      imgContainer.children[2].children[0].onclick = function () {
        imgContainer.children[2].children[1].innerHTML++;
        quantity.innerHTML++;
        totalVal += obj[imgContainer.parentElement.id].price;
        total.innerHTML = `$${totalVal.toFixed(2)}`;
        orderTotalVal += obj[imgContainer.parentElement.id].price;
        orderTotalSpan.innerHTML = `$${orderTotalVal.toFixed(2)}`;
      }

      imgContainer.children[2].children[2].onclick = function () {
        if (imgContainer.children[2].children[1].innerHTML > 1) {
          imgContainer.children[2].children[1].innerHTML--;
          quantity.innerHTML--;
          totalVal -= obj[imgContainer.parentElement.id].price;
          total.innerHTML = `$${totalVal.toFixed(2)}`;
          orderTotalVal -= obj[imgContainer.parentElement.id].price;
          orderTotalSpan.innerHTML = `$${orderTotalVal.toFixed(2)}`;
        } else {
          imgContainer.children[1].style.display = "flex";
          imgContainer.children[2].style.display = "none";
          box.remove();
          orderTotalVal -= obj[imgContainer.parentElement.id].price;
          orderTotalSpan.innerHTML = `$${orderTotalVal.toFixed(2)}`;
          if (orderBox.children.length == 0) {
            sideEmpty.style.display = "block";
            sideOrder.style.display = "none";
            orderTotalVal = 0
          }
        }
      }

      image.onclick = function () {
        box.remove();
        imgContainer.children[1].style.display = "flex";
        imgContainer.children[2].style.display = "none";
        imgContainer.children[2].children[1].innerHTML = 1;
        orderTotalVal -= totalVal;
        orderTotalSpan.innerHTML = `$${orderTotalVal.toFixed(2)}`;
        if (orderBox.children.length == 0) {
          sideEmpty.style.display = "block";
          sideOrder.style.display = "none";
          orderTotalVal = 0
        }
      }
      
      confirmBtn.onclick = function () {
        confirmOrder(orderBox, orderBox.children.length, obj);
      }
    }
  });
  
}

function confirmOrder(orderBox, count,obj) {
  let confirm = document.querySelector(".confirm");
  let overlay = document.querySelector(".overlay");
  let boxContainer = document.querySelector(".boxs");
  confirm.style.display = "block";
  overlay.style.display = "block";
  
  for (let i = 0; i < count; i++) {    
    let box = document.createElement("div");
    box.classList.add("box");
    box.id = orderBox.children[i].id;    

    let image = document.createElement("img");
    image.src = obj[box.id].image.thumbnail;
    image.alt = "dessert-img";
    box.appendChild(image);
    let info = document.createElement("div");
    info.classList.add("info");

    let right = document.createElement("div");
    right.classList.add("right");
    let name = document.createElement("div");
    name.classList.add("name");
    name.innerHTML = obj[box.id].name;
    right.appendChild(name);
    let price = document.createElement("div");
    price.classList.add("price");
    let quantity = document.createElement("span");
    quantity.classList.add("quantity");
    quantity.innerHTML = orderBox.children[i].children[0].children[1].children[0].innerHTML;
    price.appendChild(quantity);
    let single = document.createElement("span");
    single.classList.add("single");
    single.innerHTML = `@${obj[box.id].price}`;
    price.appendChild(single);

    let total = document.createElement("div");
    total.classList.add("total");
    total.innerHTML = orderBox.children[i].children[0].children[1].children[2].innerHTML;

    right.appendChild(price);
    info.appendChild(right);
    info.appendChild(total);
    box.appendChild(info);
    boxContainer.appendChild(box);

    let orderTotalSpan = document.querySelector(".confirm .order-total span");
    orderTotalSpan.innerHTML = sideOrder.children[1].children[0].innerHTML;
  }
  
  document.querySelector(".confirm button").onclick = function() {
    window.location.reload();
  }
}


