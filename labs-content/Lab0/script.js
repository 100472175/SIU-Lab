const wishlist = {
  items: [],

  element: document.querySelector("#wishlist"),

  clear() {
    this.element.querySelectorAll('li').forEach((li) => {
      this.element.removeChild(li);
    });
  },

  contains(item) {
    return this.items.findIndex((item_) => item_.id === item.id) >= 0;
  },

  add(product) {
    if (this.contains(product)) {
      console.log("Product already in the list");
      return;
    }
    this.items.push(product);
    this.items.sort((a, b) => a.id.substring(1) - b.id.substring(1));
    this.render();
  },

  remove(item_id) {
    let idex = this.items.findIndex((index) => item_id === index.id);
    if (idex === -1) {
      return;
    }
    this.items.splice(idex, 1);
    this.render();
  },

  render() {
    this.clear(); // removes all the childs, li elements, from the ul element

    this.items.forEach((item) => {
      const element = document.createElement('li');
      const remove_btn = document.createElement('button');
      remove_btn.innerHTML = '-';
      remove_btn.addEventListener('click', (e) => {
        this.remove(item.id);
      });
      element.innerHTML = item.name;
      element.appendChild(remove_btn);
      this.element.appendChild(element);
    });
  },
};


document.querySelectorAll('.add-to-whislist').forEach((e) => {
  e.addEventListener('click', (ev) => {
    const element = ev.target;
    wishlist.add({
      id: element.dataset.id,
      name: element.dataset.name
    });

  })
});


document.querySelector('.clear-wishlist').addEventListener('click', () => {
  wishlist.clear();
  wishlist.items = [];
  console.log("Wishlist cleared");
});



document.getElementById('add-product').addEventListener('click', () => {
  // Get the highest id and add 1:
  // Usando un max manual
  /*
  let count = 0;
  document.querySelectorAll('.add-to-whislist').forEach((e) => {
    if (e.dataset.id[1] > count) {
      count = e.dataset.id[1];
    }
  });
  */
    
  // Usando Math.max
  //et existing_items = Array.from(document.querySelectorAll('.add-to-whislist'));
  //let count = Math.max(...existing_items.map((e) => e.dataset.id[1]));
  //count++;

  // Si se usa id[1], cuando se llegue a números de 2 cifras, se queda pillado, por lo que se cambia a substring

  // Usando Math.max y querySelectorAll en la misma linea
  //let count_ = Math.max(...Array.from(document.querySelectorAll('.add-to-whislist')).map((e) => e.dataset.id.substring(1))) + 1;

  let existing_items = Array.from(document.querySelectorAll('.add-to-whislist'));
  let count = Math.max(...existing_items.map((e) => e.dataset.id.substring(1))) + 1;


  const element = document.createElement('li');
  const name_add = document.createElement('span');
  const add_btn = document.createElement('button');
  add_btn.innerHTML = '+';
  add_btn.id = 'product-' + count;
  name_add.innerHTML = 'Product ' + count + " ";
  add_btn.dataset.id = 'P' + count;
  add_btn.dataset.name = 'Product ' + count;
  add_btn.classList.add("add-to-whislist");
  element.appendChild(name_add);
  element.appendChild(add_btn);
  document.querySelector('#product-list').appendChild(element);

  add_btn.addEventListener('click', (ev) => {
    const element = ev.target;
    wishlist.add({
      id: element.dataset.id,
      name: element.dataset.name
    });
  });
});


let gyroscope = new Gyroscope({ frequency: 10 });
console.log("Gyroscope is working");
gyroscope.onreading = (g) => {
  if (gyroscope.x > 4) {
    document.querySelector('.clear-wishlist').click();
  }
};
gyroscope.start();