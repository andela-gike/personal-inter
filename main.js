Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },
  template: `
    <div class="product">
          <div class="product-image">
            <img :src="image"/>
          </div>
          <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In Stock</p>
            <p v-else
              :class="{cross: !inStock}">Out of Stock</p>
            <p>Shipping: {{ shipping }}</p>
            <p>{{currentOnSale}}</p>
            <product-details :details="details"></product-details>
            <div v-for="(variant, index) in variants"
                :key="variant.variantId"
                class="color-box"
                :style="{backgroundColor: variant.variantColor}"
                @mouseover="updateProduct(index)">
            </div>
            <button v-on:click="addToCart"
                  :disabled="!inStock"
                  :class="{disabledButton: !inStock}">Add to cart</button>
            <button v-on:click="removeFromCart">Remove from cart</button>
          </div>
          <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
              <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
              </li>
            </ul>
          </div>
          <product-review @review-submitted="addReview"></product-review>
        </div>
      `,
  data() {
    return {
      brand: 'Vue Mastery',
      product: 'Socks',
      selectedVariant: 0,
      link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks',
      onSale: true,
      details: ["80% cotton", "20% polyester", "Gender-neutral"],
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: './assets/vmSocks-green-onWhite.jpg',
          variantQuantity: 10
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: './assets/vmSocks-blue-onWhite.jpg',
          variantQuantity: 0
        }
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
      reviews: []
    }
  },
  methods: {
    addToCart: function () {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    updateProduct: function (index) {
      this.selectedVariant = index
    },
    removeFromCart: function () {
      this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId)
    },
    addReview: function (productReview) {
      this.reviews.push(productReview)
    }
  },
  computed: {
    title: function () {
      return this.brand + ' ' + this.product
    },
    image: function () {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock: function () {
      return this.variants[this.selectedVariant].variantQuantity
    },
    currentOnSale: function () {
      return this.onSale === true ?
        this.brand + ' ' + this.product + ' are on sale' :
        this.brand + ' ' + this.product + ' are not on sale'
    },
    shipping: function () {
      return this.premium === true ? 'Free': 2.99
    }
  }
})

Vue.component('product-details', {
  props: {
    details: {
      type: Array,
      required: true
    }
  },
  template: `
  <ul>
    <li v-for="detail in details">{{detail}}</li>
  </ul>`
})

Vue.component('product-review', {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
      <p>
        <label>Would you recommend this product?</label>
        <input type="radio" value="Yes" v-model="recommend">Yes</input>
        <input type="radio" value="No" v-model="recommend">No</input>
      </p>
      <p>
        <input type="submit" value="Submit">
      </p>
    </form>`,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
      recommend: null,
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.rating && this.review) {
        let productReview = {
          name: this.name,
          rating: this.rating,
          review: this.review,
          recommend: this.recommend
        }
        this.$emit('review-submitted', productReview)
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null
      } else {
        if (!this.name) this.errors.push("Name Required")
        if(!this.rating) this.errors.push("Rating Required")
        if (!this.review) this.errors.push("Review Required")
        if(!this.recommend) this.errors.push("Recommendation required.")
      }
    }
  }
})

var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id)
    },
    removeFromCart(id) {
      if (this.cart.length > 0) {
        for(var i = this.cart.length - 1; i >= 0; i--) {
          if (this.cart[i] === id) {
             this.cart.splice(i, 1);
          }
        }
      } else {
        this.cart = []
      }
    }
  }
});